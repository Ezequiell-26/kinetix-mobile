/**
 * backups.ts - Sistema de backups automatizados para PostgreSQL
 *
 * Características:
 * - Backup completo de la base de datos
 * - Compresión gzip
 * - Subida automática a S3 (opcional)
 * - Rotación de backups antiguos
 * - Logs estructurados para monitoreo
 */

import { execFile } from "child_process";
import { promisify } from "util";
import { createReadStream, createWriteStream } from "fs";
import { mkdir, readdir, stat, unlink } from "fs/promises";
import { pipeline } from "stream/promises";
import { createGzip } from "zlib";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";

const execFileAsync = promisify(execFile);

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

type DatabaseCredentials = {
  user: string;
  password: string;
  host: string;
  port: string;
  database: string;
};

export class BackupService {
  private config: BackupConfig;

  constructor(config: BackupConfig) {
    this.config = config;
  }

  async createBackup(): Promise<BackupResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupId = randomUUID().slice(0, 8);
    const filename = `backup-${timestamp}-${backupId}.sql`;
    const filePath = join(this.config.backupDir, filename);
    const gzippedPath = `${filePath}.gz`;

    try {
      const db = this.parseDatabaseUrl(this.config.databaseUrl);
      await mkdir(this.config.backupDir, { recursive: true });

      // Nunca pasar credenciales por un shell command string.
      await execFileAsync(
        "pg_dump",
        ["-h", db.host, "-p", db.port, "-U", db.user, "-d", db.database, "-F", "p", "-f", filePath],
        {
          env: { ...process.env, PGPASSWORD: db.password },
          maxBuffer: 50 * 1024 * 1024,
        },
      );

      await pipeline(createReadStream(filePath), createGzip({ level: 9 }), createWriteStream(gzippedPath));
      await unlink(filePath).catch(() => undefined);

      const sizeBytes = (await stat(gzippedPath)).size;
      let s3Url: string | undefined;
      if (this.config.s3Bucket && this.config.awsAccessKeyId && this.config.awsSecretAccessKey) {
        s3Url = await this.uploadToS3(gzippedPath, filename);
      }

      await this.rotateOldBackups();
      return { success: true, filePath: gzippedPath, s3Url, sizeBytes, timestamp };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      console.error("[BACKUP] Error creating backup:", errorMessage);
      await unlink(filePath).catch(() => undefined);
      await unlink(gzippedPath).catch(() => undefined);
      return { success: false, timestamp, error: errorMessage };
    }
  }

  private parseDatabaseUrl(url: string): DatabaseCredentials {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      throw new Error("DATABASE_URL inválido");
    }
    if (!(parsed.protocol === "postgresql:" || parsed.protocol === "postgres:")) {
      throw new Error("DATABASE_URL debe usar PostgreSQL");
    }
    if (!parsed.hostname || !parsed.username || !parsed.pathname.slice(1)) {
      throw new Error("DATABASE_URL incompleto");
    }
    return {
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      host: parsed.hostname,
      port: parsed.port || "5432",
      database: decodeURIComponent(parsed.pathname.slice(1)),
    };
  }

  private async uploadToS3(filePath: string, filename: string): Promise<string> {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const client = new S3Client({
      region: this.config.awsRegion || "us-east-1",
      credentials: { accessKeyId: this.config.awsAccessKeyId!, secretAccessKey: this.config.awsSecretAccessKey! },
    });
    const fileContent = await import("fs/promises").then(({ readFile }) => readFile(filePath));
    const yearMonth = new Date().toISOString().slice(0, 7).replace("-", "/");
    const s3Key = `backups/${yearMonth}/${filename}.gz`;
    await client.send(new PutObjectCommand({
      Bucket: this.config.s3Bucket!,
      Key: s3Key,
      Body: fileContent,
      ContentType: "application/gzip",
      ServerSideEncryption: "AES256",
    }));
    return `s3://${this.config.s3Bucket}/${s3Key}`;
  }

  private async rotateOldBackups(): Promise<void> {
    const maxBackups = Math.max(1, this.config.maxBackups || 7);
    try {
      const files = await readdir(this.config.backupDir);
      const backupFiles = files.filter((f) => f.startsWith("backup-") && f.endsWith(".sql.gz")).sort().reverse();
      for (const oldFile of backupFiles.slice(maxBackups)) {
        await unlink(join(this.config.backupDir, oldFile));
        console.log(`[BACKUP] Rotated old backup: ${oldFile}`);
      }
    } catch (error) {
      console.error("[BACKUP] Error rotating old backups:", error);
    }
  }

  async listBackups(): Promise<Array<{ filename: string; sizeBytes: number; createdAt: string }>> {
    try {
      const files = await readdir(this.config.backupDir);
      const backupFiles = files.filter((f) => f.startsWith("backup-") && f.endsWith(".sql.gz"));
      const backups = await Promise.all(
        backupFiles.map(async (filename) => {
          const stats = await stat(join(this.config.backupDir, filename));
          return { filename, sizeBytes: stats.size, createdAt: stats.mtime.toISOString() };
        }),
      );
      return backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error("[BACKUP] Error listing backups:", error);
      return [];
    }
  }

  async restoreBackup(backupPath: string): Promise<{ success: boolean; error?: string }> {
    try {
      const db = this.parseDatabaseUrl(this.config.databaseUrl);
      const resolvedPath = join(this.config.backupDir, backupPath.replace(/^.*[\\/]/, ""));
      if (!resolvedPath.startsWith(`${this.config.backupDir}/`) || !resolvedPath.endsWith(".sql.gz")) {
        throw new Error("Ruta de backup inválida");
      }

      // Sin shell: gunzip escribe SQL a stdout y psql lo consume.
      const gunzip = await import("child_process").then(({ spawn }) => spawn("gunzip", ["-c", resolvedPath], { stdio: ["ignore", "pipe", "pipe"] }));
      const psql = await import("child_process").then(({ spawn }) => spawn("psql", ["-h", db.host, "-p", db.port, "-U", db.user, "-d", db.database], {
        env: { ...process.env, PGPASSWORD: db.password },
        stdio: ["pipe", "ignore", "pipe"],
      }));

      gunzip.stdout.pipe(psql.stdin);
      const [gunzipResult, psqlResult] = await Promise.all([
        new Promise<{ code: number | null; stderr: string }>((resolve) => {
          let stderr = "";
          gunzip.stderr.on("data", (chunk) => { stderr += String(chunk); });
          gunzip.on("close", (code) => resolve({ code, stderr }));
        }),
        new Promise<{ code: number | null; stderr: string }>((resolve) => {
          let stderr = "";
          psql.stderr.on("data", (chunk) => { stderr += String(chunk); });
          psql.on("close", (code) => resolve({ code, stderr }));
        }),
      ]);
      if (gunzipResult.code !== 0) throw new Error(gunzipResult.stderr || "gunzip falló");
      if (psqlResult.code !== 0) throw new Error(psqlResult.stderr || "psql falló");
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      console.error("[BACKUP] Error restoring backup:", errorMessage);
      return { success: false, error: errorMessage };
    }
  }
}

export function createBackupService(): BackupService {
  const backupDir = process.env.BACKUP_DIR || join(tmpdir(), "kinetix-backups");
  void mkdir(backupDir, { recursive: true }).catch((error) => console.error("[BACKUP] Error creating backup directory:", error));

  return new BackupService({
    databaseUrl: process.env.DATABASE_URL || "",
    s3Bucket: process.env.BACKUP_S3_BUCKET,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
    backupDir,
    maxBackups: Number.parseInt(process.env.BACKUP_MAX_COUNT || "7", 10),
  });
}

export const backupService = createBackupService();
