import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { join } from "path";
import { tmpdir } from "os";

function safeFilename(value: string) {
  return value.startsWith("backup-") && value.endsWith(".sql.gz") && !value.includes("/") && !value.includes("\\") && !value.includes("..");
}

async function getBackupContext(id: string) {
  const filename = decodeURIComponent(id);
  if (!safeFilename(filename)) throw new Response(JSON.stringify({ error: "Nombre de backup inválido" }), { status: 400, headers: { "Content-Type": "application/json" } });
  const backupDir = process.env.BACKUP_DIR || join(tmpdir(), "kinetix-backups");
  return { filename, filePath: join(backupDir, filename) };
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    if (user.role !== "TRAINER") return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    const { filename, filePath } = await getBackupContext((await params).id);
    const fs = await import("fs/promises");
    try { await fs.access(filePath); } catch { return NextResponse.json({ error: "Backup no encontrado" }, { status: 404 }); }
    await fs.unlink(filePath);
    return NextResponse.json({ success: true, message: "Backup eliminado exitosamente", filename });
  } catch (error) {
    if (error instanceof Response) return error;
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
    const { filename, filePath } = await getBackupContext((await params).id);
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
    if (error instanceof Response) return error;
    console.error("[BACKUP API] Error downloading backup:", error);
    return NextResponse.json({ error: "Error al descargar backup" }, { status: 500 });
  }
}
