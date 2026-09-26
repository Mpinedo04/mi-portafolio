import Link from 'next/link';
import { Analytics } from '@vercel/analytics/next';
import { siteSettings } from '@/data/portfolio';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ParticleBackground from '@/components/ParticleBackground';
import ScrollProgress from '@/components/ScrollProgress';
import styles from './(website)/not-found.module.css';
import './(website)/globals.css';
import globalStyles from './global-not-found.module.css';

export const metadata = {
  title: '404 · Ruta no encontrada - Miguel Pinedo',
  description: 'Página no encontrada - Miguel Pinedo Cybersecurity Portfolio',
  icons: { icon: '/assets/favicon.svg' },
};

export default function GlobalNotFound() {
  return <html lang="es" data-scroll-behavior="smooth">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/>
    </head>
    <body>
      <div className={globalStyles.root}>
        <ParticleBackground/><ScrollProgress/>
        <PageTransition>
          <Header settings={siteSettings}/>
          <main className={styles.wrap}>
            <section className={styles.section}>
              <p className="section-label">{'// ERROR 404 · RUTA NO ENCONTRADA'}</p>
              <h1 className={styles.code}>4<span>0</span>4</h1>
              <p className={styles.description}>El nodo o endpoint solicitado no existe, ha sido segmentado o no se encuentra en el mapa de red activo.</p>
              <div className="terminal" style={{ margin: '0 auto 2.5rem' }}>
                <div className="terminal-bar"><span className="dot dot-r"/><span className="dot dot-y"/><span className="dot dot-g"/><span className="terminal-title">route_error.log - bash</span></div>
                <div className="terminal-body" style={{ minHeight: 110, textAlign: 'left' }}>
                  <span className="t-line"><span className="t-prompt">&gt; </span><span className="t-cmd">traceroute target_node</span></span>
                  <span className="t-line"><span className="t-warn">[!] Destination unreachable: 404_NOT_FOUND</span></span>
                  <span className="t-line"><span className="t-prompt">&gt; </span><span className="t-out">initiating secure fallback protocol...</span></span>
                </div>
              </div>
              <Link className="btn-primary" href="/">Volver al inicio seguro →</Link>
            </section>
          </main>
          <Footer settings={siteSettings}/>
        </PageTransition>
        <Analytics/>
      </div>
    </body>
  </html>;
}
