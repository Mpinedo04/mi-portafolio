import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContent } from '@/data/content';
import { reports as fallbackReports } from '@/data/reports';
import { localePath } from '@/i18n/config';
import { t } from '@/i18n/ui';
import { getReport } from '@/sanity/lib/queries';
import PortableTextRenderer from '@/components/PortableTextRenderer';
import PrintButton from '@/components/PrintButton';
import { stegaClean } from 'next-sanity';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

const fallbackFor = (slug, reportSlug) => fallbackReports.find((item) => item.projectSlug === slug && item.slug === reportSlug) || null;

export async function generateMetadata({ params }) {
  const { lang, slug, reportSlug } = await params;
  const report = await getReport(slug, reportSlug, fallbackFor(slug, reportSlug), { stega: false, lang });
  if (!report) return { title: t(lang).report.notFound };
  return pageMetadata({ title: report.seo?.metaTitle || `${report.title} · Miguel Pinedo`, description: report.seo?.metaDescription, path: `/proyectos/${slug}/informe/${reportSlug}`, lang });
}

// Los informes solo existen en español; en inglés y catalán se muestran con un aviso.
export default async function ReportPage({ params }) {
  const { lang, slug, reportSlug } = await params;
  const ui = t(lang).report;
  const report = await getReport(slug, reportSlug, fallbackFor(slug, reportSlug), { lang });
  if (!report) notFound();
  const projectSlug = stegaClean(report.project?.slug || slug);
  const project = getContent(lang).projectsWithReports.find((item) => item.slug === projectSlug);
  const projectTitle = project?.title || report.project?.title || projectSlug;
  const single = (project?.reports?.length || 0) <= 1;
  const backHref = single ? `/proyectos/${projectSlug}` : `/proyectos/${projectSlug}/informe`;
  return <main className={`page-main ${styles.main}`}>
    <article className={styles.article} lang="es">
      <p className="section-label" lang={lang}>{ui.label}{projectTitle}</p>
      {ui.spanishOnly && <p className={styles.notice} lang={lang}>{ui.spanishOnly}</p>}
      <h1 className={styles.title}>{report.title}</h1>
      <nav className={styles.breadcrumbs} aria-label={ui.breadcrumbs} lang={lang}>
        <Link href={localePath(lang, '/proyectos')}>{ui.projects}</Link><span>/</span>
        <Link href={localePath(lang, `/proyectos/${projectSlug}`)}>{projectTitle}</Link>
        {!single && <><span>/</span><Link href={localePath(lang, `/proyectos/${projectSlug}/informe`)}>{ui.reports}</Link></>}
        <PrintButton className={styles.print} label={ui.print}/>
      </nav>
      <PortableTextRenderer value={report.body} lang={lang}/>
      <div className={styles.back} lang={lang}><Link className="btn-ghost" href={localePath(lang, backHref)}>{single ? ui.back : ui.backToList}</Link></div>
    </article>
  </main>;
}
