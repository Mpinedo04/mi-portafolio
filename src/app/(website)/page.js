import Link from 'next/link';
import { contactContent, homeContent, siteSettings } from '@/data/portfolio';
import { projectsWithReports as fallbackProjects } from '@/data/reports';
import { getPage, getProjects } from '@/sanity/lib/queries';
import Hero from '@/components/Hero';
import FeaturedProject from '@/components/FeaturedProject';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export async function generateMetadata() {
  const home = await getPage('home', 'home', homeContent, { stega: false });
  return pageMetadata({ title: home.seo?.metaTitle || homeContent.seo.metaTitle, description: home.seo?.metaDescription || homeContent.seo.metaDescription, path: '/' });
}

export default async function HomePage() {
  const [home, projects, contact, settings] = await Promise.all([
    getPage('home', 'home', homeContent),
    getProjects(fallbackProjects),
    getPage('contact', 'contact', contactContent, { stega: false }),
    getPage('settings', 'settings', siteSettings, { stega: false }),
  ]);
  const terminalProjects = (projects || []).map((project) => ({ title: project.title, slug: project.slug }));
  return <main className={styles.main}>
    <Hero content={home} projects={terminalProjects} contact={{ links: contact?.links || [] }} cvUrl={settings?.cvUrl || siteSettings.cvUrl}/>
    <FeaturedProject projects={projects || []}/>
    <section className={styles.intro}>
      <div className={styles.introInner}>
        <p className="section-label">{'// 02 - perfil operativo'}</p>
        <h2>{home.introTitle}</h2>
        <p className={styles.copy}>{home.introBody}</p>
        <Link className={styles.more} href="/sobre-mi">ver perfil y capacidades →</Link>
      </div>
    </section>
  </main>;
}
