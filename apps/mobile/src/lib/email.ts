/**
 * KINETIXFITT — Servicio de emails transaccionales
 *
 * Prioridad:
 * 1) Resend API (si RESEND_API_KEY está configurado) — fetch nativo, sin deps
 * 2) SMTP via nodemailer (si SMTP_HOST está configurado) — fallback productivo
 * 3) console.log solo en desarrollo cuando nada está configurado
 *
 * Env vars soportadas (todas opcionales salvo para envío real):
 * - RESEND_API_KEY
 * - EMAIL_FROM / SMTP_FROM (alias), SMTP_USER como último fallback
 * - SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS / SMTP_PASSWORD
 * - NEXT_PUBLIC_APP_URL / WEB_URL / APP_URL (para construir el link de reset)
 */

import { BRAND } from "@/constants/branding";

export type SendEmailVia = "resend" | "smtp" | "console" | "skipped";

export interface SendEmailResult {
  success: boolean;
  via: SendEmailVia;
  id?: string;
  error?: string;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// ---------------------------------------------------------------------------
// Helpers de configuración
// ---------------------------------------------------------------------------

export function getAppUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.WEB_URL ||
    process.env.APP_URL ||
    (process.env.NODE_ENV === "production" ? BRAND.app.url : "http://localhost:3001");
  return raw.replace(/\/$/, "");
}

export function getEmailFrom(): string {
  // .env.example usa EMAIL_FROM="KINETIXFITT <noreply@tu-dominio.com>"
  // .env raíz alternativo usa SMTP_FROM
  return (
    process.env.EMAIL_FROM ||
    process.env.SMTP_FROM ||
    (process.env.SMTP_USER ? `${BRAND.name} <${process.env.SMTP_USER}>` : `${BRAND.name} <${BRAND.support.email}>`)
  );
}

export function getResetUrl(token: string): string {
  return `${getAppUrl()}/reset-password?token=${encodeURIComponent(token)}`;
}

function getSmtpConfig():
  | { host: string; port: number; secure: boolean; user: string; pass: string }
  | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) return null;
  const port = Number.parseInt(process.env.SMTP_PORT || "587", 10);
  const secure =
    process.env.SMTP_SECURE === "true" || port === 465;
  return { host, port, secure, user, pass };
}

// ---------------------------------------------------------------------------
// Template premium KINETIXFITT — dark + lime (BRAND.colors.lime / BRAND.colors.dark)
// ---------------------------------------------------------------------------

