import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContent } from '@/data/content';
import { caseStudyPath } from '@/data/reports';
import { localePath } from '@/i18n/config';
import { t } from '@/i18n/ui';
import { getProject } from '@/sanity/lib/queries';
import { stegaClean } from 'next-sanity';
import ProjectCard from '@/components/ProjectCard';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

const fallbackFor = (lang, slug) => getContent(lang).projectsWithReports.find((item) => item.slug === slug) || null;

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const project = await getProject(slug, fallbackFor(lang, slug), { stega: false, lang });
  if (!project) return { title: t(lang).project.notFound };
  return pageMetadata({ title: project.seo?.metaTitle || `${project.title} · Miguel Pinedo`, description: project.seo?.metaDescription || project.description, path: `/proyectos/${slug}`, lang });
}

export default async function ProjectPage({ params }) {
  const { lang, slug } = await params;
  const ui = t(lang);
  const fallbackProjects = getContent(lang).projectsWithReports;
  const project = await getProject(slug, fallbackFor(lang, slug), { lang });
  if (!project) notFound();
  const casePath = caseStudyPath({ slug: stegaClean(project.slug || slug), reports: project.reports });
  return <main className="page-main">
    <section className={`page-section ${styles.section}`}>
      <p className="section-label">{ui.project.label}</p>
      <h2>{project.title}</h2>
      <p className={styles.description}>{project.description}</p>
      <div className={styles.card}><ProjectCard project={project} lang={lang} index={Math.max(0, fallbackProjects.findIndex((item) => item.slug === slug))}/></div>
      <div className={styles.navigation}>
        {casePath && <Link className="btn-primary" href={localePath(lang, casePath)}>{ui.project.openCase}</Link>}
        <Link className="btn-ghost" href={localePath(lang, '/proyectos')}>{ui.project.back}</Link>
      </div>
    </section>
  </main>;
}
