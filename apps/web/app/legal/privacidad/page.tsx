import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidad | KinetixFitt',
  description: 'Cómo recopilamos, usamos y protegemos tus datos personales. Cumplimiento LGPD, GDPR y Ley 25.326 Argentina.',
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

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-zinc-500 hover:text-white">
          ← Volver al inicio
        </Link>

        <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D6FF2A]/10 border border-[#D6FF2A]/20 text-[11px] font-black tracking-widest uppercase text-[#D6FF2A]">
          Legal · Privacidad
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white">Política de Privacidad</h1>
        <p className="mt-2 text-sm text-zinc-500">Última actualización: {UPDATED} · Responsable: KinetixFitt / KINETIXFITT · Contacto: <a href="mailto:privacidad@kinetixfitt.com" className="underline decoration-zinc-600 hover:text-white">privacidad@kinetixfitt.com</a></p>

        <div className="mt-6 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <p className="text-[13px] leading-relaxed text-zinc-400">
            <strong className="text-zinc-200">Resumen rápido:</strong> usamos tus datos solo para darte el servicio (entrenamiento, nutrición, pagos y soporte), cumplir la ley y mejorar la app. Vos controlás tus datos: acceso, rectificación, supresión, portabilidad, oposición y revocación del consentimiento. No vendemos tus datos. Base legal: ejecución del contrato, interés legítimo, consentimiento y cumplimiento legal. Aplica a usuarios en Argentina, Brasil (LGPD) y UE (GDPR).
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">Ley 25.326 AR</span>
          <span className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">LGPD Brasil Lei 13.709</span>
          <span className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">GDPR UE 2016/679</span>
          <span className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">Ley 24.240 Consumidor</span>
        </div>

        {/* TOC */}
        <nav className="mt-8 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs font-black tracking-widest uppercase text-zinc-500">Contenido</div>
          <ol className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
            {[
              ['1. Responsable', '#responsable'],
              ['2. Datos que recopilamos', '#datos'],
              ['3. Finalidades y base legal', '#finalidades'],
              ['4. Cookies y seguimiento', '#cookies'],
              ['5. Conservación', '#conservacion'],
              ['6. Compartición y encargados', '#comparticion'],
              ['7. Transferencias internacionales', '#transferencias'],
              ['8. Tus derechos (ARCO + LGPD/GDPR)', '#derechos'],
              ['9. Menores', '#menores'],
              ['10. Seguridad', '#seguridad'],
              ['11. Reclamos y autoridad', '#reclamos'],
              ['12. Cambios', '#cambios'],
            ].map(([label, href]) => (
              <li key={href}><a href={href} className="text-zinc-400 hover:text-[#D6FF2A] underline decoration-zinc-700">{label}</a></li>
            ))}
          </ol>
        </nav>

        <Section title="1. Responsable del tratamiento" id="responsable">
          <p><strong className="text-white">KinetixFitt / KINETIXFITT</strong> — CUIT/CNPJ a informar en factura. Domicilio: Argentina (operación remota). Email de privacidad: <a href="mailto:privacidad@kinetixfitt.com" className="underline">privacidad@kinetixfitt.com</a> · DPO/Contacto LGPD/GDPR: mismo email. Si nos escribís por derechos ARCO, responde en hasta 10 días corridos (AR) y hasta 30 días (LGPD/GDPR).</p>
          <p>Cuando actuás como <em>cliente final</em>, somos <strong>responsable</strong>. Cuando tu entrenador carga tus datos como <em>cliente de un entrenador</em>, el entrenador puede ser corresponsable; nosotros actuamos también como encargado del tratamiento para alojar y procesar esos datos por cuenta del entrenador.</p>
        </Section>

        <Section title="2. Qué datos recopilamos" id="datos">
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li><strong className="text-zinc-200">Cuenta:</strong> nombre, email, contraseña hasheada, rol (CLIENT/TRAINER), avatar.</li>
            <li><strong className="text-zinc-200">Perfil salud/fitness:</strong> edad, sexo, altura, peso, objetivos, lesiones/limitaciones, nivel, preferencias. Categoría especial: datos de salud (art. 9 GDPR / sensible LGPD) — solo con tu consentimiento explícito.</li>
            <li><strong className="text-zinc-200">Entrenamiento y nutrición:</strong> rutinas, logs, RIR/reps/carga, fotos de progreso (opcional), comidas, check-ins, mensajes con tu coach.</li>
            <li><strong className="text-zinc-200">Pagos:</strong> historial de planes y estado. No guardamos tarjeta completa: la procesa el PSP (Mercado Pago / Stripe). Solo guardamos últimos 4 dígitos, marca y comprobantes.</li>
            <li><strong className="text-zinc-200">Técnicos:</strong> IP, user-agent, logs de acceso, eventos de uso, crash reports (Sentry), device info. Cookies según <Link href="/legal/cookies" className="underline text-[#D6FF2A]">Política de Cookies</Link>.</li>
            <li><strong className="text-zinc-200">Comunicaciones:</strong> tickets, soporte, encuestas.</li>
          </ul>
          <p>No recopilamos datos biométricos ni de localización precisa sin activar explícitamente permisos del dispositivo.</p>
        </Section>

        <Section title="3. Finalidades y base legal" id="finalidades">
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-zinc-900 text-zinc-400">
                <tr><th className="px-4 py-2">Finalidad</th><th className="px-4 py-2">Base legal</th></tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                <tr><td className="px-4 py-2">Crear cuenta, autenticar y prestar el servicio</td><td className="px-4 py-2">Ejecución del contrato</td></tr>
                <tr><td className="px-4 py-2">Personalizar entrenamiento/nutrición y mostrar progreso</td><td className="px-4 py-2">Contrato + consentimiento (datos de salud)</td></tr>
                <tr><td className="px-4 py-2">Pagos, facturación y prevención de fraude</td><td className="px-4 py-2">Contrato + obligación legal</td></tr>
                <tr><td className="px-4 py-2">Soporte y comunicaciones operativas</td><td className="px-4 py-2">Contrato / interés legítimo</td></tr>
                <tr><td className="px-4 py-2">Analítica de producto y mejora de la app</td><td className="px-4 py-2">Interés legítimo / consentimiento (cookies no esenciales)</td></tr>
                <tr><td className="px-4 py-2">Marketing (newsletter, promos) si te suscribís</td><td className="px-4 py-2">Consentimiento (revocable)</td></tr>
                <tr><td className="px-4 py-2">Seguridad, logs y cumplimiento legal</td><td className="px-4 py-2">Obligación legal / interés legítimo</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-500">Podés revocar consentimientos en cualquier momento sin efecto retroactivo desde <Link href="/legal/cookies" className="underline">cookies</Link> o escribiendo a privacidad@kinetixfitt.com.</p>
        </Section>

        <Section title="4. Cookies y tecnologías similares" id="cookies">
          <p>Usamos cookies necesarias (sesión, seguridad) y, solo con tu consentimiento, cookies analíticas y de marketing. Gestionás tu elección en el banner y en cualquier momento en <Link href="/legal/cookies" className="underline text-[#D6FF2A]">/legal/cookies</Link>. No hacemos <em>fingerprinting</em> invasivo ni vendemos datos a terceros.</p>
        </Section>

        <Section title="5. Conservación" id="conservacion">
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>Datos de cuenta y entrenamiento: mientras tu cuenta esté activa + 2 años tras baja (por reclamos/defensa), luego anonimización.</li>
            <li>Facturación y comprobantes: 5–10 años según normativa fiscal aplicable.</li>
            <li>Logs técnicos/Sentry: 12–24 meses.</li>
            <li>Marketing: hasta que revoques consentimiento o solicites baja.</li>
          </ul>
          <p>Cuando vence el plazo, eliminamos o anonimizamos de forma irreversible.</p>
        </Section>

        <Section title="6. Con quién compartimos" id="comparticion">
          <p>Solo con <strong>encargados</strong> necesarios y bajo contrato (art. 28 GDPR / art. 39 LGPD):</p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>Hosting y base de datos (Supabase / Vercel), almacenamiento (S3), CDN.</li>
            <li>Pagos (Mercado Pago, Stripe si aplica) — ellos son responsables propios de datos de pago.</li>
            <li>Analítica y errores (Sentry, opcional Google Analytics solo con consentimiento).</li>
            <li>Comunicaciones (email transaccional).</li>
            <li>Autoridades si lo exige la ley.</li>
          </ul>
          <p>No vendemos ni alquilamos tus datos.</p>
        </Section>

        <Section title="7. Transferencias internacionales" id="transferencias">
          <p>Tu información puede alojarse en servidores fuera de tu país (EE. UU. / UE). Para UE-Brasil-Argentina aplicamos <strong>cláusulas contractuales tipo (SCC)</strong> y medidas suplementarias. Podés pedir copia de las garantías a privacidad@kinetixfitt.com.</p>
        </Section>

        <Section title="8. Tus derechos" id="derechos">
          <p>Tenés derecho a <strong>acceso, rectificación, actualización, supresión, portabilidad, oposición, limitación, no ser objeto de decisiones solo automatizadas y revocar consentimiento</strong> (ARCO + LGPD arts. 18–22 + GDPR arts. 15–22).</p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li><strong>Argentina (Ley 25.326):</strong> acceso gratuito cada 6 meses; podés reclamar ante la Agencia de Acceso a la Información Pública (AAIP).</li>
            <li><strong>Brasil (LGPD):</strong> confirmación, acceso, corrección, anonimización/bloqueo/eliminación, portabilidad, información sobre compartición, revocación; reclamo ante ANPD.</li>
            <li><strong>UE (GDPR):</strong> mismos derechos + reclamo ante tu autoridad de control local.</li>
          </ul>
          <p>Ejercé tus derechos escribiendo a <a href="mailto:privacidad@kinetixfitt.com" className="underline">privacidad@kinetixfitt.com</a> o desde Ajustes → Cuenta → Exportar/Eliminar cuenta. Respondemos sin costo. Para verificar identidad podemos pedir datos mínimos adicionales solo para ese fin y los borramos luego.</p>
        </Section>

        <Section title="9. Menores" id="menores">
          <p>El servicio no está dirigido a menores de 13 años. De 13 a 17, requiere consentimiento de padre/tutor. Si detectamos cuenta de menor sin autorización, la suspendemos y borramos datos tras verificación.</p>
        </Section>

        <Section title="10. Seguridad" id="seguridad">
          <p>Aplicamos medidas técnicas y organizativas: cifrado en tránsito (TLS), hash de contraseñas (bcrypt), control de acceso por rol, rate limiting, CSP/HSTS, backups cifrados, principio de mínimo privilegio y revisiones de acceso. Ningún sistema es 100% seguro; si ocurre un incidente que te afecte, te notificaremos y a la autoridad cuando la ley lo exija (72 h GDPR / plazo razonable LGPD / AAIP).</p>
        </Section>

        <Section title="11. Reclamos y autoridad" id="reclamos">
          <p>Si no resolvemos tu pedido, podés reclamar ante:</p>
          <ul className="list-disc list-inside text-zinc-400">
            <li><strong>Argentina:</strong> AAIP — av. Pte. Julio A. Roca 710, CABA — <a href="https://www.argentina.gob.ar/aaip" className="underline">argentina.gob.ar/aaip</a></li>
            <li><strong>Brasil:</strong> ANPD — <a href="https://www.gov.br/anpd" className="underline">gov.br/anpd</a></li>
            <li><strong>UE:</strong> tu autoridad de control (ej. AEPD España, CNIL Francia, etc.)</li>
          </ul>
        </Section>

        <Section title="12. Cambios a esta política" id="cambios">
          <p>Si cambiamos algo sustancial, te avisamos por email o banner en la app y actualizamos la fecha. El uso continuado tras el aviso implica aceptación. Guardamos versiones previas a pedido.</p>
          <p className="text-xs text-zinc-500 mt-4">Este documento es informativo y no constituye asesoramiento legal. Para dudas legales específicas, consultá a tu asesor.</p>
        </Section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/legal/terminos" className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-bold hover:bg-zinc-800">Ver Términos y Condiciones</Link>
          <Link href="/legal/cookies" className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-bold hover:bg-zinc-800">Ver Política de Cookies</Link>
          <Link href="/licencia" className="px-5 py-3 rounded-xl bg-white text-black text-sm font-black hover:bg-zinc-100">Licencia MIT</Link>
        </div>

        <div className="mt-8 text-center text-xs text-zinc-600">KinetixFitt — Entrená con ciencia. Tus datos, bajo tu control.</div>
      </div>
    </div>
  );
}
