import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

const bucket = process.env.ASSETS_S3_BUCKET || process.env.S3_BUCKET || "";
const region = process.env.AWS_REGION || "us-east-1";
const configured = Boolean(bucket && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
const client = configured ? new S3Client({ region }) : null;

export function storageKey(type: string, filename: string) {
  return `uploads/${type}/${filename}`;
}

export function isPersistentObjectStorageConfigured() {
  return Boolean(client && bucket);
}

export async function putObject(input: { type: string; filename: string; body: Buffer; contentType: string }) {
  const key = storageKey(input.type, input.filename);
  if (client && bucket) {
    await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: input.body, ContentType: input.contentType, CacheControl: "private, max-age=3600" }));
    return { key, backend: "s3" as const };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Persistent object storage is not configured");
  }
  const dir = join(process.cwd(), "storage", "uploads", input.type);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, input.filename), input.body, { flag: "wx" });
  return { key, backend: "local" as const };
}

export async function getObject(input: { type: string; filename: string }) {
  const key = storageKey(input.type, input.filename);
  if (client && bucket) {
    const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    if (!response.Body) throw new Error("Archivo no encontrado");
    const bytes = await response.Body.transformToByteArray();
    return { body: Buffer.from(bytes), contentType: response.ContentType || "application/octet-stream", backend: "s3" as const };
  }
  const path = join(process.cwd(), "storage", "uploads", input.type, input.filename);
  const body = await readFile(path);
  return { body, contentType: undefined, backend: "local" as const };
}
