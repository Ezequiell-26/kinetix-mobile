import { NextResponse } from "next/server";
import { backupService } from "@/lib/backups";
import { getCurrentUser, requireRole } from "@/lib/auth";

/**
 * GET /api/backups - Lista todos los backups disponibles
 * Solo accesible para TRAINER con rol de admin
 */
export async function GET() {
  try {
    // Verificar autenticación y rol
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Solo trainers pueden ver backups
    if (user.role !== "TRAINER") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

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
    return NextResponse.json(
      { error: "Error al listar backups", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/backups - Crea un nuevo backup
 * Solo accesible para TRAINER con rol de admin
 */
export async function POST() {
  try {
    // Verificar autenticación y rol
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Solo trainers pueden crear backups
    if (user.role !== "TRAINER") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const result = await backupService.createBackup();

    if (!result.success) {
      return NextResponse.json(
        { error: "Error al crear backup", details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Backup creado exitosamente",
      backup: {
        timestamp: result.timestamp,
        sizeBytes: result.sizeBytes,
        sizeMB: result.sizeBytes ? (result.sizeBytes / (1024 * 1024)).toFixed(2) : "0",
        s3Url: result.s3Url,
        localPath: result.filePath,
      },
    });
  } catch (error) {
    console.error("[BACKUP API] Error creating backup:", error);
    return NextResponse.json(
      { error: "Error al crear backup", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
