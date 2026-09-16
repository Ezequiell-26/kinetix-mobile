import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Acuerdo de Encargado del Tratamiento (DPA) | KinetixFitt',
  description:
    'DPA de KinetixFitt conforme a LGPD (Lei 13.709), GDPR y Ley 25.326. Define roles controlador/operador, categorías de datos, subencargados, transferencias internacionales, seguridad y brechas.',
};

const UPDATED = '15 de septiembre de 2026';

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

function Badge({ children, tone = 'zinc' }: { children: React.ReactNode; tone?: 'lime' | 'zinc' | 'cyan' | 'amber' }) {
  const map: Record<string, string> = {
    lime: 'bg-[#D6FF2A]/10 border-[#D6FF2A]/20 text-[#D6FF2A]',
    zinc: 'bg-zinc-900 border-zinc-800 text-zinc-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
  };
  return <span className={`px-3 py-1.5 rounded-full border text-xs font-bold ${map[tone]}`}>{children}</span>;
}

export default function DpaPage() {
  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-zinc-500 hover:text-white"
        >
          ← Volver al inicio
        </Link>

        <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-black tracking-widest uppercase text-cyan-300">
          Legal · DPA · LGPD / GDPR / Ley 25.326
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white">
          Acuerdo de Encargado del Tratamiento (DPA)
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Última actualización: {UPDATED} · Responsable (Controlador): KinetixFitt / KINETIXFITT · DPO:{' '}
          <a href="mailto:privacidad@kinetixfitt.com" className="underline decoration-zinc-600 hover:text-white">
            privacidad@kinetixfitt.com
          </a>{' '}
          · Legal:{' '}
          <a href="mailto:legal@kinetixfitt.com" className="underline decoration-zinc-600 hover:text-white">
            legal@kinetixfitt.com
          </a>
        </p>

        <div className="mt-6 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <p className="text-[13px] leading-relaxed text-zinc-400">
            <strong className="text-white">Resumen ejecutivo:</strong> este DPA regula cómo KinetixFitt trata datos
            personales cuando actúa como <strong className="text-zinc-200">encargado / operador</strong> por cuenta de
            entrenadores, gimnasios o empresas clientes (controladores) y cuando actúa como{' '}
            <strong className="text-zinc-200">responsable</strong> frente a atletas finales. Incorpora requisitos de la{' '}
            <strong>LGPD (Lei 13.709/2018)</strong>, <strong>GDPR (UE 2016/679)</strong> y{' '}
            <strong>Ley 25.326 (AR)</strong>, incluidas cláusulas contractuales tipo (SCC) y régimen ANPD para transferencias
            internacionales. Si tu rol es entrenador/empresa, este DPA se incorpora a los{' '}
            <Link href="/legal/terminos" className="underline text-[#D6FF2A]">
              Términos
            </Link>{' '}
            y a la{' '}
            <Link href="/legal/subscription-terms" className="underline text-[#D6FF2A]">
              Suscripción
            </Link>{' '}
            al aceptar o firmar el pedido.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Badge tone="lime">LGPD art. 39–40 · Lei 13.709</Badge>
          <Badge tone="cyan">GDPR art. 28</Badge>
          <Badge>ANPD Resolução CD/ANPD 19/2024 (SCC BR)</Badge>
          <Badge>GDPR SCC 2021/914 (UE)</Badge>
          <Badge>Ley 25.326 + AAIP</Badge>
        </div>

        <nav className="mt-8 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs font-black tracking-widest uppercase text-zinc-500">Contenido</div>
          <ol className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
            {[
              ['1. Partes y objeto', '#partes'],
              ['2. Definiciones', '#definiciones'],
              ['3. Alcance, duración y finalidad', '#alcance'],
              ['4. Categorías de datos', '#categorias'],
              ['5. Instrucciones del controlador', '#instrucciones'],
              ['6. Confidencialidad', '#confidencialidad'],
              ['7. Medidas de seguridad (TOMs)', '#seguridad'],
              ['8. Subencargados', '#subencargados'],
              ['9. Transferencias internacionales', '#transferencias'],
              ['10. Derechos de titulares', '#derechos'],
              ['11. Brechas de seguridad', '#brechas'],
              ['12. Auditoría y registros', '#auditoria'],
              ['13. Devolución y supresión', '#devolucion'],
              ['14. Responsabilidad', '#responsabilidad'],
              ['15. Vigencia y terminación', '#vigencia'],
              ['16. Contacto DPO', '#contacto'],
            ].map(([label, href]) => (
              <li key={href}>
                <a href={href} className="text-zinc-400 hover:text-[#D6FF2A] underline decoration-zinc-700">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-8 p-4 rounded-2xl bg-[#D6FF2A] text-black">
          <p className="text-[13px] leading-relaxed font-medium">
            <strong>Cómo se aplica:</strong> atleta final → KinetixFitt es <em>controlador</em>. Entrenador/gimnasio que
            gestiona atletas → entrenador es <em>controlador / controladora</em> y KinetixFitt es{' '}
            <em>operador/encargado (processor/encarregado)</em> que trata datos por su cuenta. Este DPA cubre el segundo
            caso. Si sos solo atleta, te rige la{' '}
            <Link href="/legal/privacidad" className="underline font-black">
              Política de Privacidad
            </Link>
            .
          </p>
        </div>

        <Section title="1. Partes y objeto" id="partes">
          <p>
            <strong className="text-white">Cliente – Controlador:</strong> la persona física o jurídica que contrata
            KinetixFitt para gestionar atletas/clientes (entrenador, box, estudio, gimnasio, empresa). Al crear una
            organización y cargar datos de sus atletas, declara que es controlador (LGPD art. 5 VI / GDPR art. 4.7) y que
            cuenta con base legal válida.
          </p>
          <p>
            <strong className="text-white">KinetixFitt – Operador/Encargado:</strong> KINETIXFITT (CUIT/CNPJ a informar en
            factura), domicilio Argentina, operación remota. Actúa como encargado/operador (LGPD art. 5 VII-VIII / GDPR
            art. 4.8 / Ley 25.326 encargado) proveyendo hosting SaaS, base de datos, mensajería coach-atleta, analíticas,
            pagos y soporte.
          </p>
          <p>
            <strong>Objeto:</strong> regular el tratamiento de datos personales que KinetixFitt realiza por cuenta del
            Controlador al prestar el servicio descrito en{' '}
            <Link href="/legal/terminos" className="underline text-[#D6FF2A]">
              Términos §2
            </Link>{' '}
            y{' '}
            <Link href="/legal/subscription-terms" className="underline text-[#D6FF2A]">
              Términos de Suscripción
            </Link>
            . En caso de conflicto, prevalece este DPA para el tratamiento encargado.
          </p>
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
            <strong className="text-zinc-200">Base legal del Controlador:</strong> el Controlador garantiza que informó a
            los titulares (atletas), tiene base legal (ej. ejecución de contrato de entrenamiento, consentimiento para
            datos de salud art. 9 GDPR / art. 11 LGPD, interés legítimo) y que no instruye tratamientos ilícitos.
            KinetixFitt puede requerir prueba de información a titulares.
          </div>
        </Section>

        <Section title="2. Definiciones" id="definiciones">
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-zinc-900 text-zinc-400">
                <tr>
                  <th className="px-4 py-2">Término</th>
                  <th className="px-4 py-2">Significado (LGPD / GDPR / AR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                <tr>
                  <td className="px-4 py-2 font-bold text-zinc-200">Datos Personales</td>
                  <td className="px-4 py-2">Cualquier información sobre persona identificada/identificable (LGPD art. 5 I / GDPR 4.1).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-zinc-200">Datos sensibles / especiales</td>
                  <td className="px-4 py-2">Salud, datos genéticos, biométricos; peso, altura, lesiones, condiciones médicas tratadas por KinetixFitt (LGPD art. 11 / GDPR art. 9 / Ley 25.326 art. 7).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-zinc-200">Titular / Data Subject</td>
                  <td className="px-4 py-2">Atleta/cliente final cuyos datos trata el Controlador vía KinetixFitt.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-zinc-200">Controlador / Controlador</td>
                  <td className="px-4 py-2">Quien determina fines y medios (entrenador/empresa).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-zinc-200">Operador / Encargado / Processor</td>
                  <td className="px-4 py-2">
                    KinetixFitt cuando trata por cuenta del Controlador (LGPD art. 5 VII-VIII / GDPR art. 28).
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-zinc-200">Subencargado / Subprocessor</td>
                  <td className="px-4 py-2">Tercero contratado por KinetixFitt para sub-tratar (hosting, pagos, etc.).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-zinc-200">Brecha / Incidente</td>
                  <td className="px-4 py-2">Violación de seguridad que afecta confidencialidad/integridad/disponibilidad.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-500">
            En AR, la figura es «responsable/archivo» vs «encargado/usuario» (Ley 25.326 arts. 21 y 29). La terminología
            de este DPA mapea a esas figuras sin alterar obligaciones.
          </p>
        </Section>

        <Section title="3. Alcance, duración y finalidad" id="alcance">
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>
              <strong className="text-zinc-200">Alcance:</strong> todo tratamiento necesario para prestar el SaaS: crear
              organizaciones, invitar/gestionar atletas, asignar programas, registrar entrenamientos, check-ins, fotos de
              progreso (opcional), nutrición, mensajería, pagos y soporte.
            </li>
            <li>
              <strong className="text-zinc-200">Finalidad exclusiva:</strong> prestar el servicio, soporte operativo,
              seguridad y cumplimiento legal. KinetixFitt no reutiliza datos encargados para fines propios (no vende,
              no perfila para terceros) salvo anonimización agregada para mejora de producto cuando el Contrato lo
              permita y con base legal separada.
            </li>
            <li>
              <strong className="text-zinc-200">Duración:</strong> mientras el Controlador mantenga cuenta activa + plazos
              de retención pactados (ver §13). Tras terminación, devolución/borrado irreversible.
            </li>
            <li>
              <strong className="text-zinc-200">Datos de salud (sensibles):</strong> solo si el titular otorgó consentimiento
              explícito (LGPD art. 11 I / GDPR art. 9.2.a) recogido por el Controlador. El Controlador debe segregar y
              documentar ese consentimiento.
            </li>
          </ul>
        </Section>

        <Section title="4. Categorías de datos y titulares" id="categorias">
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-zinc-900 text-zinc-400">
                <tr>
                  <th className="px-4 py-2">Categoría</th>
                  <th className="px-4 py-2">Ejemplos</th>
                  <th className="px-4 py-2">Titulares</th>
                  <th className="px-4 py-2">Sensible</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                <tr>
                  <td className="px-4 py-2">Identificación</td>
                  <td className="px-4 py-2">nombre, email, avatar, ID organización</td>
                  <td className="px-4 py-2">Atletas invitados por el Controlador</td>
                  <td className="px-4 py-2">No</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Salud/fitness</td>
                  <td className="px-4 py-2">edad, sexo, altura, peso, objetivo, lesiones, nivel, preferencias</td>
                  <td className="px-4 py-2">Atletas</td>
                  <td className="px-4 py-2">Sí — consentimiento explícito</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Actividad</td>
                  <td className="px-4 py-2">rutinas, logs RIR/reps/carga, fotos progreso, comidas, check-ins, mensajes</td>
                  <td className="px-4 py-2">Atletas</td>
                  <td className="px-4 py-2">Indirecto</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Facturación</td>
                  <td className="px-4 py-2">plan, estado, comprobantes (no guardamos PAN completo)</td>
                  <td className="px-4 py-2">Controlador y atleta pagador</td>
                  <td className="px-4 py-2">No</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Técnicos</td>
                  <td className="px-4 py-2">IP, user-agent, logs, eventos, crash reports</td>
                  <td className="px-4 py-2">Usuarios</td>
                  <td className="px-4 py-2">No</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-500">No tratamos como encargado: datos biométricos, localización precisa, ni categorías del art. 7 Ley 25.326 salvo que el Controlador los habilite explícitamente y documente base legal.</p>
        </Section>

        <Section title="5. Instrucciones del controlador" id="instrucciones">
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>KinetixFitt trata datos solo con <strong className="text-zinc-200">instrucciones documentadas</strong> del Controlador (contrato, configuración dashboard, tickets soporte). Si una instrucción infringe LGPD/GDPR/Ley 25.326, lo notificará y suspenderá la ejecución hasta aclaración.</li>
            <li>El Controlador instruye mediante la propia plataforma (alta/baja atletas, asignación de planes, exportaciones). Toda transferencia internacional operativa constituye instrucción para subcontratar conforme §9.</li>
            <li>KinetixFitt informa si una obligación legal requiere tratamiento distinto (ej. requerimiento judicial), salvo prohibición legal.</li>
            <li>El Controlador mantiene actualizados datos y canales de contacto DPO/ responsable.</li>
          </ul>
        </Section>

        <Section title="6. Confidencialidad" id="confidencialidad">
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>Acceso bajo <strong className="text-zinc-200">mínimo privilegio</strong> y <em>need-to-know</em>: solo personal/contratistas que deben mantener operación, soporte y seguridad.</li>
            <li>Todo personal autorizado firma compromiso de confidencialidad y formación anual LGPD/GDPR.</li>
            <li>Credenciales segregadas por entorno (prod/staging), MFA obligatorio, rotación y revocación inmediata al cese.</li>
            <li>No extraemos datos a dispositivos personales salvo soporte auditado y temporal.</li>
          </ul>
        </Section>

        <Section title="7. Medidas de seguridad (TOMs) — LGPD art. 46 / GDPR art. 32" id="seguridad">
          <p>KinetixFitt aplica medidas técnicas y organizativas proporcionales al riesgo:</p>
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-zinc-900 text-zinc-400">
                <tr>
                  <th className="px-4 py-2">Dominio</th>
                  <th className="px-4 py-2">Medidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                <tr><td className="px-4 py-2 font-bold text-zinc-200">Cifrado</td><td className="px-4 py-2">TLS 1.2+ en tránsito; AES-256 en reposo (Supabase/Vercel/S3); secretos en vault rotables.</td></tr>
                <tr><td className="px-4 py-2 font-bold text-zinc-200">Identidad</td><td className="px-4 py-2">Hash bcrypt para contraseñas; JWT corta vida; RBAC por rol CLIENT/TRAINER/ADMIN; rate limiting y bloqueo por fuerza bruta.</td></tr>
                <tr><td className="px-4 py-2 font-bold text-zinc-200">Seguridad app</td><td className="px-4 py-2">CSP, HSTS, X-Frame Deny, sanitización, validación, dependency scanning.</td></tr>
                <tr><td className="px-4 py-2 font-bold text-zinc-200">Disponibilidad</td><td className="px-4 py-2">Backups cifrados diarios, retención geográfica, RPO/RTO documentados, pruebas de restore.</td></tr>
                <tr><td className="px-4 py-2 font-bold text-zinc-200">Monitorización</td><td className="px-4 py-2">Logs centralizados, alertas, Sentry (sin tracking), evaluación periódica de vulnerabilidades.</td></tr>
                <tr><td className="px-4 py-2 font-bold text-zinc-200">Minimización</td><td className="px-4 py-2">Pseudonimización cuando es posible, retención limitada (§13), borrado programado.</td></tr>
                <tr><td className="px-4 py-2 font-bold text-zinc-200">Organizativas</td><td className="px-4 py-2">ROPA/Registro de operaciones, DPIA cuando el Controlador lo solicite, formación, control de proveedores.</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-500">Ningún sistema es 100% seguro (ver <Link href="/legal/privacidad" className="underline">Privacidad §10</Link>). KinetixFitt revisa TOMs anualmente y puede mejorarlos sin reducir seguridad.</p>
        </Section>

        <Section title="8. Subencargados (Subprocessors)" id="subencargados">
          <p>
            El Controlador autoriza de forma <strong className="text-white">general</strong> los subencargados listados
            abajo (LGPD art. 39 / GDPR art. 28.2). KinetixFitt mantendrá lista actualizada y notificará con al menos{' '}
            <strong>15 días</strong> cualquier alta/baja para que el Controlador pueda objetar por motivos razonables
            vinculados a protección de datos. Sin objeción en plazo, se considera autorizado. Si hay objeción
            fundada, buscaremos alternativa razonable; de no hallarse, el Controlador podrá terminar la porción afectada
            sin penalización.
          </p>
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-zinc-900 text-zinc-400">
                <tr><th className="px-4 py-2">Subencargado</th><th className="px-4 py-2">Finalidad</th><th className="px-4 py-2">Ubicación datos</th><th className="px-4 py-2">Garantías</th></tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                <tr><td className="px-4 py-2">Supabase Inc.</td><td className="px-4 py-2">Base de datos, auth, storage</td><td className="px-4 py-2">EE. UU./UE (según región)</td><td className="px-4 py-2">SCC + DPA</td></tr>
                <tr><td className="px-4 py-2">Vercel Inc.</td><td className="px-4 py-2">Hosting, CDN, edge functions</td><td className="px-4 py-2">EE. UU./UE</td><td className="px-4 py-2">SCC + DPA</td></tr>
                <tr><td className="px-4 py-2">Amazon Web Services</td><td className="px-4 py-2">Object storage (S3) backups</td><td className="px-4 py-2">EE. UU.</td><td className="px-4 py-2">SCC</td></tr>
                <tr><td className="px-4 py-2">Mercado Pago</td><td className="px-4 py-2">Pagos LATAM</td><td className="px-4 py-2">Brasil/Argentina</td><td className="px-4 py-2">Responsable independiente</td></tr>
                <tr><td className="px-4 py-2">Stripe Inc.</td><td className="px-4 py-2">Pagos internacional</td><td className="px-4 py-2">EE. UU./UE</td><td className="px-4 py-2">SCC + certificaciones</td></tr>
                <tr><td className="px-4 py-2">Sentry / PostHog</td><td className="px-4 py-2">Errores, analítica solo con consentimiento</td><td className="px-4 py-2">EE. UU./UE</td><td className="px-4 py-2">SCC, sin tracking sin consentimiento</td></tr>
                <tr><td className="px-4 py-2">Proveedores email transaccional</td><td className="px-4 py-2">Emails operativos</td><td className="px-4 py-2">EE. UU.</td><td className="px-4 py-2">SCC + DPA</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-500">Lista vigente a {UPDATED}. Pedí copia de los DPA/SCC a privacidad@kinetixfitt.com. Los PSP (Mercado Pago/Stripe) actúan como responsables independientes para datos de pago.</p>
          <p>KinetixFitt impone contractualmente a cada subencargado las mismas obligaciones de este DPA (art. 28.4 GDPR / art. 40 LGPD) y responde ante el Controlador si incumplen.</p>
        </Section>

        <Section title="9. Transferencias internacionales" id="transferencias">
          <p>
            Los datos pueden tratarse en <strong>Argentina, Brasil, EE. UU. y UE</strong>. Base de legitimación:
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li><strong>UE→tercer país:</strong> SCC UE 2021/914 Módulo 2 (controller→processor) y, cuando aplique, Módulo 3 (processor→subprocessor), más medidas suplementarias (cifrado, minimización, TIA). Reino Unido: UK Addendum.</li>
            <li><strong>Brasil→exterior (LGPD art. 33-36 + ANPD Res. 19/2024):</strong> cláusulas contractuales patrón ANPD y garantías equivalentes; TIA a disposición.</li>
            <li><strong>Argentina→exterior (Ley 25.326 art. 12 + AAIP):</strong> nivel adecuado o cláusulas/contrato que garantice nivel comparable; registramos transferencias en ROPA.</li>
          </ul>
          <p>Podés solicitar copia impersonalizada de las cláusulas y del análisis de impacto a privacidad@kinetixfitt.com. La firma/aceptación de este DPA constituye tu instrucción y autorización para estas transferencias como necesarias para el servicio.</p>
        </Section>

        <Section title="10. Derechos de los titulares — asistencia" id="derechos">
          <p>
            El <strong>Controlador</strong> es responsable de responder solicitudes de titulares (acceso, rectificación,
            supresión, portabilidad, oposición, limitación, revocación, LGPD arts. 18-22 / GDPR arts. 15-22 / Ley
            25.326 art. 14). KinetixFitt asiste con medidas técnicas/organizativas razonables:
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>Panel Controlador: exportar/borrar datos de sus atletas, rectificar perfiles, gestionar consentimientos de salud.</li>
            <li>Si un titular contacta directamente a KinetixFitt, lo reenviaremos al Controlador sin responder fondo, salvo que legalmente debamos hacerlo.</li>
            <li>Soporte a DPIA/RIPD y consulta previa (GDPR art. 35-36 / LGPD art. 38) con información relevante disponible.</li>
            <li>Plazos: asistimos sin demora indebida para que el Controlador cumpla sus plazos (10 días corridos AR, 15 días LGPD, 30 días GDPR).</li>
          </ul>
          <p className="text-xs text-zinc-500">Ver <Link href="/legal/privacidad" className="underline text-[#D6FF2A]">Privacidad §8</Link> para el detalle de derechos frente a KinetixFitt como controlador.</p>
        </Section>

        <Section title="11. Notificación de brechas" id="brechas">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[13px]">
            <strong>Compromiso:</strong> notificamos al Controlador sin demora indebida y, si es posible, dentro de 48 h de tener conocimiento, para que puedas cumplir tus plazos legales.
          </div>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li><strong>Contenido:</strong> naturaleza, categorías y volumen aprox., consecuencias probables, medidas tomadas/propuestas, punto de contacto. La información puede completarse por fases.</li>
            <li><strong>Plazos autoridad/titular:</strong> GDPR 72 h a autoridad; LGPD comunicación a ANPD y titulares en plazo razonable (art. 48); AR AAIP según regulación vigente. KinetixFitt colabora y no notifica a autoridad/titulares en tu nombre sin tu instrucción, salvo obligación legal directa.</li>
            <li><strong>Contacto incidentes:</strong> <a href="mailto:seguridad@kinetixfitt.com" className="underline">seguridad@kinetixfitt.com</a> y <a href="mailto:privacidad@kinetixfitt.com" className="underline">privacidad@kinetixfitt.com</a>.</li>
          </ul>
        </Section>

        <Section title="12. Auditoría y registros" id="auditoria">
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>Mantenemos <strong>registro de actividades (ROPA)</strong> como encargado y medidas de seguridad documentadas (GDPR art. 30.2 / LGPD art. 37).</li>
            <li>Ponemos a disposición, bajo NDA, información necesaria para demostrar cumplimiento (certificaciones SOC, políticas, resumen de pentests).</li>
            <li>Auditoría: el Controlador puede, con 30 días de aviso, una vez por año y sin perturbar operación, solicitar cuestionario/autoevaluación; auditoría in situ solo si es requerida por autoridad o tras brecha grave, a costo del Controlador y con confidencialidad.</li>
            <li>Cooperamos con ANPD/AAIP/autoridad UE competente cuando sea requerido por ley, informándote salvo prohibición legal.</li>
          </ul>
        </Section>

        <Section title="13. Devolución y supresión" id="devolucion">
          <p>
            A elección del Controlador (antes del cese), KinetixFitt <strong>devolverá</strong> (exportación en formatos
            razonables: JSON/CSV) y/o <strong>suprimirá</strong> los datos encargados tras la terminación o a tu
            solicitud. Supresión por defecto: 30 días post-baja, con purgado de backups en hasta 90 días (copias cifradas no
            accesibles para tratamiento). Conservaremos solo lo necesario por obligación legal (p. ej. fiscal 5–10 años,
            logs de seguridad) anonimizado/bloqueado según corresponda.
          </p>
          <p className="text-xs bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-400">
            Tip operativo: usá Ajustes → Cuenta → Exportar / Eliminar para self-service; para borrado gestionado como
            Controlador, escribí a privacidad@kinetixfitt.com con asunto “DPA — SUPRESIÓN”.
          </p>
        </Section>

        <Section title="14. Responsabilidad" id="responsabilidad">
          <p>
            Cada parte responde por incumplimientos de sus obligaciones bajo este DPA y la ley aplicable. Sin perjuicio de
            derechos irrenunciables de titulares/consumidores, la responsabilidad agregada de KinetixFitt como encargado se
            limita conforme{' '}
            <Link href="/legal/terminos" className="underline text-[#D6FF2A]">
              Términos §11
            </Link>{' '}
            salvo dolo/culpa grave o lo que la LGPD/GDPR impongan de forma imperativa (ej. LGPD art. 42–44 responsabilidad
            solidaria por daños causados por tratamiento irregular). Nada en este DPA limita la responsabilidad frente a
            titulares cuando la ley no lo permita.
          </p>
        </Section>

        <Section title="15. Vigencia, prioridad y ley aplicable" id="vigencia">
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li><strong>Vigencia:</strong> entra en vigor al contratar/aceptar el servicio y se mantiene mientras tratemos datos encargados.</li>
            <li><strong>Orden de prelación:</strong> DPA prevalece sobre Términos/Privacidad solo para el objeto encargado; en el resto, esos documentos mantienen vigencia.</li>
            <li><strong>Ley y fuero:</strong> aplicable la definida en <Link href="/legal/terminos" className="underline text-[#D6FF2A]">Términos §12</Link> (Argentina por defecto, sin perjuicio de normas imperativas de consumo y de las obligaciones específicas LGPD/AAIP/ANPD/GDPR que apliquen según residencia del titular).</li>
            <li><strong>Actualizaciones:</strong> cambios sustanciales se notifican por email/banner con 30 días. Si no aceptás, podés terminar conforme §13 sin penalización por período futuro no consumido.</li>
          </ul>
        </Section>

        <Section title="16. Contacto DPO / Encarregado" id="contacto">
          <p>
            <strong className="text-white">DPO / Encarregado LGPD / Contacto GDPR / Responsable AR:</strong>{' '}
            <a href="mailto:privacidad@kinetixfitt.com" className="underline text-[#D6FF2A]">
              privacidad@kinetixfitt.com
            </a>{' '}
            — Tiempo de respuesta: hasta 15 días (LGPD), 30 días (GDPR), 10 días corridos (AR). Para ejercicio de derechos ARCO/LGPD/GDPR como titular: mismo email. Para incidentes:{' '}
            <a href="mailto:seguridad@kinetixfitt.com" className="underline">seguridad@kinetixfitt.com</a>.
          </p>
          <ul className="list-disc list-inside text-zinc-400">
            <li>
              <strong>ANPD (Brasil):</strong> <a href="https://www.gov.br/anpd" className="underline">gov.br/anpd</a> — reportes según Res. CD/ANPD 15/2024.
            </li>
            <li>
              <strong>AAIP (Argentina):</strong> <a href="https://www.argentina.gob.ar/aaip" className="underline">argentina.gob.ar/aaip</a>
            </li>
            <li>
              <strong>UE:</strong> supervisora de tu país (ej. AEPD, CNIL).
            </li>
          </ul>
          <div className="mt-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
            <strong className="text-zinc-200">¿Necesitás DPA firmado?</strong> Este DPA electrónico es válido al aceptar online. Si necesitás ejemplar con firma y datos de tu organización (CNPJ/CUIT, domicilio, DPO), escribí a legal@kinetixfitt.com con razón social, CUIT/CNPJ y DPO.
          </div>
        </Section>

        <div className="mt-12 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs leading-relaxed text-zinc-500">
          <strong className="text-zinc-300">Aviso:</strong> este DPA es informativo y contractual. No constituye asesoramiento legal. Adecuá tus propias políticas, registros y consentimientos de salud con asesor local (LGPD/ANPD, GDPR y Ley 25.326). Guardamos versiones previas a pedido.
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/legal/privacidad"
            className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-bold hover:bg-zinc-800"
          >
            Privacidad
          </Link>
          <Link
            href="/legal/terminos"
            className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-bold hover:bg-zinc-800"
          >
            Términos
          </Link>
          <Link
            href="/legal/subscription-terms"
            className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-bold hover:bg-zinc-800"
          >
            Suscripción
          </Link>
          <Link
            href="/legal/cookies"
            className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-bold hover:bg-zinc-800"
          >
            Cookies
          </Link>
          <Link href="/licencia" className="px-5 py-3 rounded-xl bg-white text-black text-sm font-black hover:bg-zinc-100">
            Licencia
          </Link>
        </div>

        <div className="mt-8 text-center text-xs text-zinc-600">KinetixFitt — DPA LTAM-ready · LGPD + GDPR + Ley 25.326</div>
      </div>
    </div>
  );
}
