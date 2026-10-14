import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContent } from '@/data/content';
import { localePath } from '@/i18n/config';
import { t } from '@/i18n/ui';
import { getProject } from '@/sanity/lib/queries';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';
import { stegaClean } from 'next-sanity';

const fallbackFor = (lang, slug) => getContent(lang).projectsWithReports.find((item) => item.slug === slug) || null;

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const ui = t(lang).reportsIndex;
  const project = await getProject(slug, fallbackFor(lang, slug), { stega: false, lang });
  if (!project) return { title: ui.notFound };
  return pageMetadata({ title: ui.metaTitle(project.title), description: ui.metaDescription(project.title), path: `/proyectos/${slug}/informe`, lang });
}

export default async function ProjectReportsPage({ params }) {
  const { lang, slug } = await params;
  const ui = t(lang).reportsIndex;
  const project = await getProject(slug, fallbackFor(lang, slug), { lang });
  if (!project) notFound();
  const reports = project.reports || [];
  return <main className="page-main">
    <section className={`page-section ${styles.section}`}>
      <p className="section-label">{ui.label}</p>
      <h2>{ui.title}</h2>
      <p className={styles.intro}>{ui.intro(project.title)}</p>
      {reports.length ? <div className={styles.list}>{reports.map((report, index) => <Link className={styles.report} href={localePath(lang, `/proyectos/${slug}/informe/${stegaClean(report.slug || '')}`)} key={report._id || report.slug}>
        <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.text}><strong>{report.title}</strong><small>{report.seo?.metaDescription || ui.open}</small></span>
        <span className={styles.arrow}>↗</span>
      </Link>)}</div> : <p className={styles.empty}>{ui.empty}</p>}
      <Link className="btn-ghost" href={localePath(lang, `/proyectos/${slug}`)}>{ui.back}</Link>
    </section>
  </main>;
}
