import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Licencia MIT | KinetixFitt',
  description: 'Licencia MIT de KinetixFitt y atribuciones a proyectos open source.',
};

export default function LicenciaPage() {
  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-zinc-500 hover:text-white">
          ← Volver al inicio
        </Link>

        <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-black tracking-widest uppercase text-white">
          Legal · Licencia
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white">Licencia</h1>
        <p className="mt-2 text-sm text-zinc-500">Código bajo MIT + atribuciones. Contenido y marca reservados.</p>

        <div className="mt-8 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8">
          <h2 className="text-lg font-black text-white">MIT License</h2>
          <p className="text-sm text-zinc-500 mt-1">Copyright (c) 2026 KinetixFitt Inc.</p>
          <div className="mt-6 p-5 rounded-xl bg-zinc-950 border border-zinc-800 text-[13px] leading-relaxed text-zinc-300 font-mono whitespace-pre-wrap">
{`Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-[#D6FF2A]/10 border border-[#D6FF2A]/20 text-[13px] leading-relaxed text-zinc-300">
            <strong className="text-white">Qué cubre el MIT:</strong> el código fuente de la plataforma (frontend/backend) publicado en el repositorio. Podés usar, copiar, modificar y distribuir con la condición de mantener el aviso de copyright y esta licencia.
            <br />
            <strong className="text-white">Qué NO cubre:</strong> marca KINETIXFITT, logos, diseño de marca, contenidos de entrenamiento/nutrición, textos, imágenes y bases de datos de ejercicios con licencia propia. Esos derechos quedan reservados y requieren permiso escrito.
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
          <h3 className="text-sm font-black text-white">Atribuciones MIT de terceros</h3>
          <p className="text-xs text-zinc-500 mt-1">Este proyecto integra patrones e ideas de repositorios MIT con atribución. Ver detalle completo en <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs">docs/MIT_ATTRIBUTION.md</code> y en <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs">LICENSE</code> en la raíz del repo.</p>
          <ul className="mt-4 space-y-2 text-[13px] text-zinc-400 list-disc list-inside">
            <li><strong className="text-zinc-200">jessedelira/gym-tracker</strong> — patrón ActiveSession/CompletedSession, ActivityGraph, SearchableDropdown — MIT</li>
            <li><strong className="text-zinc-200">Cawlumm/lyftr, brandonp2412/FitBook & Flexify</strong> — Gym Mode, PR tracker, muscle map, food DB — MIT</li>
            <li><strong className="text-zinc-200">OpenHIIT, Tactical Barbell (Unbroken), Granite</strong> — HIIT timers, plantillas, PWA offline — MIT</li>
            <li><strong className="text-zinc-200">SparkyFitness, Strive, LiftShift, Akilo, Workout.cool</strong> — hábitos, gamificación, analíticas — MIT</li>
            <li>Todos listados con repo, autor y uso específico en <code className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs">docs/MIT_ATTRIBUTION.md</code>.</li>
          </ul>
          <p className="mt-4 text-xs text-zinc-500">Si sos autor de alguno de estos proyectos y querés corrección de atribución, escribí a <a href="mailto:legal@kinetixfitt.com" className="underline">legal@kinetixfitt.com</a>.</p>
        </div>

        <div className="mt-8 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs leading-relaxed text-zinc-500">
          <strong className="text-zinc-300">Aviso:</strong> esta página es informativa. La licencia aplicable al código es el archivo <code className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300">LICENSE</code> en la raíz del repositorio. En caso de conflicto, prevalece ese archivo.
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/legal/privacidad" className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-bold hover:bg-zinc-800">Privacidad</Link>
          <Link href="/legal/terminos" className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-bold hover:bg-zinc-800">Términos</Link>
          <Link href="/legal/cookies" className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-bold hover:bg-zinc-800">Cookies</Link>
          <a href="https://github.com/kinetixfitt" target="_blank" rel="noopener noreferrer" className="px-5 py-3 rounded-xl bg-white text-black text-sm font-black hover:bg-zinc-100">Ver repositorio</a>
        </div>
      </div>
    </div>
  );
}
