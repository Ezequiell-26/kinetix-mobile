import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | KinetixFitt',
  description: 'Condiciones de uso de KinetixFitt: servicio, cuentas, pagos, cancelaciones, responsabilidad y jurisdicción.',
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

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-zinc-500 hover:text-white">
          ← Volver al inicio
        </Link>

        <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-black tracking-widest uppercase text-white">
          Legal · Términos y Condiciones
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white">Términos y Condiciones</h1>
        <p className="mt-2 text-sm text-zinc-500">Última actualización: {UPDATED} · Prestador: KinetixFitt / KINETIXFITT · Contacto: <a href="mailto:legal@kinetixfitt.com" className="underline decoration-zinc-600 hover:text-white">legal@kinetixfitt.com</a></p>

        <div className="mt-6 p-4 rounded-2xl bg-[#D6FF2A] text-black">
          <p className="text-[13px] leading-relaxed font-medium">
            <strong>Resumen:</strong> usás KinetixFitt bajo tu responsabilidad. No reemplazamos consejo médico. Pagás por mes, sin permanencia, cancelás cuando querés. No hay reembolsos proporcionales salvo lo que exija la ley. Respetá a tu coach y a otros usuarios. Leé este documento: al crear tu cuenta lo aceptás.
          </p>
        </div>

        <nav className="mt-8 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs font-black tracking-widest uppercase text-zinc-500">Contenido</div>
          <ol className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
            {[
              ['1. Aceptación', '#aceptacion'],
              ['2. Descripción del servicio', '#servicio'],
              ['3. Cuentas y elegibilidad', '#cuentas'],
              ['4. Planes, pagos y facturación', '#pagos'],
              ['5. Cancelación y reembolsos', '#cancelacion'],
              ['6. Contenido del usuario', '#contenido'],
              ['7. Conducta y uso aceptable', '#conducta'],
              ['8. Salud y disclaimer', '#salud'],
              ['9. Propiedad intelectual', '#ip'],
              ['10. Disponibilidad y cambios', '#disponibilidad'],
              ['11. Limitación de responsabilidad', '#responsabilidad'],
              ['12. Ley aplicable y jurisdicción', '#jurisdiccion'],
              ['13. Contacto y reclamos', '#contacto'],
            ].map(([label, href]) => (
              <li key={href}><a href={href} className="text-zinc-400 hover:text-[#D6FF2A] underline decoration-zinc-700">{label}</a></li>
            ))}
          </ol>
        </nav>

        <Section title="1. Aceptación" id="aceptacion">
          <p>Al crear una cuenta, acceder o usar KinetixFitt (web y app), aceptás estos Términos, la <Link href="/legal/privacidad" className="underline text-[#D6FF2A]">Política de Privacidad</Link> y la <Link href="/legal/cookies" className="underline text-[#D6FF2A]">Política de Cookies</Link>. Si no aceptás, no uses el servicio. Debés tener al menos 13 años (ver Privacidad 9) y capacidad legal para contratar. Si contratás en nombre de una empresa, declarás tener autoridad.</p>
        </Section>

        <Section title="2. Descripción del servicio" id="servicio">
          <p>KinetixFitt es una plataforma SaaS de coaching fitness: rutinas, seguimiento, nutrición orientativa, check-ins, mensajería con tu coach, analíticas y gamificación. No es un servicio médico. El contenido es informativo y de entrenamiento general; no constituye diagnóstico, prescripción ni tratamiento.</p>
          <p>Ofrecemos planes para <em>clientes</em> y herramientas para <em>entrenadores</em> (gestión de clientes, programas, pagos). Las funcionalidades varían por plan.</p>
        </Section>

        <Section title="3. Cuentas y elegibilidad" id="cuentas">
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>Una persona = una cuenta. Mantené tu contraseña segura; sos responsable de lo que ocurra con tu cuenta.</li>
            <li>Información veraz y actualizada. Podemos suspender cuentas con datos falsos, suplantación o uso fraudulento.</li>
            <li>Menores de 18 necesitan autorización de tutor para pagos. Nos reservamos pedir verificación.</li>
            <li>Podemos suspender o cerrar cuentas que violen estos Términos, la ley o derechos de terceros, con o sin aviso previo según gravedad.</li>
          </ul>
        </Section>

        <Section title="4. Planes, pagos y facturación" id="pagos">
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>Precios en USD (web) y/o ARS (según pasarela y plan). Impuestos incluidos salvo que se indique lo contrario.</li>
            <li>Facturación mensual recurrente por adelantado. Al suscribirte autorizás el cobro automático al medio de pago registrado.</li>
            <li>Si el pago falla, intentaremos reintentos y podremos suspender el acceso hasta regularizar.</li>
            <li>Podemos actualizar precios con aviso de al menos 30 días. Si no aceptás el nuevo precio, podés cancelar antes de que se aplique.</li>
            <li>Factura/comprobante: se emite por el prestador del cobro (Mercado Pago / Stripe). Pedila a <a href="mailto:pagos@kinetixfitt.com" className="underline">pagos@kinetixfitt.com</a>.</li>
          </ul>
          <p className="text-xs bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-400">TrueCoach/Symmetry benchmark: precio en USD con impuestos incluidos y cambio de plan sin fricción. Aplicamos el mismo principio.</p>
        </Section>

        <Section title="5. Cancelación, desistimiento y reembolsos" id="cancelacion">
          <p><strong className="text-white">Sin permanencia:</strong> cancelás cuando quieras desde Ajustes → Plan o escribiendo a <a href="mailto:soporte@kinetixfitt.com" className="underline">soporte@kinetixfitt.com</a>. La cancelación rige al final del período ya pagado; no hay reembolsos proporcionales por días no usados, salvo que la ley local lo exija.</p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li><strong className="text-zinc-200">Argentina (Ley 24.240):</strong> 10 días corridos para arrepentirte desde la contratación si fue a distancia (botón de arrepentimiento / email). Reembolso sin costo si el servicio no comenzó o no se usó de forma significativa; si ya hubo uso, reembolso proporcional.</li>
            <li><strong className="text-zinc-200">Brasil (CDC):</strong> 7 días de arrependimiento para contrataciones fuera del establecimiento.</li>
            <li><strong className="text-zinc-200">UE (Dir. 2011/83):</strong> 14 días de desistimiento para consumidores, salvo que la ejecución haya comenzado con tu consentimiento expreso.</li>
            <li><strong>Prueba gratis:</strong> si no cancelás antes de que termine, se cobra el primer período.</li>
          </ul>
          <p>Para ejercer arrepentimiento/desistimiento: email a legal@kinetixfitt.com con asunto “ARREPENTIMIENTO” + email de la cuenta. Reembolsamos por el mismo medio de pago en hasta 10 días hábiles.</p>
        </Section>

        <Section title="6. Contenido del usuario" id="contenido">
          <p>Vos retenés la propiedad de tu contenido (rutinas que creás, fotos, mensajes). Nos otorgás licencia no exclusiva, mundial y gratuita para alojar, mostrar y procesar ese contenido solo para prestarte el servicio y hacer backups. No usamos tus fotos de progreso para publicidad sin tu consentimiento escrito.</p>
          <p>Declarás que tu contenido no infringe derechos de terceros y no es ilegal. Podemos retirar contenido que viole estos Términos o la ley.</p>
        </Section>

        <Section title="7. Conducta y uso aceptable" id="conducta">
          <p>No podés: hacer scraping masivo, revertir ingeniería, intentar acceder a datos ajenos, subir malware, acosar, discriminar, hacer spam, suplantar, ni usar la plataforma para consejo médico no autorizado. El incumplimiento puede derivar en suspensión y reporte a autoridades si corresponde.</p>
        </Section>

        <Section title="8. Salud — Aviso importante" id="salud">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[13px]">
            <strong>⚠️ Consulta a tu médico</strong> antes de empezar o cambiar tu entrenamiento/nutrición, especialmente si tenés condiciones preexistentes, lesiones o tomás medicación. Si sentís dolor agudo, mareos o malestar, detené el ejercicio y buscá atención profesional. KinetixFitt no reemplaza evaluación médica presencial.
          </div>
          <p>Seguí la técnica indicada, respetá RIR y progresión. Sos responsable de entrenar con seguridad y con material en buen estado.</p>
        </Section>

        <Section title="9. Propiedad intelectual" id="ip">
          <p>La plataforma, marca KINETIXFITT, logos, diseño, código y contenido propio son de KinetixFitt o licenciantes y están protegidos por propiedad intelectual. Te damos licencia limitada, revocable y no transferible para usar el servicio como usuario final. El código bajo <Link href="/licencia" className="underline text-[#D6FF2A]">Licencia MIT</Link> se rige por esa licencia; el resto no es open source.</p>
        </Section>

        <Section title="10. Disponibilidad y cambios" id="disponibilidad">
          <p>Buscamos disponibilidad alta pero no garantizamos 100% uptime. Podemos actualizar, limitar o descontinuar funciones con aviso razonable. Cambios sustanciales a estos Términos se notifican por email/banner con 15 días de anticipación; el uso continuado implica aceptación. Guardamos historial de versiones.</p>
        </Section>

        <Section title="11. Limitación de responsabilidad" id="responsabilidad">
          <p>En la máxima medida permitida por la ley aplicable:</p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>El servicio se presta “tal cual” y “según disponibilidad”.</li>
            <li>No respondemos por daños indirectos, lucro cesante o pérdida de datos más allá de lo que hayas pagado en los últimos 3 meses (tope), salvo dolo o culpa grave.</li>
            <li>Nada limita derechos irrenunciables del consumidor ni responsabilidad por dolo, muerte o lesiones por negligencia donde la ley no permita limitar.</li>
          </ul>
          <p>Si sos consumidor en AR/BR/UE, conservás todas las garantías legales mínimas.</p>
        </Section>

        <Section title="12. Ley aplicable y jurisdicción" id="jurisdiccion">
          <p><strong>Regla general:</strong> estos Términos se rigen por las leyes de la República Argentina, sin perjuicio de normas imperativas de tu domicilio como consumidor.</p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li><strong>Argentina:</strong> jurisdicción de los tribunales ordinarios del domicilio del consumidor (Ley 24.240) o CABA si sos empresa.</li>
            <li><strong>Brasil:</strong> foro del domicilio del consumidor (CDC).</li>
            <li><strong>UE:</strong> podés demandar en tu país de residencia bajo Reglamento Bruselas I bis y normativa de consumo local.</li>
          </ul>
          <p>Intentaremos resolver amistosamente antes de litigar: escribí a legal@kinetixfitt.com. Para AR, también podés acudir a Defensa del Consumidor / COPREC.</p>
        </Section>

        <Section title="13. Contacto y reclamos" id="contacto">
          <p>
            Soporte: <a href="mailto:soporte@kinetixfitt.com" className="underline">soporte@kinetixfitt.com</a> · Legal/privacidad: <a href="mailto:legal@kinetixfitt.com" className="underline">legal@kinetixfitt.com</a> · Pagos: <a href="mailto:pagos@kinetixfitt.com" className="underline">pagos@kinetixfitt.com</a>
          </p>
          <p className="text-xs text-zinc-500">Domicilio legal a informar en factura. Horario de atención: lun–vie 9–18 ART.</p>
          <div className="mt-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
            <strong className="text-zinc-200">Botón de arrepentimiento (AR):</strong> si compraste online, podés arrepentirte en 10 días. Envía email con asunto “ARREPENTIMIENTO” a legal@kinetixfitt.com o usa el formulario de contacto. Cumplimos Ley 24.240 y Res. 424/2020.
          </div>
        </Section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/legal/privacidad" className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-bold hover:bg-zinc-800">Privacidad</Link>
          <Link href="/legal/cookies" className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-bold hover:bg-zinc-800">Cookies</Link>
          <Link href="/licencia" className="px-5 py-3 rounded-xl bg-white text-black text-sm font-black hover:bg-zinc-100">Licencia MIT</Link>
        </div>
      </div>
    </div>
  );
}
