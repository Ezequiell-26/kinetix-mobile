import { NextResponse } from "next/server";
import { backupService } from "@/lib/backups";
import { getCurrentUser } from "@/lib/auth";
import { join, resolve } from "path";

/**
 * DELETE /api/backups/[id] - Elimina un backup específico
 * Solo accesible para TRAINER
 * PR3 hardening: path traversal fix via resolve+prefix check y regex estricto
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (user.role !== "TRAINER") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const { id } = await params;
    const filename = decodeURIComponent(id);

    // Regex estricto: solo backup-<alphanum_-.>.sql.gz (sin / ni \)
    if (!/^backup-[a-zA-Z0-9._-]+\.sql\.gz$/.test(filename)) {
      return NextResponse.json({ error: "Nombre de backup inválido" }, { status: 400 });
    }

    const fs = await import("fs/promises");
    const backupDir = process.env.BACKUP_DIR || require("os").tmpdir() + "/kinetix-backups";
    const backupResolved = resolve(backupDir);
    const filePath = resolve(join(backupDir, filename));
    // Prefix check: el path resuelto debe estar dentro de backupDir
    if (!filePath.startsWith(backupResolved + "/") && filePath !== backupResolved) {
      return NextResponse.json({ error: "Nombre de backup inválido" }, { status: 400 });
    }

    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: "Backup no encontrado" }, { status: 404 });
    }

    await fs.unlink(filePath);

    return NextResponse.json({
      success: true,
      message: "Backup eliminado exitosamente",
      filename,
    });
  } catch (error) {
    console.error("[BACKUP API] Error deleting backup:", error);
    return NextResponse.json(
      { error: "Error al eliminar backup" },
      { status: 500 }
    );
  }
}
