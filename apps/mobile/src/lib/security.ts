/**
 * Fuente única de validación para uploads y paths.
 */
export const UPLOAD_TYPES = ["progress", "checkin", "message"] as const;
export type UploadType = (typeof UPLOAD_TYPES)[number];

export function isUploadType(v: unknown): v is UploadType {
  return typeof v === "string" && (UPLOAD_TYPES as readonly string[]).includes(v);
}

export const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "mp4", "pdf"] as const;
export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "application/pdf"] as const;

export function sanitizePath(p: string): string {
  return p.replace(/\\/g, "/").split("/").filter((seg) => seg !== "" && seg !== "." && seg !== "..").join("/");
}

export function sanitizeExtension(filename: string, mime: string): string {
  const raw = (filename.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5);
  if ((ALLOWED_EXTENSIONS as readonly string[]).includes(raw)) return raw;
  const byMime: Record<string,string> = { "image/jpeg":"jpg", "image/png":"png", "image/webp":"webp", "image/gif":"gif", "video/mp4":"mp4", "application/pdf":"pdf" };
  return byMime[mime] || "jpg";
}

export function buildSafeFilename(type: UploadType, uuidPart: string, ext: string): string {
  const safeUuid = uuidPart.replace(/[^a-z0-9-]/gi, "").slice(0, 12);
  return `${type}-${Date.now()}-${safeUuid}.${ext}`;
}

export function validateUploadSignature(mime: string, buffer: Buffer): boolean {
  if (mime === "image/jpeg") return buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  if (mime === "image/png") return buffer.subarray(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]));
  if (mime === "image/gif") return buffer.subarray(0, 6).toString("ascii") === "GIF87a" || buffer.subarray(0, 6).toString("ascii") === "GIF89a";
  if (mime === "image/webp") return buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  if (mime === "video/mp4") return buffer.length >= 12 && buffer.subarray(4, 8).toString("ascii") === "ftyp";
  if (mime === "application/pdf") return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
  return false;
}
