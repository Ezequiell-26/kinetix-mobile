import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'KinetixFitt — Transforma tu Cuerpo, Domina tu Mente | 4.9★ 12k+ atletas';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#09090B',
          padding: 48,
          fontFamily: 'Inter, system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Lime glow */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 560,
            height: 560,
            background: 'radial-gradient(ellipse at center, rgba(214,255,42,0.18), transparent 70%)',
            borderRadius: 9999,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -140,
            left: -60,
            width: 480,
            height: 480,
            background: 'radial-gradient(ellipse at center, rgba(214,255,42,0.08), transparent 70%)',
            borderRadius: 9999,
          }}
        />
        {/* Grid subtle */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            opacity: 0.5,
          }}
        />

        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: '#D6FF2A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 900,
                color: '#09090B',
              }}
            >
              ⚡
            </div>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
              KINETIX<span style={{ color: '#D6FF2A' }}>FITT</span>
            </span>
            <span
              style={{
                marginLeft: 8,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#71717A',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)',
                padding: '4px 8px',
                borderRadius: 9999,
              }}
            >
              #1 COACHING LATAM
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '8px 14px',
              borderRadius: 9999,
              color: '#fff',
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            <span style={{ color: '#D6FF2A' }}>★</span> 4.9
            <span style={{ color: '#71717A', fontWeight: 600 }}>· 2.400 reseñas</span>
            <span
              style={{
                marginLeft: 6,
                width: 6,
                height: 6,
                borderRadius: 9999,
                background: '#22C55E',
              }}
            />
            <span style={{ fontSize: 12, color: '#A1A1AA' }}>12k+ atletas</span>
          </div>
        </div>

        {/* Hero center */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 1,
            marginTop: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(214,255,42,0.12)',
              border: '1px solid rgba(214,255,42,0.22)',
              color: '#D6FF2A',
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: '0.14em',
              padding: '6px 14px',
              borderRadius: 9999,
            }}
          >
            ◆ CIENCIA + IA + COMUNIDAD
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 62,
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>Consigue un físico</span>
            <span style={{ color: '#D6FF2A' }}>estético y fuerte</span>
            <span style={{ color: '#71717A', fontSize: 42, marginTop: 4 }}>progresando con ciencia</span>
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 16,
              color: '#A1A1AA',
              maxWidth: 720,
              lineHeight: 1.5,
              fontWeight: 500,
            }}
          >
            Programación inteligente · Nutrición precisa · Seguimiento humano real
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { v: '12k+', l: 'Atletas' },
              { v: '1.2M+', l: 'Entrenos' },
              { v: '92%', l: 'Retención' },
            ].map((s) => (
              <div
                key={s.l}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: '10px 18px',
                  minWidth: 96,
                }}
              >
                <span style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.v}</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    color: '#D6FF2A',
                    marginTop: 2,
                  }}
                >
                  {s.l}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#D6FF2A',
                color: '#09090B',
                fontSize: 14,
                fontWeight: 900,
                padding: '12px 18px',
                borderRadius: 9999,
              }}
            >
              Comenzar gratis →
            </div>
            <div style={{ fontSize: 11, color: '#52525B', fontWeight: 700, lineHeight: 1.3 }}>
              kinetixfitt.com
              <br />
              <span style={{ color: '#71717A' }}>14 días gratis · Sin tarjeta</span>
            </div>
          </div>
        </div>

        {/* Lime underline accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: '#D6FF2A',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
