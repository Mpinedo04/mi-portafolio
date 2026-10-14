import { getContent } from '@/data/content';
import { t } from '@/i18n/ui';
import { getProjects } from '@/sanity/lib/queries';
import ProjectCard from '@/components/ProjectCard';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const ui = t(lang);
  return pageMetadata({ title: ui.projects.metaTitle, description: ui.projects.metaDescription, path: '/proyectos', lang });
}

export default async function ProjectsPage({ params }) {
  const { lang } = await params;
  const ui = t(lang);
  const items = await getProjects(getContent(lang).projectsWithReports, { lang });
  const ordered = [...items].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (a.orderRank || 0) - (b.orderRank || 0));
  return <main className="page-main">
    <section id="proyectos" className={`page-section ${styles.section}`}>
      <p className="section-label">{ui.projects.label}</p>
      <h2>{ui.projects.title}</h2>
      <div className="projects-grid">
        {ordered.map((project, index) => <ProjectCard project={project} index={index} lang={lang} key={project._id || project.slug}/>)}
      </div>
    </section>
  </main>;
}
