import Link from 'next/link';
import { getContent } from '@/data/content';
import { localePath } from '@/i18n/config';
import { t } from '@/i18n/ui';
import { getPage, getProjects } from '@/sanity/lib/queries';
import Hero from '@/components/Hero';
import FeaturedProject from '@/components/FeaturedProject';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { homeContent } = getContent(lang);
  const home = await getPage('home', 'home', homeContent, { stega: false, lang });
  return pageMetadata({ title: home.seo?.metaTitle || homeContent.seo.metaTitle, description: home.seo?.metaDescription || homeContent.seo.metaDescription, path: '/', lang });
}

export default async function HomePage({ params }) {
  const { lang } = await params;
  const content = getContent(lang);
  const ui = t(lang);
  const [home, projects, contact, settings] = await Promise.all([
    getPage('home', 'home', content.homeContent, { lang }),
    getProjects(content.projectsWithReports, { lang }),
    getPage('contact', 'contact', content.contactContent, { stega: false, lang }),
    getPage('settings', 'settings', content.siteSettings, { stega: false, lang }),
  ]);
  const terminalProjects = (projects || []).map((project) => ({ title: project.title, slug: project.slug }));
  return <main className={styles.main}>
    <Hero content={home} projects={terminalProjects} contact={{ links: contact?.links || [] }} cvUrl={settings?.cvUrl || content.siteSettings.cvUrl}/>
    <FeaturedProject projects={projects || []} lang={lang}/>
    <section className={styles.intro}>
      <div className={styles.introInner}>
        <p className="section-label">{ui.home.profileLabel}</p>
        <h2>{home.introTitle}</h2>
        <p className={styles.copy}>{home.introBody}</p>
        <Link className={styles.more} href={localePath(lang, '/sobre-mi')}>{ui.home.seeProfile}</Link>
      </div>
    </section>
  </main>;
}
