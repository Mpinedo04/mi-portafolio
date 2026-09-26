import { draftMode } from 'next/headers';
import { Analytics } from '@vercel/analytics/next';
import { VisualEditing } from 'next-sanity/visual-editing';
import { stegaClean } from 'next-sanity';
import { homeContent, siteSettings } from '@/data/portfolio';
import { ogImage, siteName, siteUrl } from '@/lib/seo';
import { getPage } from '@/sanity/lib/queries';
import { sanityLiveReady, sanityReady } from '@/sanity/lib/client';
import { SanityLive } from '@/sanity/lib/live';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ParticleBackground from '@/components/ParticleBackground';
import ScrollProgress from '@/components/ScrollProgress';
import SideScrollRail from '@/components/SideScrollRail';
import DisableDraftMode from '@/components/DisableDraftMode';
import styles from './layout.module.css';
import './globals.css';

export const revalidate = 10;

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Miguel Pinedo - Cybersecurity',
  description: homeContent.seo.metaDescription,
  applicationName: siteName,
  authors: [{ name: 'Miguel Pinedo', url: 'https://github.com/mpinedo04' }],
  openGraph: { type: 'website', locale: 'es_ES', siteName, images: [ogImage] },
  twitter: { card: 'summary_large_image', images: [ogImage] },
  icons: { icon: '/assets/favicon.svg', shortcut: '/assets/favicon.svg' },
};

export default async function WebsiteLayout({ children }) {
  const settings = await getPage('settings', 'settings', siteSettings);
  const safeSettings = {
    ...settings,
    cvUrl: stegaClean(settings?.cvUrl || siteSettings.cvUrl),
    navigation: (settings?.navigation || siteSettings.navigation).map((item) => ({ ...item, href: stegaClean(item.href || '/') })),
  };
  const isDraft = sanityReady && (await draftMode()).isEnabled;

  return <html lang="es" data-scroll-behavior="smooth">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/>
    </head>
    <body>
      <div className={styles.root}>
        <ParticleBackground/>
        <ScrollProgress/>
        <SideScrollRail/>
        <PageTransition>
          <Header settings={safeSettings}/>
          {children}
          <Footer settings={safeSettings}/>
        </PageTransition>
        {sanityLiveReady && <SanityLive/>}
        {isDraft && <><VisualEditing/><DisableDraftMode/></>}
        {!isDraft && <Analytics/>}
      </div>
    </body>
  </html>;
}
