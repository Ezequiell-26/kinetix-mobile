import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Cookies | KinetixFitt',
  description: 'Qué cookies usamos, para qué y cómo gestionar tu consentimiento. Incluye cookies necesarias, analíticas y de marketing.',
};

const UPDATED = '13 de septiembre de 2026';

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-black text-white mt-10 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-6 rounded-full bg-[#D6FF2A] shrink-0" /> {title}
      </h2>
      <div className="text-[14px] leading-relaxed text-zinc-300 space-y-3">{children}</div>
    </section>
  );
}

// Client island for managing consent directly from this page
import { CookiePrefsIsland } from './cookie-prefs';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-zinc-500 hover:text-white">
          ← Volver al inicio
        </Link>

        <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-black tracking-widest uppercase text-amber-300">
          Legal · Cookies
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white">Política de Cookies</h1>
        <p className="mt-2 text-sm text-zinc-500">Última actualización: {UPDATED} · Contacto: <a href="mailto:privacidad@kinetixfitt.com" className="underline">privacidad@kinetixfitt.com</a></p>

        <div className="mt-6 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <p className="text-[13px] leading-relaxed text-zinc-400">
            Usamos <strong className="text-zinc-200">cookies necesarias</strong> para que la web funcione y, solo si aceptás, <strong className="text-zinc-200">analíticas y de marketing</strong> para mejorar el producto y mostrarte contenido relevante. Podés cambiar tu elección en cualquier momento desde el panel de abajo o desde el banner. Cumplimos ePrivacy, LGPD y GDPR (consentimiento previo para no esenciales).
          </p>
        </div>

        {/* Interactive consent manager */}
        <div className="mt-8">
          <CookiePrefsIsland />
        </div>

        <Section title="1. ¿Qué son las cookies?" id="que-son">
          <p>Pequeños archivos que tu navegador guarda cuando visitás una web. Pueden ser <em>propias</em> (kinetixfitt.com) o de <em>terceros</em> (ej. Google Analytics si lo activás), <em>de sesión</em> (se borran al cerrar el navegador) o <em>persistentes</em> (quedan un tiempo). También usamos <em>localStorage</em> para guardar tu preferencia de consentimiento.</p>
        </Section>

        <Section title="2. Qué cookies usamos" id="tipos">
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-zinc-900 text-zinc-400">
                <tr>
                  <th className="px-4 py-2">Categoría</th>
                  <th className="px-4 py-2">Ejemplos</th>
                  <th className="px-4 py-2">Duración</th>
                  <th className="px-4 py-2">Base legal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                <tr>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded-full bg-[#D6FF2A]/10 border border-[#D6FF2A]/20 text-[#D6FF2A] text-xs font-black">Necesarias</span></td>
                  <td className="px-4 py-3">ec_token (sesión), theme, consent (kinetix_cookie_consent), csrf</td>
                  <td className="px-4 py-3">Sesión – 12 meses (consent)</td>
                  <td className="px-4 py-3">Interés legítimo / ejecución contrato — no requieren consentimiento</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-black">Analíticas</span></td>
                  <td className="px-4 py-3">_ga, _ga_*, kinetix_analytics (solo si aceptás)</td>
                  <td className="px-4 py-3">Hasta 13 meses</td>
                  <td className="px-4 py-3">Consentimiento</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-xs font-black">Marketing</span></td>
                  <td className="px-4 py-3">_fbp, gtag ad_storage (solo si aceptás)</td>
                  <td className="px-4 py-3">Hasta 13 meses</td>
                  <td className="px-4 py-3">Consentimiento</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-500">No usamos cookies analíticas/marketing sin tu consentimiento previo. El rechazo no afecta el funcionamiento esencial.</p>
        </Section>

        <Section title="3. Cómo gestionás tu consentimiento" id="gestion">
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li><strong className="text-zinc-200">Banner:</strong> aparece al primer ingreso. Podés “Aceptar todas”, “Rechazar opcionales” o “Personalizar”.</li>
            <li><strong className="text-zinc-200">Esta página:</strong> usa el panel de arriba para cambiar tu elección en cualquier momento.</li>
            <li><strong className="text-zinc-200">Navegador:</strong> podés borrar/bloquear cookies desde la configuración de tu navegador (Chrome, Firefox, Safari). Bloquear necesarias puede romper el login.</li>
            <li><strong className="text-zinc-200">Revocación:</strong> revocar es tan fácil como dar consentimiento. Se aplica hacia adelante.</li>
          </ul>
        </Section>

        <Section title="4. Google Analytics y terceros (solo con consentimiento)" id="terceros">
          <p>Si activás analíticas, podemos usar Google Analytics 4 con IP anonimizada y sin compartir con Google para ads salvo que actives marketing. Configuramos <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs">gtag consent_mode</code> para respetar tu elección. No cargamos scripts de terceros no esenciales sin consentimiento.</p>
          <p>Proveedores actuales: Vercel (hosting), Supabase (datos), Sentry (errores, sin cookies de tracking), Google Analytics (solo con consentimiento). Lista actualizada a {UPDATED}.</p>
        </Section>

        <Section title="5. Señales Do Not Track y Global Privacy Control" id="dnt">
          <p>Respetamos la señal <strong>GPC</strong> cuando el navegador la envía: se interpreta como rechazo de cookies no esenciales. DNT se considera de forma similar.</p>
        </Section>

        <Section title="6. Actualizaciones" id="actualizaciones">
          <p>Si agregamos una nueva categoría o proveedor, te pedimos consentimiento de nuevo y actualizamos la fecha. Seguí revisando esta página.</p>
        </Section>

        <Section title="7. Más información" id="mas-info">
          <p>Para privacidad general ver <Link href="/legal/privacidad" className="underline text-[#D6FF2A]">Política de Privacidad</Link>. Para derechos y reclamos ver sección 8 y 11 allí. Contacto: <a href="mailto:privacidad@kinetixfitt.com" className="underline">privacidad@kinetixfitt.com</a>.</p>
        </Section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/legal/privacidad" className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-bold hover:bg-zinc-800">Privacidad</Link>
          <Link href="/legal/terminos" className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-bold hover:bg-zinc-800">Términos</Link>
          <Link href="/licencia" className="px-5 py-3 rounded-xl bg-white text-black text-sm font-black hover:bg-zinc-100">Licencia MIT</Link>
        </div>
      </div>
    </div>
  );
}
