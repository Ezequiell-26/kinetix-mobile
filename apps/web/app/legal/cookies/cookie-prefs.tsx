'use client';

import { useState, useEffect } from 'react';

const KEY = 'kinetix_cookie_consent';

type Consent = { necessary: true; analytics: boolean; marketing: boolean; timestamp: string; version: string };

export function CookiePrefsIsland() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const c = JSON.parse(raw);
        setConsent(c);
        setAnalytics(!!c.analytics);
        setMarketing(!!c.marketing);
      }
    } catch {}
  }, []);

  const save = () => {
    const next: Consent = { necessary: true, analytics, marketing, timestamp: new Date().toISOString(), version: '1.0' };
    localStorage.setItem(KEY, JSON.stringify(next));
    setConsent(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag) {
      const gtag = (window as unknown as { gtag: (...a: unknown[]) => void }).gtag!;
      gtag('consent', 'update', {
        analytics_storage: analytics ? 'granted' : 'denied',
        ad_storage: marketing ? 'granted' : 'denied',
        ad_user_data: marketing ? 'granted' : 'denied',
        ad_personalization: marketing ? 'granted' : 'denied',
      });
    }
  };

  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-white">Gestionar consentimiento</h3>
          <p className="text-xs text-zinc-500 mt-1">Tu elección actual se muestra abajo. Los cambios se guardan en este dispositivo.</p>
        </div>
        {consent && (
          <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300">
            {consent.analytics || consent.marketing ? 'Personalizado' : 'Solo necesarias'}
          </span>
        )}
        {!consent && (
          <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300">Sin elección aún</span>
        )}
      </div>

      <div className="mt-5 grid gap-3">
        <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800">
          <div>
            <div className="text-sm font-bold text-white">Necesarias</div>
            <div className="text-xs text-zinc-500">Sesión y seguridad. Siempre activas.</div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#D6FF2A]/10 border border-[#D6FF2A]/20 text-[#D6FF2A] text-xs font-black">Activas</span>
        </div>

        <label className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-700">
          <div>
            <div className="text-sm font-bold text-white">Analíticas</div>
            <div className="text-xs text-zinc-500">Medición anónima del uso para mejorar la app.</div>
          </div>
          <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="w-5 h-5 accent-[#D6FF2A]" />
        </label>

        <label className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-700">
          <div>
            <div className="text-sm font-bold text-white">Marketing</div>
            <div className="text-xs text-zinc-500">Contenido relevante y medición de campañas.</div>
          </div>
          <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="w-5 h-5 accent-[#D6FF2A]" />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button onClick={save} className="px-6 py-3 rounded-xl bg-[#D6FF2A] text-black text-sm font-black hover:bg-[#E0FF5A] min-h-[44px]">
          Guardar preferencias
        </button>
        <button
          onClick={() => { setAnalytics(false); setMarketing(false); }}
          className="px-5 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm font-bold hover:bg-zinc-700 min-h-[44px]"
        >
          Rechazar opcionales
        </button>
        <button
          onClick={() => { setAnalytics(true); setMarketing(true); }}
          className="px-5 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm font-bold hover:bg-zinc-700 min-h-[44px]"
        >
          Aceptar todas
        </button>
      </div>

      {saved && <div className="mt-3 text-xs font-bold text-emerald-400">✓ Preferencias guardadas. Tu elección se aplica de inmediato.</div>}

      {consent && <div className="mt-3 text-[11px] text-zinc-600">Última actualización: {new Date(consent.timestamp).toLocaleString('es-AR')}</div>}
    </div>
  );
}
