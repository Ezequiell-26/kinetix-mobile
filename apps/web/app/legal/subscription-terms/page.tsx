import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos de Suscripción | KinetixFitt',
  description:
    'Planes, facturación, reembolsos 7/14 días, cancelación sin permanencia y botón de arrepentimiento. Pro Athlete $19/mes y Elite $49/mes. Cumple Ley 24.240 (AR), CDC (BR) y Dir. 2011/83 (UE).',
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

function PriceCard({
  name,
  price,
  cad,
  desc,
  feats,
  highlight,
}: {
  name: string;
  price: string;
  cad: string;
  desc: string;
  feats: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 border ${highlight ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-white'}`}
    >
      <div className="text-xs font-black tracking-widest uppercase opacity-60">{name}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-3xl font-black">{price}</span>
        <span className={`text-xs font-bold ${highlight ? 'text-zinc-600' : 'text-zinc-500'}`}>{cad}</span>
      </div>
      <div className={`text-xs mt-1 ${highlight ? 'text-zinc-600' : 'text-zinc-500'}`}>{desc}</div>
      <ul className={`mt-4 space-y-1.5 text-xs ${highlight ? 'text-zinc-700' : 'text-zinc-400'}`}>
        {feats.map((f) => (
          <li key={f} className="flex gap-2">
            <span className={highlight ? 'text-black' : 'text-[#D6FF2A]'}>✓</span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SubscriptionTermsPage() {
  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-zinc-500 hover:text-white"
        >
          ← Volver al inicio
        </Link>

        <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D6FF2A]/10 border border-[#D6FF2A]/20 text-[11px] font-black tracking-widest uppercase text-[#D6FF2A]">
          Legal · Suscripción · Pagos · Reembolsos 7/14 días
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white">Términos de Suscripción</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Última actualización: {UPDATED} · Prestador: KinetixFitt / KINETIXFITT · Pagos:{' '}
          <a href="mailto:pagos@kinetixfitt.com" className="underline decoration-zinc-600 hover:text-white">
            pagos@kinetixfitt.com
          </a>{' '}
          · Soporte:{' '}
          <a href="mailto:soporte@kinetixfitt.com" className="underline decoration-zinc-600 hover:text-white">
            soporte@kinetixfitt.com
          </a>
        </p>

        <div className="mt-6 p-4 rounded-2xl bg-[#D6FF2A] text-black">
          <p className="text-[13px] leading-relaxed font-medium">
            <strong>Resumen en 30 segundos:</strong> pagás por mes, por adelantado, sin permanencia. Cancelás cuando
            querés y seguís con acceso hasta que termine el período ya pagado. No hay cobros ocultos ni reembolsos
            proporcionales por días no usados —salvo que la ley local lo exija—. Tenés 10 días de arrepentimiento en AR,
            7 días en BR y 14 días en UE (ver §5). Todos los precios en USD, impuestos incluidos y con 30 días de aviso
            ante cambios.
          </p>
        </div>

        <nav className="mt-8 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs font-black tracking-widest uppercase text-zinc-500">Contenido</div>
          <ol className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
            {[
              ['1. Planes y precios', '#planes'],
              ['2. Facturación y renovación', '#facturacion'],
              ['3. Prueba gratis', '#prueba'],
              ['4. Cambios de plan', '#cambios'],
              ['5. Reembolsos y desistimiento (7/14 días)', '#reembolsos'],
              ['6. Cancelación sin permanencia', '#cancelacion'],
              ['7. Fallo de pago y suspensión', '#fallo'],
              ['8. Impuestos, moneda y comprobantes', '#impuestos'],
              ['9. Cambios de precios', '#precios'],
              ['10. Uso, conducta y salud', '#uso'],
              ['11. Contacto y reclamos', '#contacto'],
            ].map(([label, href]) => (
              <li key={href}>
                <a href={href} className="text-zinc-400 hover:text-[#D6FF2A] underline decoration-zinc-700">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Planes */}
        <Section title="1. Planes y precios" id="planes">
          <div className="grid sm:grid-cols-3 gap-4">
            <PriceCard
              name="Básico"
              price="$0"
              cad="/mes"
              desc="Para arrancar — gratis para siempre"
              feats={['50+ ejercicios', 'Seguimiento básico', 'Comunidad', 'Sin tarjeta']}
            />
            <PriceCard
              name="Pro Athlete"
              price="$19"
              cad="/mes"
              desc="Para resultados serios"
              highlight
              feats={['Todo Básico', 'Rutinas con IA', 'Nutrición + macros', 'Analíticas avanzadas', 'Soporte prioritario']}
            />
            <PriceCard
              name="Elite Coach"
              price="$49"
              cad="/mes"
              desc="1 a 1 con tu coach"
              feats={['Todo Pro', 'Coach humano', 'Ajustes semanales', 'Eventos exclusivos']}
            />
          </div>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>
              Precios publicados en <strong className="text-zinc-200">USD</strong>. Pueden mostrarse equivalentes en ARS/BRL según
              pasarela. Impuestos incluidos salvo indicación contraria.
            </li>
            <li>
              Plan anual si se ofrece: pago único por 12 meses por adelantado con descuento; mismas reglas de cancelación
              y reembolso aplicables proporcionalmente y plazos legales.
            </li>
            <li>
              El paso a plan pago requiere aceptar estos Términos +{' '}
              <Link href="/legal/terminos" className="underline text-[#D6FF2A]">
                Términos generales
              </Link>{' '}
              y la{' '}
              <Link href="/legal/privacidad" className="underline text-[#D6FF2A]">
                Privacidad
              </Link>
              .
            </li>
          </ul>
        </Section>

        <Section title="2. Facturación y renovación" id="facturacion">
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>
              <strong className="text-zinc-200">Cuándo se cobra:</strong> al suscribirte y luego cada 30 días (mensual) en la misma fecha. Es un cargo
              <strong> recurrente por adelantado</strong> al medio de pago registrado. Autorizás el débito automático.
            </li>
            <li>
              <strong className="text-zinc-200">Renovación automática:</strong> se renueva automáticamente hasta que canceles. Te avisamos por email 7 y 2 días antes del próximo cobro (y antes del fin de prueba gratis).
            </li>
            <li>
              <strong className="text-zinc-200">Sin permanencia:</strong> no hay plazo mínimo. Cancelás cuando querés (ver §6).
            </li>
            <li>
              <strong className="text-zinc-200">Medios de pago:</strong> tarjeta, Mercado Pago (LATAM) y/o Stripe (internacional) según país. No guardamos PAN completo; el PSP es responsable independiente.
            </li>
          </ul>
        </Section>

        <Section title="3. Prueba gratis (free trial)" id="prueba">
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <p className="text-sm text-zinc-300">
              <strong className="text-white">7 días gratis</strong> en Pro Athlete (o 14 días cuando la promoción lo
              indique). No se cobra durante la prueba. Te avisamos 48 h antes de que termine.
            </p>
            <ul className="mt-3 list-disc list-inside space-y-1 text-xs text-zinc-400">
              <li>Requiere medio de pago válido (pre-autorización de $0–$1 que se libera).</li>
              <li>Si no cancelás antes del vencimiento, se cobra el primer período (mensual o anual elegido).</li>
              <li>Si cancelás durante la prueba, no se cobra y pasás a plan Básico sin costo.</li>
              <li>Solo una prueba por persona/cuenta/medio de pago.</li>
            </ul>
          </div>
          <p className="text-xs text-zinc-500">
            El desistimiento legal (AR 10 días / BR 7 días / UE 14 días) corre en paralelo cuando contrataste a distancia; ver §5. Si ejercés
            desistimiento durante la prueba, no se genera cargo alguno.
          </p>
        </Section>

        <Section title="4. Cambios de plan" id="cambios">
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>
              <strong className="text-zinc-200">Upgrade:</strong> inmediato, se cobra prorrateo del período restante al nuevo precio.
            </li>
            <li>
              <strong className="text-zinc-200">Downgrade / pasar a Básico:</strong> se aplica al final del período ya pagado; no hay reembolso prorrateado salvo obligación legal.
            </li>
            <li>
              <strong className="text-zinc-200">Cambio de cadencia (mensual↔anual):</strong> el cambio rige al siguiente ciclo. El anual no es reembolsable prorrateado tras los plazos legales, salvo casos de §5.
            </li>
            <li>Todos los cambios desde <strong>Ajustes → Plan</strong> o escribiendo a pagos@kinetixfitt.com.</li>
          </ul>
        </Section>

        <Section title="5. Reembolsos, arrepentimiento y desistimiento — 7/14 días" id="reembolsos">
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-100 text-[13px]">
            <strong>Regla general (fuera de plazos legales):</strong> no hacemos reembolsos prorrateados por días no usados una vez iniciado el período. Cancelás y seguís con acceso hasta el vencimiento ya pagado. Esta regla no limita tus derechos legales de desistimiento/arrepentimiento descritos abajo, que prevalecen.
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-zinc-900 text-zinc-400">
                <tr>
                  <th className="px-4 py-2">Jurisdicción</th>
                  <th className="px-4 py-2">Plazo</th>
                  <th className="px-4 py-2">Base legal</th>
                  <th className="px-4 py-2">Cómo aplica</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                <tr>
                  <td className="px-4 py-3 font-bold text-white">Argentina</td>
                  <td className="px-4 py-3">10 días corridos</td>
                  <td className="px-4 py-3">Ley 24.240 art. 34 + Res. 424/2020 (botón de arrepentimiento)</td>
                  <td className="px-4 py-3">
                    Desde la contratación a distancia. Si el servicio no comenzó o no hubo uso significativo, reembolso 100%.
                    Si ya usaste funciones pago de forma significativa, reembolso proporcional. Sin costo ni justificación.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-white">Brasil</td>
                  <td className="px-4 py-3">7 días corridos</td>
                  <td className="px-4 py-3">CDC art. 49 (arrependimento fora do estabelecimento)</td>
                  <td className="px-4 py-3">
                    Contratación fuera del establecimiento / online. Reembolso 100% si solicitás en plazo, incluso si ya
                    iniciaste, salvo uso manifiestamente excesivo donde podemos aplicar proporcional (CDC).
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-white">Unión Europea</td>
                  <td className="px-4 py-3">14 días naturales</td>
                  <td className="px-4 py-3">Dir. 2011/83/UE art. 9 (derecho de desistimiento consumidor)</td>
                  <td className="px-4 py-3">
                    Si sos consumidor UE. <strong>Excepción:</strong> si pediste ejecución inmediata con consentimiento expreso
                    y reconocimiento de pérdida del derecho, y ya se prestó totalmente, no hay desistimiento. Si la
                    ejecución comenzó a tu pedido dentro del plazo, pagás la parte proporcional usada.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-white">Resto LATAM / internacional</td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3">Ley local + buena fe</td>
                  <td className="px-4 py-3">
                    Aplicamos el mayor estándar de los anteriores cuando no haya norma local imperativa, caso por caso.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <h4 className="text-sm font-black text-white">Cómo ejercer arrepentimiento/desistimiento</h4>
            <ol className="mt-2 list-decimal list-inside space-y-1 text-zinc-400">
              <li>
                Enviá email a <a href="mailto:legal@kinetixfitt.com" className="underline text-white">legal@kinetixfitt.com</a>{' '}
                (con copia opcional a soporte@kinetixfitt.com) con asunto{' '}
                <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 text-xs">ARREPENTIMIENTO</code> o{' '}
                <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 text-xs">DESISTIMIENTO</code> + email de la cuenta.
              </li>
              <li>
                También podés usar el <strong className="text-zinc-200">botón de arrepentimiento</strong> en Ajustes → Plan → “Cancelar con arrepentimiento” (AR) o el formulario de contacto.
              </li>
              <li>
                <strong className="text-zinc-200">Reembolso:</strong> por el mismo medio de pago en hasta{' '}
                <strong>10 días hábiles</strong>. Si el PSP tarda más, te enviaremos comprobante de gestión. No cobramos penalización.
              </li>
              <li>
                No necesitás motivo. Basta que estés dentro del plazo y que la contratación haya sido a distancia (web/app).
              </li>
            </ol>
            <p className="mt-3 text-xs text-zinc-500">
              Fuera de esos plazos: reembolso solo por casos de §7 (fallo nuestro), duplicación de cargo o lo que la ley
              imperativa exija. Escribí a pagos@kinetixfitt.com y lo revisamos en 48 h.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[13px]">
            <strong>UE — consentimiento de ejecución inmediata:</strong> al contratar Pro/Elite podés marcar “Quiero acceso inmediato y acepto perder el
            desistimiento una vez prestado el servicio completo”. Si no marcás, mantenés tus 14 días completos. Esta opción no aplica a plan Básico ($0).
          </div>
        </Section>

        <Section title="6. Cancelación — sin permanencia" id="cancelacion">
          <p>
            <strong className="text-white">Cancelás cuando quieras, sin letra chica.</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>
              <strong className="text-zinc-200">Dónde:</strong> Ajustes → Plan → Cancelar plan. Confirmás en 2 clics. Alternativa: email a{' '}
              <a href="mailto:soporte@kinetixfitt.com" className="underline">soporte@kinetixfitt.com</a> o{' '}
              <a href="mailto:pagos@kinetixfitt.com" className="underline">pagos@kinetixfitt.com</a> con email de la cuenta.
            </li>
            <li>
              <strong className="text-zinc-200">Efecto:</strong> seguís con acceso completo hasta que vence el período ya pagado; no se cobra el siguiente. No hay reembolso de la porción ya transcurrida, salvo §5.
            </li>
            <li>
              <strong className="text-zinc-200">Confirmación:</strong> te llega email con fecha de vigencia. Si no llega en 24 h, escribinos.
            </li>
            <li>
              <strong className="text-zinc-200">Reactivación:</strong> podés volver a Pro/Elite cuando quieras; se cobra el período nuevo. Tus datos se mantienen según{' '}
              <Link href="/legal/privacidad" className="underline text-[#D6FF2A]">Privacidad §5</Link>.
            </li>
            <li>
              <strong className="text-zinc-200">Baja de cuenta:</strong> podés pedir borrado total en Ajustes → Cuenta → Eliminar cuenta (ver Privacidad §8).
            </li>
          </ul>
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
            <strong className="text-zinc-200">Argentina — Botón de baja (Ley 24.240):</strong> disponible en Ajustes → Plan y en el footer de cada email de facturación. Cumple Res. 424/2020 y 12/2016. Pedido procesado en el acto; confirmación por email.
          </div>
        </Section>

        <Section title="7. Fallo de pago y suspensión" id="fallo">
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>Si un cobro falla (fondos, vencimiento, 3DS), reintentamos hasta 3 veces en 7 días y te avisamos por email/app.</li>
            <li>Durante el impago podés perder acceso a funciones Pro/Elite hasta regularizar. Tus datos no se borran.</li>
            <li>Si no se regulariza en 14 días, la suscripción puede cancelarse automáticamente y pasar a Básico.</li>
            <li>Cargos duplicados o errores de facturación: reembolso total sin demora indebida tras verificar (máx. 10 días hábiles).</li>
          </ul>
        </Section>

        <Section title="8. Impuestos, moneda y comprobantes" id="impuestos">
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>Precios incluyen IVA/impuestos indirectos aplicables salvo que se indique “+ impuestos”.</li>
            <li>Cobros en USD por defecto. En AR/BR pueden liquidarse en moneda local por el PSP al tipo de cambio del día; tu banco puede aplicar recargos o percepciones locales (no controlados por KinetixFitt).</li>
            <li>Comprobante/factura emitido por el PSP (Mercado Pago / Stripe) o por KinetixFitt según facturador local. Pedilo a pagos@kinetixfitt.com con CUIT/CNPJ.</li>
            <li>No reembolsamos impuestos retenidos por tu banco/estado si la ley no nos obliga.</li>
          </ul>
        </Section>

        <Section title="9. Cambios de precios" id="precios">
          <p>
            Podemos actualizar precios con <strong className="text-white">30 días de aviso</strong> por email y banner en la app. El nuevo precio
            aplica al siguiente ciclo posterior al aviso. Si no aceptás, cancelá antes de esa fecha y no se cobrará el nuevo precio. Histórico de precios a disposición a pedido.
          </p>
        </Section>

        <Section title="10. Uso, conducta y salud" id="uso">
          <p>
            Se aplican íntegramente{' '}
            <Link href="/legal/terminos" className="underline text-[#D6FF2A]">Términos §§6-8</Link> (contenido, conducta, disclaimer médico). El pago de la suscripción no implica asesoramiento médico. Ver aviso de salud en Términos §8.
          </p>
        </Section>

        <Section title="11. Contacto, reclamos y ley aplicable" id="contacto">
          <p>
            <strong className="text-white">Soporte y pagos:</strong>{' '}
            <a href="mailto:soporte@kinetixfitt.com" className="underline">soporte@kinetixfitt.com</a> ·{' '}
            <a href="mailto:pagos@kinetixfitt.com" className="underline">pagos@kinetixfitt.com</a> — lun–vie 9–18 ART ·{' '}
            <strong className="text-white">Legal:</strong>{' '}
            <a href="mailto:legal@kinetixfitt.com" className="underline">legal@kinetixfitt.com</a>
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>
              <strong>Argentina:</strong> defensa del consumidor / COPREC y Ley 24.240. Botón de arrepentimiento disponible conforme §5 y Términos §13.
            </li>
            <li>
              <strong>Brasil:</strong> CDC y Procon local; ANPD para datos personales.
            </li>
            <li>
              <strong>UE:</strong> autoridad de consumo y plataforma ODR UE para compras online (si aplica).
            </li>
          </ul>
          <p className="text-xs text-zinc-500">
            Ley aplicable y jurisdicción: ver <Link href="/legal/terminos" className="underline text-[#D6FF2A]">Términos §12</Link>. Conservás garantías mínimas de consumidor de tu domicilio.
          </p>
          <div className="mt-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
            <strong className="text-zinc-200">¿Necesitás factura con CUIT/CNPJ?</strong> Escribí a pagos@kinetixfitt.com con razón social, CUIT/CNPJ y domicilio fiscal. Emitimos en hasta 5 días hábiles.
          </div>
        </Section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/legal/terminos"
            className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-bold hover:bg-zinc-800"
          >
            Términos
          </Link>
          <Link
            href="/legal/privacidad"
            className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-bold hover:bg-zinc-800"
          >
            Privacidad
          </Link>
          <Link
            href="/legal/dpa"
            className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-bold hover:bg-zinc-800"
          >
            DPA
          </Link>
          <Link
            href="/legal/cookies"
            className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-bold hover:bg-zinc-800"
          >
            Cookies
          </Link>
          <Link href="/licencia" className="px-5 py-3 rounded-xl bg-white text-black text-sm font-black hover:bg-zinc-100">
            Licencia MIT
          </Link>
        </div>

        <div className="mt-8 text-center text-xs text-zinc-600">
          KinetixFitt — Suscripción transparente · Sin permanencia · Soporte en 24h
        </div>
      </div>
    </div>
  );
}
