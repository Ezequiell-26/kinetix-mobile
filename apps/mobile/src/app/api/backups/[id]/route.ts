import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { join } from "path";
import { tmpdir } from "os";

function safeFilename(value: string) {
  return value.startsWith("backup-") && value.endsWith(".sql.gz") && !value.includes("/") && !value.includes("\\") && !value.includes("..");
}

function getBackupContext(id: string) {
  const filename = decodeURIComponent(id);
  if (!safeFilename(filename)) return { error: NextResponse.json({ error: "Nombre de backup inválido" }, { status: 400 }) } as const;
  const backupDir = process.env.BACKUP_DIR || join(tmpdir(), "kinetix-backups");
  return { filename, filePath: join(backupDir, filename) } as const;
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    if (user.role !== "TRAINER") return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    const context = getBackupContext((await params).id);
    if ("error" in context) return context.error;
    const { filename, filePath } = context;
    const fs = await import("fs/promises");
    try { await fs.access(filePath); } catch { return NextResponse.json({ error: "Backup no encontrado" }, { status: 404 }); }
    await fs.unlink(filePath);
    return NextResponse.json({ success: true, message: "Backup eliminado exitosamente", filename });
  } catch (error) {
    console.error("[BACKUP API] Error deleting backup:", error);
    return NextResponse.json({ error: "Error al eliminar backup" }, { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    if (user.role !== "TRAINER") return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    const context = getBackupContext((await params).id);
    if ("error" in context) return context.error;
    const { filename, filePath } = context;
    const fs = await import("fs/promises");
    try { await fs.access(filePath); } catch { return NextResponse.json({ error: "Backup no encontrado" }, { status: 404 }); }
    const data = await fs.readFile(filePath);
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "application/gzip",
        "Content-Length": String(data.byteLength),
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[BACKUP API] Error downloading backup:", error);
    return NextResponse.json({ error: "Error al descargar backup" }, { status: 500 });
  }
}
