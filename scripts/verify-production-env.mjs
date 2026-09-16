#!/usr/bin/env node

const required = [
  "DATABASE_URL",
  "DIRECT_URL",
  "JWT_SECRET",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_WEB_URL",
  "TRUST_PROXY_HEADERS",
];

const recommended = [
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "BACKUP_S3_BUCKET",
  "ASSETS_S3_BUCKET",
  "SENTRY_DSN",
  "KINETIX_INTERNAL_API_SECRET",
  "BACKUP_ADMIN_USER_IDS",
];

function fail(message) {
  console.error(`[production-env] FAIL: ${message}`);
  process.exitCode = 1;
}

function assertUrl(name) {
  const value = process.env[name];
  if (!value) return;
  try {
    const url = new URL(value);
    if (!["http:", "https:", "postgresql:", "postgres:"].includes(url.protocol)) {
      fail(`${name} usa un protocolo no permitido`);
    }
  } catch {
    fail(`${name} no es una URL válida`);
  }
}

console.log("KinetixFitt production environment verification");

if (process.env.NODE_ENV !== "production") {
  console.log(`INFO: NODE_ENV=${process.env.NODE_ENV || "unset"}. Se permite la ejecución fuera de producción.`);
}

for (const name of required) {
  if (!process.env[name]) fail(`${name} no está configurada`);
}

if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  fail("JWT_SECRET debe tener al menos 32 caracteres");
}

if (process.env.KINETIX_INTERNAL_API_SECRET && process.env.KINETIX_INTERNAL_API_SECRET.length < 32) {
  fail("KINETIX_INTERNAL_API_SECRET debe tener al menos 32 caracteres");
}

if (process.env.NODE_ENV === "production" && process.env.TRUST_PROXY_HEADERS !== "true") {
  fail("TRUST_PROXY_HEADERS debe ser true en producción solo cuando el proxy de borde sobrescribe de forma fiable los headers de IP");
}

assertUrl("NEXT_PUBLIC_APP_URL");
assertUrl("NEXT_PUBLIC_WEB_URL");
assertUrl("DATABASE_URL");
assertUrl("DIRECT_URL");

const missingRecommended = recommended.filter((name) => !process.env[name]);
if (missingRecommended.length) {
  console.warn(`[production-env] WARN: variables recomendadas ausentes (${missingRecommended.join(", ")})`);
}

const hasAiProvider = Boolean(process.env.AI_API_KEY || process.env.OPENAI_API_KEY || process.env.GLM_API_KEY);
if (!hasAiProvider) {
  console.warn("[production-env] WARN: no hay una API key de IA configurada; KinetixFitt AI no funcionará en producción.");
}

const hasEmailProvider = Boolean(process.env.RESEND_API_KEY || (process.env.SMTP_HOST && (process.env.SMTP_PASS || process.env.SMTP_PASSWORD)));
if (!hasEmailProvider) {
  console.warn("[production-env] WARN: no hay proveedor de email transaccional completo; recuperación de contraseña y emails no funcionarán.");
}

if (process.exitCode === 1) {
  console.error("[production-env] Production deployment blocked: faltan variables obligatorias.");
  process.exit(1);
}

console.log("[production-env] PASS: variables obligatorias válidas.");
