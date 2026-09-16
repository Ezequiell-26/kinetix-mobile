import { NextResponse } from "next/server";
import { backupService } from "@/lib/backups";
import { getCurrentUser } from "@/lib/auth";

function serverError(message: string) {
  return NextResponse.json({ error: message }, { status: 500 });
}

/**
 * GET /api/backups - Lista backups disponibles.
 * El servicio sigue restringido a usuarios TRAINER.
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    if (user.role !== "TRAINER") return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });

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

/**
 * POST /api/backups - Crea un nuevo backup.
 * El endpoint no devuelve rutas locales ni mensajes internos de infraestructura.
 */
export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    if (user.role !== "TRAINER") return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });

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
