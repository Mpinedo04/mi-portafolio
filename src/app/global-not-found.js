import Link from 'next/link';
import { Analytics } from '@vercel/analytics/next';
import { siteSettings } from '@/data/portfolio';
import { t } from '@/i18n/ui';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import RouteTrace from '@/components/RouteTrace';
import ParticleBackground from '@/components/ParticleBackground';
import ScrollProgress from '@/components/ScrollProgress';
import styles from './(website)/[lang]/not-found.module.css';
import './(website)/globals.css';
import globalStyles from './global-not-found.module.css';

const ui = t('es').notFound;

// Rutas que no existen en ningún idioma: se muestran en español, que es el idioma por defecto.
export const metadata = {
  title: '404 · Página no encontrada - Miguel Pinedo',
  description: ui.description,
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
          <Header settings={siteSettings} lang="es"/>
          <main className={styles.wrap}>
            <section className={styles.section}>
              <p className="section-label">{ui.label}</p>
              <h1 className={styles.code}>4<span>0</span>4</h1>
              <p className={styles.description}>{ui.description}</p>
              <RouteTrace lang="es"/>
              <Link className="btn-primary" href="/">{ui.back}</Link>
            </section>
          </main>
          <Footer settings={siteSettings}/>
        </PageTransition>
        <Analytics/>
      </div>
    </body>
  </html>;
}
