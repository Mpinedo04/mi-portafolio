import Link from 'next/link';
import { notFound } from 'next/navigation';
import { reports as fallbackReports } from '@/data/reports';
import { getReport } from '@/sanity/lib/queries';
import PortableTextRenderer from '@/components/PortableTextRenderer';
import PrintButton from '@/components/PrintButton';
import { stegaClean } from 'next-sanity';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export async function generateMetadata({ params }) {
  const { slug, reportSlug } = await params;
  const fallback = fallbackReports.find((item) => item.projectSlug === slug && item.slug === reportSlug) || null;
  const report = await getReport(slug, reportSlug, fallback, { stega: false });
  if (!report) return { title: 'Informe no encontrado · Miguel Pinedo' };
  return pageMetadata({ title: report.seo?.metaTitle || `${report.title} · Miguel Pinedo`, description: report.seo?.metaDescription, path: `/proyectos/${slug}/informe/${reportSlug}` });
}

export default async function ReportPage({ params }) {
  const { slug, reportSlug } = await params;
  const fallback = fallbackReports.find((item) => item.projectSlug === slug && item.slug === reportSlug) || null;
  const report = await getReport(slug, reportSlug, fallback);
  if (!report) notFound();
  const projectSlug = stegaClean(report.project?.slug || slug);
  return <main className={`page-main ${styles.main}`}>
    <article className={styles.article}>
      <p className="section-label">{'// informe técnico · '}{report.project?.title || 'Laboratorio SOC'}</p>
      <h1 className={styles.title}>{report.title}</h1>
      <nav className={styles.breadcrumbs} aria-label="Ruta de navegación">
        <Link href="/proyectos">proyectos</Link><span>/</span>
        <Link href={`/proyectos/${projectSlug}`}>{report.project?.title || 'Laboratorio SOC'}</Link><span>/</span>
        <Link href={`/proyectos/${projectSlug}/informe`}>informes</Link>
        <PrintButton className={styles.print}/>
      </nav>
      <PortableTextRenderer value={report.body}/>
      <div className={styles.back}><Link className="btn-ghost" href={`/proyectos/${projectSlug}/informe`}>← volver a casos de estudio</Link></div>
    </article>
  </main>;
}