export function buildPasswordResetHtml(opts: { resetUrl: string; email: string }): string {
  const { resetUrl } = opts;
  const appUrl = getAppUrl();
  // Preheader oculto para preview en clientes
  const preheader = `Restablece tu contraseña en ${BRAND.name} — enlace válido por 60 minutos.`;
  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Restablece tu contraseña — ${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.colors.dark};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.colors.dark};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#18181B;border-radius:16px;overflow:hidden;border:1px solid #27272A;">
          <!-- Header brand -->
          <tr>
            <td style="background-color:${BRAND.colors.dark};padding:28px 40px;text-align:center;border-bottom:3px solid ${BRAND.colors.lime};">
              <div style="font-family:Inter,Helvetica,Arial,sans-serif;font-weight:900;font-size:28px;letter-spacing:-0.04em;color:#ffffff;line-height:1;">${BRAND.name.slice(0,7)}<span style="color:${BRAND.colors.lime};">${BRAND.name.slice(7)}</span></div>
              <div style="font-family:Inter,Helvetica,Arial,sans-serif;color:#A1A1AA;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;margin-top:6px;font-weight:600;">Transform Your Fitness Journey</div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 32px;">
              <h1 style="margin:0 0 10px;font-family:Inter,Helvetica,Arial,sans-serif;font-size:22px;line-height:1.25;color:#ffffff;font-weight:800;">Restablece tu contraseña</h1>
              <p style="margin:0 0 16px;font-family:Inter,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.7;color:#A1A1AA;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta asociada a <span style="color:#ffffff;font-weight:600;">${escapeHtml(opts.email)}</span>.
              </p>
              <p style="margin:0 0 28px;font-family:Inter,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.7;color:#A1A1AA;">
                Haz clic en el botón para crear una nueva contraseña. Este enlace expira en <span style="color:${BRAND.colors.lime};font-weight:700;">60 minutos</span> y solo puede usarse una vez.
              </p>
              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:4px 0 24px;">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${escapeAttr(resetUrl)}" style="height:48px;v-text-anchor:middle;width:320px;" arcsize="50%" fillcolor="${BRAND.colors.lime}" stroke="f">
                    <center style="color:${BRAND.colors.dark};font-family:Arial,sans-serif;font-size:14px;font-weight:800;letter-spacing:0.06em;">RESTABLECER CONTRASEÑA →</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${escapeAttr(resetUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background-color:${BRAND.colors.lime};color:${BRAND.colors.dark};font-family:Inter,Helvetica,Arial,sans-serif;font-size:13px;font-weight:800;letter-spacing:0.08em;text-decoration:none;padding:15px 32px;border-radius:999px;line-height:1;text-transform:uppercase;">Restablecer contraseña →</a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>
              <!-- Fallback link -->
              <p style="margin:0 0 6px;font-family:Inter,Helvetica,Arial,sans-serif;font-size:12px;color:#71717A;text-align:center;">¿El botón no funciona? Copia y pega este enlace en tu navegador:</p>
              <p style="margin:0 0 24px;word-break:break-all;text-align:center;">
                <a href="${escapeAttr(resetUrl)}" target="_blank" rel="noopener noreferrer" style="font-family:Inter,Helvetica,Arial,sans-serif;font-size:12px;color:${BRAND.colors.lime};text-decoration:underline;word-break:break-all;">${escapeHtml(resetUrl)}</a>
              </p>
              <!-- Security note -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.colors.dark};border:1px solid #27272A;border-radius:10px;">
                <tr>
                  <td style="padding:14px 16px;">
                    <p style="margin:0;font-family:Inter,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#A1A1AA;">
                      <span style="color:#ffffff;font-weight:700;">¿No solicitaste este cambio?</span> Puedes ignorar este mensaje con total tranquilidad. Tu contraseña actual seguirá siendo válida y nadie podrá acceder a tu cuenta sin este enlace.
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 0;font-family:Inter,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.6;color:#52525B;text-align:center;">
                Por seguridad, nunca compartas este enlace. El equipo de ${BRAND.name} jamás te pedirá tu contraseña por email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:${BRAND.colors.dark};padding:22px 40px;border-top:1px solid #27272A;text-align:center;">
              <p style="margin:0 0 6px;font-family:Inter,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.6;color:#52525B;">
                © ${new Date().getFullYear()} ${BRAND.name}. Todos los derechos reservados.
              </p>
              <p style="margin:0;font-family:Inter,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.6;color:#52525B;">
                <a href="${escapeAttr(appUrl)}" style="color:#71717A;text-decoration:none;">kinetixfitt.com</a>
                <span style="color:#3F3F46;"> · </span>
                <a href="${escapeAttr(appUrl)}/soporte" style="color:#71717A;text-decoration:none;">Soporte</a>
                <span style="color:#3F3F46;"> · </span>
                <span style="color:#71717A;">soporte@kinetixfitt.com</span>
              </p>
              <p style="margin:10px 0 0;font-family:Inter,Helvetica,Arial,sans-serif;font-size:10px;color:#3F3F46;line-height:1.5;">
                Estás recibiendo este email porque solicitaste restablecer tu contraseña en ${BRAND.name}. Este es un mensaje transaccional y no requiere suscripción.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-family:Inter,Helvetica,Arial,sans-serif;font-size:11px;color:#52525B;text-align:center;">
          ¿Problemas con el enlace? Responde a este email y te ayudamos.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildPasswordResetText(opts: { resetUrl: string; email: string }): string {
  return `Restablece tu contraseña — ${BRAND.name}

Hola,

Recibimos una solicitud para restablecer la contraseña de ${opts.email}.

Restablece tu contraseña aquí (válido 60 minutos, un solo uso):
${opts.resetUrl}

Si no solicitaste este cambio, ignora este mensaje. Tu contraseña actual seguirá siendo válida.

— Equipo ${BRAND.name}
${getAppUrl()}
soporte@kinetixfitt.com
`;
}

// ---------------------------------------------------------------------------
// Envío genérico — usado internamente por sendPasswordResetEmail
// ---------------------------------------------------------------------------

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const from = getEmailFrom();
  const to = options.to;

  if (!to || !to.includes("@")) {
    return { success: false, via: "skipped", error: "Email destino inválido" };
  }

  // 1) Resend (preferido) — fetch nativo, sin dependencias
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject: options.subject,
          html: options.html,
          text: options.text,
        }),
      });

      const bodyText = await res.text().catch(() => "");
      let bodyJson: Record<string, unknown> | null = null;
      try {
        bodyJson = bodyText ? (JSON.parse(bodyText) as Record<string, unknown>) : null;
      } catch {
        // no json
      }

      if (!res.ok) {
        const errMsg =
          (bodyJson && typeof bodyJson["message"] === "string" ? (bodyJson["message"] as string) : null) ||
          (bodyJson && typeof bodyJson["error"] === "string" ? (bodyJson["error"] as string) : null) ||
          bodyText ||
          `Resend error ${res.status}`;
        // Si hay config SMTP, intentamos fallback antes de fallar del todo
        const smtp = getSmtpConfig();
        if (smtp) {
          console.warn(`[email] Resend falló (${errMsg}), intentando SMTP fallback...`);
          return await sendViaSmtp(options, from, smtp);
        }
        console.error(`[email] Resend falló: ${errMsg}`);
        return { success: false, via: "resend", error: errMsg };
      }

      const id =
        bodyJson && typeof bodyJson["id"] === "string" ? (bodyJson["id"] as string) : undefined;
      return { success: true, via: "resend", id };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      // Fallback a SMTP si existe
      const smtp = getSmtpConfig();
      if (smtp) {
        console.warn(`[email] Resend excepción (${msg}), fallback SMTP...`);
        return await sendViaSmtp(options, from, smtp);
      }
      console.error(`[email] Resend excepción: ${msg}`);
      return { success: false, via: "resend", error: msg };
    }
  }

  // 2) SMTP via nodemailer
  const smtp = getSmtpConfig();
  if (smtp) {
    return await sendViaSmtp(options, from, smtp);
  }

  // 3) Sin proveedor configurado — solo dev
  if (process.env.NODE_ENV !== "production") {
    console.log(`[email:console] To: ${to} | Subject: ${options.subject}\n${options.text || ""}\nHTML length: ${options.html.length}`);
    return { success: true, via: "console" };
  }

  console.warn("[email] Sin proveedor configurado (RESEND_API_KEY / SMTP_HOST). Email no enviado.");
  return { success: false, via: "skipped", error: "Email no configurado (RESEND_API_KEY o SMTP)" };
}

