'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

const STORAGE_KEY = 'kinetix_cookie_consent';
const CONSENT_VERSION = '1.0';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setVisible(true);
        return;
      }
      const parsed = JSON.parse(raw);
      // Re-show if version changed
      if (parsed.version !== CONSENT_VERSION) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const save = (consent: Consent) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...consent, version: CONSENT_VERSION })
    );
    // Notify analytics / gtag if present
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag!;
      gtag('consent', 'update', {
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        ad_storage: consent.marketing ? 'granted' : 'denied',
        ad_user_data: consent.marketing ? 'granted' : 'denied',
        ad_personalization: consent.marketing ? 'granted' : 'denied',
      });
    }
    window.dispatchEvent(new CustomEvent('kinetix:consent', { detail: consent }));
    setVisible(false);
    setShowPrefs(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Banner de cookies"
      className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6 pointer-events-none"
    >
      <div className="mx-auto max-w-[1100px] pointer-events-auto rounded-[20px] bg-zinc-900 border border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
        {!showPrefs ? (
          <div className="p-5 sm:p-6 flex flex-col lg:flex-row gap-5 items-start lg:items-center">
            <div className="flex-1">
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                🍪 Usamos cookies
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">
                Usamos cookies necesarias para que la web funcione y cookies opcionales (analíticas y de marketing) para mejorar tu experiencia. Podés aceptar todas, rechazar las opcionales o elegir en detalle. Más info en nuestra{' '}
                <Link href="/legal/cookies" className="underline decoration-zinc-600 hover:text-white">Política de Cookies</Link>
                {' '}y{' '}
                <Link href="/legal/privacidad" className="underline decoration-zinc-600 hover:text-white">Privacidad</Link>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto shrink-0">
              <button
                onClick={() => setShowPrefs(true)}
                className="px-5 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm font-bold hover:bg-zinc-700 transition min-h-[44px]"
              >
                Personalizar
              </button>
              <button
                onClick={() =>
                  save({ necessary: true, analytics: false, marketing: false, timestamp: new Date().toISOString() })
                }
                className="px-5 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm font-bold hover:bg-zinc-700 transition min-h-[44px]"
              >
                Rechazar opcionales
              </button>
              <button
                onClick={() =>
                  save({ necessary: true, analytics: true, marketing: true, timestamp: new Date().toISOString() })
                }
                className="px-6 py-3 rounded-xl bg-[#D6FF2A] text-black text-sm font-black hover:bg-[#E0FF5A] transition min-h-[44px]"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6">
            <h2 className="text-sm font-black text-white">Preferencias de cookies</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Las necesarias siempre están activas. Podés activar o desactivar las demás. Tu elección se guarda en este dispositivo.
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div>
                  <div className="text-sm font-bold text-white">Necesarias</div>
                  <div className="text-xs text-zinc-500 mt-1">Autenticación, seguridad y funcionamiento básico. No se pueden desactivar.</div>
                </div>
                <span className="shrink-0 px-3 py-1.5 rounded-full bg-[#D6FF2A]/10 border border-[#D6FF2A]/20 text-[#D6FF2A] text-xs font-black">Siempre activas</span>
              </div>

              <label className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-700">
                <div>
                  <div className="text-sm font-bold text-white">Analíticas</div>
                  <div className="text-xs text-zinc-500 mt-1">Nos ayudan a entender cómo usás la web (p. ej. páginas vistas, errores). Sin identificarte.</div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.analytics}
                  onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))}
                  className="mt-1 w-5 h-5 accent-[#D6FF2A] rounded"
                />
              </label>

              <label className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-700">
                <div>
                  <div className="text-sm font-bold text-white">Marketing</div>
                  <div className="text-xs text-zinc-500 mt-1">Para mostrarte contenido relevante y medir campañas. Solo con tu consentimiento.</div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.marketing}
                  onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))}
                  className="mt-1 w-5 h-5 accent-[#D6FF2A] rounded"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-end">
              <button
                onClick={() => setShowPrefs(false)}
                className="px-5 py-3 rounded-xl bg-transparent border border-zinc-800 text-zinc-300 text-sm font-bold hover:text-white hover:border-zinc-700 min-h-[44px]"
              >
                Volver
              </button>
              <button
                onClick={() =>
                  save({ necessary: true, analytics: prefs.analytics, marketing: prefs.marketing, timestamp: new Date().toISOString() })
                }
                className="px-6 py-3 rounded-xl bg-[#D6FF2A] text-black text-sm font-black hover:bg-[#E0FF5A] min-h-[44px]"
              >
                Guardar preferencias
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link href="/legal/cookies" className="text-xs font-bold text-zinc-500 hover:text-zinc-300 underline decoration-zinc-700">
                Ver política completa de cookies →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to read consent outside banner (for gating analytics scripts)
export function getCookieConsent(): Consent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
