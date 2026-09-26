import { projectsWithReports as fallbackProjects } from '@/data/reports';
import { getProjects } from '@/sanity/lib/queries';
import ProjectCard from '@/components/ProjectCard';
import styles from './page.module.css';

export async function generateMetadata() {
  return { title: 'Proyectos - Miguel Pinedo' };
}

export default async function ProjectsPage() {
  const items = await getProjects(fallbackProjects);
  const ordered = [...items].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (a.orderRank || 0) - (b.orderRank || 0));
  return <main className="page-main">
    <section id="proyectos" className={`page-section ${styles.section}`}>
      <p className="section-label">{'// 02 - proyectos'}</p>
      <h2>Trabajo seleccionado</h2>
      <div className="projects-grid">
        {ordered.map((project, index) => <ProjectCard project={project} index={index} key={project._id || project.slug}/>)}
      </div>
    </section>
  </main>;
}
