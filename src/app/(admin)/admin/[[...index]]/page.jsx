'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../../sanity.config';

export default function AdminPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return <main style={{ maxWidth: 680, margin: '10vh auto', padding: 24, fontFamily: 'system-ui' }}>
      <h1>Conecta tu proyecto Sanity</h1>
      <p>Configura <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> en <code>.env.local</code> para abrir Studio. El portfolio funciona en local con el contenido actual mientras tanto.</p>
    </main>;
  }
  return <NextStudio config={config} />;
}
