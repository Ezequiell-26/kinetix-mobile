/**
 * security.ts — Fuente única de validación para uploads y paths.
 *
 * La usan `POST /api/uploads` y ambos `GET` (serve y [...path]) y los tests.
 * Nada de listas duplicadas en cada ruta: si un tipo/extensión cambia, cambia ACÁ.
 *
 * PR3 hardening:
 * - Tipos estrictos: progress, avatar, checkin, message (sin svg, sin document/genérico).
 * - MIME allowlist sin wildcard `image/*` (cierra bypass svg).
 * - Directorio canónico `storage/uploads` unificado (fuera de public).
 */
import { join } from "path";

// Tipos de upload permitidos (directorios bajo storage/uploads/).
// Unificado PR3: POST y ambos GET usan exactamente este set.
export const UPLOAD_TYPES = ["progress", "avatar", "checkin", "message"] as const;
export type UploadType = (typeof UPLOAD_TYPES)[number];

export function isUploadType(v: unknown): v is UploadType {
  return typeof v === "string" && (UPLOAD_TYPES as readonly string[]).includes(v);
}

// Directorio canónico de storage (relativo a process.cwd() -> apps/mobile)
export const UPLOAD_DIR = join("storage", "uploads");

// Extensiones con allowlist (sin ejecutables, sin HTML/SVG con JS).
export const ALLOWED_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "mp4",
  "pdf",
] as const;

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "application/pdf",
] as const;

/**
 * Resuelve el directorio absoluto para un tipo dado (unificado).
 */
export function getUploadDir(type: UploadType): string {
  return join(process.cwd(), UPLOAD_DIR, type);
}

/**
 * Normaliza un path eliminando traversal (`..`, `.`, barras repetidas y
 * backslashes de Windows). Nunca devuelve un path que escape la base.
 *   sanitizePath('../../../etc/passwd') === 'etc/passwd'
 *   sanitizePath('..\\..\\windows\\system32') === 'windows/system32'
 */
export function sanitizePath(p: string): string {
  return p
    .replace(/\\/g, "/")
    .split("/")
    .filter((seg) => seg !== "" && seg !== "." && seg !== "..")
    .join("/");
}

/**
 * Extensión segura a partir del nombre declarado + MIME real.
 * Si la declarada no está en allowlist, se deriva del MIME; último
 * recurso "jpg" (nunca una extensión ejecutable).
 * SVG nunca se devuelve: no está en allowlist y no hay case para svg.
 */
export function sanitizeExtension(filename: string, mime: string): string {
  const raw = (filename.split(".").pop() || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 5);
  if ((ALLOWED_EXTENSIONS as readonly string[]).includes(raw)) return raw;
  switch (mime) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "video/mp4":
      return "mp4";
    case "application/pdf":
      return "pdf";
    default:
      return "jpg";
  }
}

/** Nombre de archivo seguro: solo el tipo + timestamp + uuid + ext válida. */
export function buildSafeFilename(type: UploadType, uuidPart: string, ext: string): string {
  const safeUuid = uuidPart.replace(/[^a-z0-9-]/gi, "").slice(0, 12);
  return `${type}-${Date.now()}-${safeUuid}.${ext}`;
}
