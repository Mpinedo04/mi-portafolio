import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import { Analytics } from '@vercel/analytics/next';
import { VisualEditing } from 'next-sanity/visual-editing';
import { stegaClean } from 'next-sanity';
import { getContent } from '@/data/content';
import { caseStudyPath } from '@/data/reports';
import { isLocale, locales } from '@/i18n/config';
import { t } from '@/i18n/ui';
import { ogImage, siteUrl } from '@/lib/seo';
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
import CommandPalette from '@/components/CommandPalette';
import PageEffects from '@/components/PageEffects';
import styles from './layout.module.css';
import '../globals.css';
import '../effects.css';

export const revalidate = 10;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { homeContent } = getContent(lang);
  const ui = t(lang);
  return {
    metadataBase: new URL(siteUrl),
    title: homeContent.seo.metaTitle,
    description: homeContent.seo.metaDescription,
    applicationName: ui.seo.siteName,
    authors: [{ name: 'Miguel Pinedo', url: 'https://github.com/mpinedo04' }],
    openGraph: { type: 'website', siteName: ui.seo.siteName, images: [{ ...ogImage, alt: ui.seo.ogAlt }] },
    twitter: { card: 'summary_large_image', images: [{ ...ogImage, alt: ui.seo.ogAlt }] },
    icons: { icon: '/assets/favicon.svg', shortcut: '/assets/favicon.svg' },
  };
}

export default async function WebsiteLayout({ children, params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { siteSettings, projectsWithReports, contactContent } = getContent(lang);
  const settings = await getPage('settings', 'settings', siteSettings, { lang });
  const safeSettings = {
    ...settings,
    cvUrl: stegaClean(settings?.cvUrl || siteSettings.cvUrl),
    navigation: (settings?.navigation || siteSettings.navigation).map((item) => ({ ...item, href: stegaClean(item.href || '/') })),
  };
  const isDraft = sanityReady && (await draftMode()).isEnabled;
  const paletteProjects = projectsWithReports.map((project) => ({ title: project.title, slug: project.slug, casePath: caseStudyPath(project) }));
  const email = contactContent.links?.find((item) => item.iconKey === 'mail')?.url || null;

  return <html lang={lang} data-scroll-behavior="smooth">
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
          <Header settings={safeSettings} lang={lang}/>
          {children}
          <Footer settings={safeSettings} lang={lang}/>
        </PageTransition>
        <CommandPalette lang={lang} projects={paletteProjects} cvUrl={safeSettings.cvUrl} email={email}/>
        <PageEffects/>
        {sanityLiveReady && <SanityLive/>}
        {isDraft && <><VisualEditing/><DisableDraftMode/></>}
        {!isDraft && <Analytics/>}
      </div>
    </body>
  </html>;
}
