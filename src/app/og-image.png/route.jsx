import { ImageResponse } from 'next/og';
import { ogImage } from '@/lib/seo';

// Imagen de vista previa al compartir el enlace (LinkedIn, WhatsApp, X…). Se genera una vez en el build.
export const dynamic = 'force-static';

const colors = {
  bg: '#0a0e16',
  panel: '#0f141f',
  gold: '#c9a86a',
  goldStrong: '#e2c893',
  white: '#e9eaf0',
  slate: '#939cb0',
  faint: '#667089',
  sage: '#85bda1',
  border: 'rgba(214, 222, 235, 0.14)',
};

const checks = [
  'Laboratorio SOC con Wazuh',
  '3 informes de incidentes',
  'ASIX · nota final 8,01',
];

const tags = ['Blue Team', 'SOC', 'Wazuh', 'Windows y Linux', 'Redes'];

export function GET() {
  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: '64px 72px', background: colors.bg, color: colors.white,
      backgroundImage: 'linear-gradient(rgba(201,168,106,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,106,0.05) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Píldora del nombre, como el logo de la cabecera: borde dorado con un destello */}
        <div style={{ display: 'flex', padding: 2, borderRadius: 999, background: `linear-gradient(110deg, rgba(201,168,106,0.35) 0%, rgba(201,168,106,0.35) 55%, #f6e2b4 78%, rgba(201,168,106,0.35) 100%)` }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 30px', borderRadius: 999, background: 'linear-gradient(135deg, #26211a 0%, #0e121b 70%)', fontSize: 24, fontWeight: 600, letterSpacing: 5, color: colors.white }}>
            MIGUEL PINEDO
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: 4, color: colors.faint }}>PORTAFOLIO</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', fontSize: 24, letterSpacing: 5, color: colors.gold }}>{'// TÉCNICO EN CIBERSEGURIDAD Y SISTEMAS'}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 116, lineHeight: 1.02, letterSpacing: -2 }}>
            <span>Miguel</span>
            <span style={{ color: colors.goldStrong }}>Pinedo</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', width: 420, border: `1px solid ${colors.border}`, borderRadius: 14, background: colors.panel, overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: 8, padding: '14px 18px', borderBottom: `1px solid ${colors.border}` }}>
              <div style={{ width: 12, height: 12, borderRadius: 999, background: '#ff5f57' }}/>
              <div style={{ width: 12, height: 12, borderRadius: 999, background: '#febc2e' }}/>
              <div style={{ width: 12, height: 12, borderRadius: 999, background: '#28c840' }}/>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '20px 22px 24px', fontSize: 23 }}>
              {checks.map((item) => <div key={item} style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: colors.sage }}>[OK]</span>
                <span style={{ color: colors.white }}>{item}</span>
              </div>)}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: 22, fontSize: 30, color: colors.slate }}>Listo para defender sistemas y redes desde mi primer puesto.</div>
      </div>

      <div style={{ display: 'flex', gap: 14 }}>
        {tags.map((tag) => <div key={tag} style={{ display: 'flex', padding: '8px 18px', border: `1px solid rgba(201,168,106,0.3)`, borderRadius: 999, fontSize: 22, color: colors.gold }}>{tag}</div>)}
      </div>
    </div>,
    { width: ogImage.width, height: ogImage.height },
  );
}
