/**
 * Verificación de tipo de archivo por "magic bytes" (firma binaria real).
 *
 * Por qué hace falta: la extensión del nombre de archivo y el header
 * Content-Type que manda el navegador los define el cliente — cualquiera
 * puede subir un archivo ejecutable o un script y declarar
 * `Content-Type: image/jpeg` con extensión `.jpg`. Los chequeos anteriores
 * (allowlist de extensión + allowlist de MIME declarado) ya cierran la
 * mayoría de ese abuso, pero no verifican que el CONTENIDO del archivo sea
 * realmente lo que dice ser. Esto es la última barrera: lee los primeros
 * bytes reales del archivo y los compara contra las firmas conocidas de
 * cada formato permitido.
 *
 * No reemplaza un antivirus real (no detecta malware incrustado dentro de
 * un JPEG válido, por ejemplo) — para eso hace falta un escáner dedicado
 * como ClamAV corriendo como servicio aparte, o una API externa tipo
 * VirusTotal, ninguno de los dos disponible en este entorno sin que el
 * usuario contrate/instale ese servicio por su cuenta.
 */

const SIGNATURES: { mime: string; bytes: number[]; offset?: number }[] = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38] }, // "GIF8"
  { mime: "application/pdf", bytes: [0x25, 0x50, 0x44, 0x46] }, // "%PDF"
  // WebP: "RIFF" en el byte 0 y "WEBP" en el byte 8 (formato contenedor RIFF).
  { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] },
];

function matchesSignature(buf: Buffer, sig: { bytes: number[]; offset?: number }): boolean {
  const start = sig.offset || 0;
  if (buf.length < start + sig.bytes.length) return false;
  for (let i = 0; i < sig.bytes.length; i++) {
    if (buf[start + i] !== sig.bytes[i]) return false;
  }
  return true;
}

/**
 * Verifica que el contenido real del archivo coincida con el MIME
 * declarado. Devuelve true si matchea una firma conocida para ese MIME.
 * MP4 queda fuera de esta verificación (su firma varía mucho según el
 * encoder — se acepta por MIME+extensión declarados únicamente).
 */
export function verifyFileSignature(buf: Buffer, declaredMime: string): boolean {
  if (declaredMime === "video/mp4") return true; // ver nota arriba

  if (declaredMime === "image/webp") {
    // RIFF....WEBP: "WEBP" debe aparecer en el byte 8.
    const riff = matchesSignature(buf, { bytes: SIGNATURES[4].bytes });
    if (!riff || buf.length < 12) return false;
    const webpTag = buf.subarray(8, 12).toString("ascii");
    return webpTag === "WEBP";
  }

  const sig = SIGNATURES.find((s) => s.mime === declaredMime);
  if (!sig) return false;
  return matchesSignature(buf, sig);
}
