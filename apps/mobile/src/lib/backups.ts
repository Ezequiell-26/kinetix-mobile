/**
 * backups.ts - Sistema de backups automatizados para PostgreSQL
 * 
 * Características:
 * - Backup completo de la base de datos
 * - Compresión gzip
 * - Subida automática a S3 (opcional)
 * - Rotación de backups antiguos (máximo 7 días)
 * - Logs estructurados para monitoreo
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { createReadStream, createWriteStream, unlinkSync } from 'fs';
import { pipeline } from 'stream/promises';
import { createGzip } from 'zlib';
import { join } from 'path';
import { tmpdir } from 'os';
import { v4 as uuidv4 } from 'uuid';

const execAsync = promisify(exec);

interface BackupConfig {
  databaseUrl: string;
  s3Bucket?: string;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  awsRegion?: string;
  maxBackups?: number;
  backupDir: string;
}

interface BackupResult {
  success: boolean;
  filePath?: string;
  s3Url?: string;
  sizeBytes?: number;
  timestamp: string;
  error?: string;
}

export class BackupService {
  private config: BackupConfig;

  constructor(config: BackupConfig) {
    this.config = config;
  }

  /**
   * Realiza un backup completo de la base de datos
   */
  async createBackup(): Promise<BackupResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupId = uuidv4().split('-')[0];
    const filename = `backup-${timestamp}-${backupId}.sql`;
    const filePath = join(this.config.backupDir, filename);
    const gzippedPath = `${filePath}.gz`;

    try {
      // Extraer credenciales de DATABASE_URL
      const dbCredentials = this.parseDatabaseUrl(this.config.databaseUrl);
      
      // Ejecutar pg_dump
      const dumpCommand = `PGPASSWORD="${dbCredentials.password}" pg_dump -h ${dbCredentials.host} -U ${dbCredentials.user} -d ${dbCredentials.database} -F p -f "${filePath}"`;
      
      await execAsync(dumpCommand, {
        env: { ...process.env, PGPASSWORD: dbCredentials.password },
        maxBuffer: 50 * 1024 * 1024 // 50MB buffer
      });

      // Comprimir con gzip
      await this.compressFile(filePath, gzippedPath);
      
      // Eliminar archivo SQL sin comprimir
      unlinkSync(filePath);

      // Obtener tamaño del archivo
      const { sizeBytes } = await this.getFileSize(gzippedPath);

      let s3Url: string | undefined;

      // Subir a S3 si está configurado
      if (this.config.s3Bucket && this.config.awsAccessKeyId && this.config.awsSecretAccessKey) {
        s3Url = await this.uploadToS3(gzippedPath, filename);
      }

      // Rotar backups antiguos
      await this.rotateOldBackups();

      return {
        success: true,
        filePath: gzippedPath,
        s3Url,
        sizeBytes,
        timestamp,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('[BACKUP] Error creating backup:', errorMessage);
      
      // Limpiar archivos parciales si existen
      try {
        if (filePath) unlinkSync(filePath);
        if (gzippedPath) unlinkSync(gzippedPath);
      } catch (cleanupError) {
        console.error('[BACKUP] Error cleaning up partial files:', cleanupError);
      }

      return {
        success: false,
        timestamp,
        error: errorMessage,
      };
    }
  }

  /**
   * Parsea DATABASE_URL para obtener credenciales
   */
  private parseDatabaseUrl(url: string) {
    // postgresql://user:password@host:port/database
    const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:/]+):?(\d+)?\/([^?]+)/);
    if (!match) {
      throw new Error('DATABASE_URL inválido');
    }
    
    return {
      user: match[1],
      password: decodeURIComponent(match[2]),
      host: match[3],
      port: match[4] || '5432',
      database: match[5].split('?')[0],
    };
  }

  /**
   * Comprime un archivo usando gzip
   */
  private async compressFile(inputPath: string, outputPath: string): Promise<void> {
    const readStream = createReadStream(inputPath);
    const writeStream = createWriteStream(outputPath);
    const gzip = createGzip({ level: 9 }); // Máxima compresión

    await pipeline(readStream, gzip, writeStream);
  }

  /**
   * Obtiene el tamaño de un archivo en bytes
   */
  private async getFileSize(filePath: string): Promise<{ sizeBytes: number }> {
    const fs = await import('fs/promises');
    const stats = await fs.stat(filePath);
    return { sizeBytes: stats.size };
  }

  /**
   * Sube un archivo a Amazon S3
   */
  private async uploadToS3(filePath: string, filename: string): Promise<string> {
    // Usar AWS SDK v3
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
    
    const client = new S3Client({
      region: this.config.awsRegion || 'us-east-1',
      credentials: {
        accessKeyId: this.config.awsAccessKeyId!,
        secretAccessKey: this.config.awsSecretAccessKey!,
      },
    });

    const fs = await import('fs/promises');
    const fileContent = await fs.readFile(filePath);

    const date = new Date();
    const yearMonth = date.toISOString().slice(0, 7).replace('-', '/'); // YYYY/MM
    const s3Key = `backups/${yearMonth}/${filename}`;

    const command = new PutObjectCommand({
      Bucket: this.config.s3Bucket,
      Key: s3Key,
      Body: fileContent,
      ContentType: 'application/gzip',
      ServerSideEncryption: 'AES256',
    });

    await client.send(command);

    return `s3://${this.config.s3Bucket}/${s3Key}`;
  }

  /**
   * Rota backups antiguos, manteniendo solo los últimos N backups
   */
  private async rotateOldBackups(): Promise<void> {
    const fs = await import('fs/promises');
    const maxBackups = this.config.maxBackups || 7;

    try {
      const files = await fs.readdir(this.config.backupDir);
      const backupFiles = files
        .filter(f => f.startsWith('backup-') && f.endsWith('.sql.gz'))
        .sort()
        .reverse(); // Más recientes primero

      // Eliminar backups antiguos
      for (let i = maxBackups; i < backupFiles.length; i++) {
        const oldFile = join(this.config.backupDir, backupFiles[i]);
        await fs.unlink(oldFile);
        console.log(`[BACKUP] Rotated old backup: ${backupFiles[i]}`);
      }
    } catch (error) {
      console.error('[BACKUP] Error rotating old backups:', error);
    }
  }

  /**
   * Lista todos los backups disponibles
   */
  async listBackups(): Promise<Array<{ filename: string; sizeBytes: number; createdAt: string }>> {
    const fs = await import('fs/promises');
    
    try {
      const files = await fs.readdir(this.config.backupDir);
      const backupFiles = files.filter(f => f.startsWith('backup-') && f.endsWith('.sql.gz'));
      
      const backups = await Promise.all(
        backupFiles.map(async (filename) => {
          const filePath = join(this.config.backupDir, filename);
          const stats = await fs.stat(filePath);
          return {
            filename,
            sizeBytes: stats.size,
            createdAt: stats.mtime.toISOString(),
          };
        })
      );

      return backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('[BACKUP] Error listing backups:', error);
      return [];
    }
  }

  /**
   * Restaura un backup desde un archivo
   */
  async restoreBackup(backupPath: string): Promise<{ success: boolean; error?: string }> {
    try {
      const dbCredentials = this.parseDatabaseUrl(this.config.databaseUrl);
      
      // Descomprimir y restaurar
      const restoreCommand = `gunzip -c "${backupPath}" | PGPASSWORD="${dbCredentials.password}" psql -h ${dbCredentials.host} -U ${dbCredentials.user} -d ${dbCredentials.database}`;
      
      await execAsync(restoreCommand, {
        env: { ...process.env, PGPASSWORD: dbCredentials.password },
        maxBuffer: 100 * 1024 * 1024 // 100MB buffer
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('[BACKUP] Error restoring backup:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }
}

/**
 * Factory para crear instancia del servicio de backups
 */
export function createBackupService(): BackupService {
  const backupDir = process.env.BACKUP_DIR || join(tmpdir(), 'kinetix-backups');
  
  // Crear directorio si no existe
  import('fs').then(({ mkdirSync }) => {
    try {
      mkdirSync(backupDir, { recursive: true });
    } catch (error) {
      console.error('[BACKUP] Error creating backup directory:', error);
    }
  });

  return new BackupService({
    databaseUrl: process.env.DATABASE_URL!,
    s3Bucket: process.env.BACKUP_S3_BUCKET,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
    backupDir,
    maxBackups: parseInt(process.env.BACKUP_MAX_COUNT || '7', 10),
  });
}

// Exportar instancia singleton
export const backupService = createBackupService();
