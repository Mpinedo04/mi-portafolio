import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projectsWithReports as fallbackProjects } from '@/data/reports';
import { getProject } from '@/sanity/lib/queries';
import { stegaClean } from 'next-sanity';
import ProjectCard from '@/components/ProjectCard';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const fallback = fallbackProjects.find((item) => item.slug === slug) || null;
  const project = await getProject(slug, fallback, { stega: false });
  if (!project) return { title: 'Proyecto no encontrado · Miguel Pinedo' };
  return pageMetadata({ title: project.seo?.metaTitle || `${project.title} · Miguel Pinedo`, description: project.seo?.metaDescription || project.description, path: `/proyectos/${slug}` });
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const fallback = fallbackProjects.find((item) => item.slug === slug) || null;
  const project = await getProject(slug, fallback);
  if (!project) notFound();
  const reportPath = project.reports?.length ? `/proyectos/${stegaClean(project.slug || slug)}/informe` : null;
  return <main className="page-main">
    <section className={`page-section ${styles.section}`}>
      <p className="section-label">{'// proyecto seleccionado'}</p>
      <h2>{project.title}</h2>
      <p className={styles.description}>{project.description}</p>
      <div className={styles.card}><ProjectCard project={project} index={Math.max(0, fallbackProjects.findIndex((item) => item.slug === slug))}/></div>
      <div className={styles.navigation}>
        {reportPath && <Link className="btn-primary" href={reportPath}>abrir caso de estudio →</Link>}
        <Link className="btn-ghost" href="/proyectos">← volver a proyectos</Link>
      </div>
    </section>
  </main>;
}
