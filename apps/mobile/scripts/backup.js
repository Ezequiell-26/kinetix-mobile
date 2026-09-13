#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const BACKUP_DIR = process.env.BACKUP_DIR || path.join(__dirname, '../backups');
const DB_PATH = process.env.DATABASE_URL?.replace('file:', '') || path.join(__dirname, '../prisma/dev.db');
const UPLOADS_DIR = path.join(__dirname, '../public/uploads');
const MAX_BACKUPS = 7;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function generateBackupName() {
  const date = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const hash = crypto.randomBytes(4).toString('hex');
  return `backup-${date}-${hash}`;
}

function backupDatabase(backupName) {
  console.log('[BACKUP] Iniciando backup de base de datos...');
  const backupPath = path.join(BACKUP_DIR, backupName, 'database.db');
  ensureDir(path.dirname(backupPath));
  if (fs.existsSync(DB_PATH)) {
    fs.copyFileSync(DB_PATH, backupPath);
    console.log('[BACKUP] Database guardada en:', backupPath);
    return true;
  }
  console.warn('[BACKUP] No se encontro la base de datos');
  return false;
}

function backupUploads(backupName) {
  console.log('[BACKUP] Iniciando backup de archivos subidos...');
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.log('[BACKUP] No hay directorio de uploads');
    return false;
  }
  const tarballPath = path.join(BACKUP_DIR, backupName + '-uploads.tar.gz');
  try {
    execSync('tar -czf "' + tarballPath + '" -C "' + path.dirname(UPLOADS_DIR) + '" "' + path.basename(UPLOADS_DIR) + '"');
    console.log('[BACKUP] Uploads guardados en:', tarballPath);
    return true;
  } catch (error) {
    console.error('[BACKUP] Error al comprimir uploads:', error.message);
    return false;
  }
}

function cleanupOldBackups() {
  console.log('[BACKUP] Limpiando backups antiguos...');
  const backups = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith('backup-'))
    .sort()
    .reverse();
  if (backups.length > MAX_BACKUPS) {
    const toDelete = backups.slice(MAX_BACKUPS);
    toDelete.forEach(backup => {
      const backupPath = path.join(BACKUP_DIR, backup);
      try {
        fs.rmSync(backupPath, { recursive: true, force: true });
        console.log('[BACKUP] Eliminado:', backup);
      } catch (error) {
        console.error('[BACKUP] Error al eliminar', backup, ':', error.message);
      }
    });
  }
}

function main() {
  console.log('[BACKUP] === Inicio del proceso de backup ===');
  console.log('[BACKUP] Fecha:', new Date().toISOString());
  ensureDir(BACKUP_DIR);
  const backupName = generateBackupName();
  ensureDir(path.join(BACKUP_DIR, backupName));
  let success = true;
  success = backupDatabase(backupName) && success;
  success = backupUploads(backupName) && success;
  cleanupOldBackups();
  if (success) {
    console.log('[BACKUP] === Backup completado exitosamente ===');
    process.exit(0);
  } else {
    console.warn('[BACKUP] === Backup completado con advertencias ===');
    process.exit(1);
  }
}

main();
