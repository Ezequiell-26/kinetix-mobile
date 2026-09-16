import { NextResponse } from "next/server";
import { backupService } from "@/lib/backups";
import { getCurrentUser } from "@/lib/auth";

function isBackupAdmin(userId: string) {
  const configured = process.env.BACKUP_ADMIN_USER_IDS || "";
  const ids = configured.split(",").map((id) => id.trim()).filter(Boolean);
  return ids.length > 0 && ids.includes(userId);
}

function serverError(message: string) {
  return NextResponse.json({ error: message }, { status: 500 });
}

async function authorize() {
  const user = await getCurrentUser();
  if (!user) return { response: NextResponse.json({ error: "No autorizado" }, { status: 401 }) };
  if (!isBackupAdmin(user.id)) return { response: NextResponse.json({ error: "Acceso denegado" }, { status: 403 }) };
  return { user };
}

/** GET /api/backups - Lista backups. Requiere BACKUP_ADMIN_USER_IDS. */
export async function GET() {
  const access = await authorize();
  if (access.response) return access.response;
  try {
    const backups = await backupService.listBackups();
    return NextResponse.json({
      success: true,
      count: backups.length,
      backups: backups.map((b) => ({
        filename: b.filename,
        sizeBytes: b.sizeBytes,
        sizeMB: (b.sizeBytes / (1024 * 1024)).toFixed(2),
        createdAt: b.createdAt,
      })),
    });
  } catch (error) {
    console.error("[BACKUP API] Error listing backups:", error);
    return serverError("Error al listar backups");
  }
}

/** POST /api/backups - Crea un backup. Requiere BACKUP_ADMIN_USER_IDS. */
export async function POST() {
  const access = await authorize();
  if (access.response) return access.response;
  try {
    const result = await backupService.createBackup();
    if (!result.success) {
      console.error("[BACKUP API] Backup service failed", result.error);
      return serverError("Error al crear backup");
    }
    return NextResponse.json({
      success: true,
      message: "Backup creado exitosamente",
      backup: {
        timestamp: result.timestamp,
        sizeBytes: result.sizeBytes,
        sizeMB: result.sizeBytes ? (result.sizeBytes / (1024 * 1024)).toFixed(2) : "0",
        s3Url: result.s3Url,
      },
    });
  } catch (error) {
    console.error("[BACKUP API] Error creating backup:", error);
    return serverError("Error al crear backup");
  }
}