async function sendViaSmtp(
  options: SendEmailOptions,
  from: string,
  smtp: NonNullable<ReturnType<typeof getSmtpConfig>>
): Promise<SendEmailResult> {
  try {
    // Import dinámico para no romper tsc si nodemailer aún no está instalado en algunos entornos de build
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let nodemailer: any;
    try {
      nodemailer = await import("nodemailer");
    } catch {
      // Fallback require para CJS
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      nodemailer = require("nodemailer");
    }
    const transporter =
      nodemailer.createTransport?.({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: { user: smtp.user, pass: smtp.pass },
      }) ??
      nodemailer.default?.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: { user: smtp.user, pass: smtp.pass },
      });

    if (!transporter) throw new Error("nodemailer no disponible");

    const info = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    const id: string | undefined = info?.messageId;
    return { success: true, via: "smtp", id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[email] SMTP falló: ${msg}`);
    // En dev permitimos fallback a consola para no bloquear el flujo
    if (process.env.NODE_ENV !== "production") {
      console.log(`[email:console-fallback] To: ${options.to} | Subject: ${options.subject}`);
      return { success: true, via: "console", error: msg };
    }
    return { success: false, via: "smtp", error: msg };
  }
}

// ---------------------------------------------------------------------------
// API de alto nivel: reset de contraseña
// ---------------------------------------------------------------------------

/**
 * Envía el email de restablecimiento de contraseña con template premium KINETIXFITT.
 * - Construido con Resend (si RESEND_API_KEY) o SMTP (nodemailer) automáticamente.
 * - No lanza excepción: retorna {success:false} y loguea el error.
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<SendEmailResult> {
  if (!email || !token) {
    return { success: false, via: "skipped", error: "email y token requeridos" };
  }
  const resetUrl = getResetUrl(token);
  const html = buildPasswordResetHtml({ resetUrl, email });
  const text = buildPasswordResetText({ resetUrl, email });

  const result = await sendEmail({
    to: email,
    subject: "Restablece tu contraseña — ${BRAND.name}",
    html,
    text,
  });

  if (!result.success) {
    console.error(`[email] sendPasswordResetEmail falló para ${email}: ${result.error}`);
  }

  return result;
}

// ---------------------------------------------------------------------------
// Utils micro
// ---------------------------------------------------------------------------

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
