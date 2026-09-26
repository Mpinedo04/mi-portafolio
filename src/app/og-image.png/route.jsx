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
  'Regla propia 100100',
];

const tags = ['Blue Team', 'SOC', 'Wazuh', 'Pentesting web', 'Linux'];

export function GET() {
  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: '64px 72px', background: colors.bg, color: colors.white,
      backgroundImage: 'linear-gradient(rgba(201,168,106,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,106,0.05) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', border: `1px solid ${colors.border}`, borderRadius: 999, fontSize: 24, color: colors.white }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: colors.sage }}/>
          <span style={{ color: colors.gold }}>root</span>
          <span style={{ color: colors.faint }}>@</span>
          <span>miguel</span>
          <span style={{ color: colors.faint }}>:~$</span>
        </div>
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: 4, color: colors.faint }}>PORTAFOLIO</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', fontSize: 24, letterSpacing: 5, color: colors.gold }}>{'// SECURITY RESEARCHER & DEVELOPER'}</div>
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
        <div style={{ display: 'flex', marginTop: 22, fontSize: 30, color: colors.slate }}>Encuentro vulnerabilidades antes de que las encuentren otros.</div>
      </div>

      <div style={{ display: 'flex', gap: 14 }}>
        {tags.map((tag) => <div key={tag} style={{ display: 'flex', padding: '8px 18px', border: `1px solid rgba(201,168,106,0.3)`, borderRadius: 999, fontSize: 22, color: colors.gold }}>{tag}</div>)}
      </div>
    </div>,
    { width: ogImage.width, height: ogImage.height },
  );
}
