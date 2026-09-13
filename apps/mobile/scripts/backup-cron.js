#!/usr/bin/env node
/**
 * backup-cron.js - Script para backups automáticos programados
 * 
 * Uso:
 *   node scripts/backup-cron.js
 * 
 * Este script está diseñado para ser ejecutado por un cron job o scheduler.
 * Realiza un backup completo y lo sube a S3 si está configurado.
 */

const { backupService } = require('../src/lib/backups');

async function main() {
  console.log('[CRON BACKUP] === Inicio del backup automático ===');
  console.log('[CRON BACKUP] Fecha:', new Date().toISOString());

  try {
    const result = await backupService.createBackup();

    if (result.success) {
      console.log('[CRON BACKUP] === Backup completado exitosamente ===');
      console.log('[CRON BACKUP] Archivo:', result.filePath);
      console.log('[CRON BACKUP] Tamaño:', result.sizeBytes ? `${(result.sizeBytes / (1024 * 1024)).toFixed(2)} MB` : 'N/A');
      
      if (result.s3Url) {
        console.log('[CRON BACKUP] S3 URL:', result.s3Url);
      }
      
      process.exit(0);
    } else {
      console.error('[CRON BACKUP] Error durante el backup:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('[CRON BACKUP] Error fatal:', error.message);
    process.exit(1);
  }
}

main();
