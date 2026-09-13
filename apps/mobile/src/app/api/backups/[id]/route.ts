import { NextResponse } from "next/server";
import { backupService } from "@/lib/backups";
import { getCurrentUser } from "@/lib/auth";
import { join } from "path";

/**
 * DELETE /api/backups/[id] - Elimina un backup específico
 * Solo accesible para TRAINER
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación y rol
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Solo trainers pueden eliminar backups
    if (user.role !== "TRAINER") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const { id } = await params;
    
    // Decodificar el nombre del archivo (puede contener caracteres especiales)
    const filename = decodeURIComponent(id);
    
    // Validar que el nombre del archivo sea seguro
    if (!filename.startsWith("backup-") || !filename.endsWith(".sql.gz")) {
      return NextResponse.json(
        { error: "Nombre de backup inválido" },
        { status: 400 }
      );
    }

    const fs = await import("fs/promises");
    const backupDir = process.env.BACKUP_DIR || require("os").tmpdir() + "/kinetix-backups";
    const filePath = join(backupDir, filename);

    // Verificar que el archivo existe
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { error: "Backup no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar el archivo
    await fs.unlink(filePath);

    return NextResponse.json({
      success: true,
      message: "Backup eliminado exitosamente",
      filename,
    });
  } catch (error) {
    console.error("[BACKUP API] Error deleting backup:", error);
    return NextResponse.json(
      { error: "Error al eliminar backup", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
