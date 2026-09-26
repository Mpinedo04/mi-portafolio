import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projectsWithReports as fallbackProjects } from '@/data/reports';
import { getProject } from '@/sanity/lib/queries';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';
import { stegaClean } from 'next-sanity';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const fallback = fallbackProjects.find((item) => item.slug === slug) || null;
  const project = await getProject(slug, fallback, { stega: false });
  if (!project) return { title: 'Informes no encontrados · Miguel Pinedo' };
  return pageMetadata({ title: `Informes · ${project.title} · Miguel Pinedo`, description: `Guías e informes técnicos de incidentes del proyecto ${project.title}, con evidencias, correspondencia con MITRE ATT&CK y medidas de contención.`, path: `/proyectos/${slug}/informe` });
}

export default async function ProjectReportsPage({ params }) {
  const { slug } = await params;
  const fallback = fallbackProjects.find((item) => item.slug === slug) || null;
  const project = await getProject(slug, fallback);
  if (!project) notFound();
  const reports = project.reports || [];
  return <main className="page-main">
    <section className={`page-section ${styles.section}`}>
      <p className="section-label">{'// documentación técnica'}</p>
      <h2>Casos de estudio</h2>
      <p className={styles.intro}>{project.title} · guías e informes del laboratorio SOC.</p>
      {reports.length ? <div className={styles.list}>{reports.map((report, index) => <Link className={styles.report} href={`/proyectos/${slug}/informe/${stegaClean(report.slug || '')}`} key={report._id || report.slug}>
        <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.text}><strong>{report.title}</strong><small>{report.seo?.metaDescription || 'Abrir documentación técnica'}</small></span>
        <span className={styles.arrow}>↗</span>
      </Link>)}</div> : <p className={styles.empty}>Todavía no hay informes publicados para este proyecto.</p>}
      <Link className="btn-ghost" href={`/proyectos/${slug}`}>← volver al proyecto</Link>
    </section>
  </main>;
}
