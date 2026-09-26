import Image from 'next/image';
import Link from 'next/link';
import { stegaClean } from 'next-sanity';
import styles from './ProjectCard.module.css';

const isExternal = (url) => /^https?:\/\//.test(url);

/*
 * Tarjeta de proyecto.
 * Toda la tarjeta es clicable mediante un único enlace principal (el del título),
 * que se estira sobre la tarjeta con ::after. Los demás enlaces (demo, código,
 * descargas) quedan por encima y funcionan por separado: no hay enlaces dentro de
 * enlaces y el teclado recorre cada destino una sola vez.
 */
export default function ProjectCard({ project, index = 0, headingLevel = 'h3' }) {
  const Heading = headingLevel;
  const mainImage = project.mainImage?.asset ? project.mainImage.asset.url : (typeof project.mainImage === 'string' ? project.mainImage : '');
  const mainAlt = project.mainImageAlt || project.mainImage?.alt || project.title;
  const projectSlug = stegaClean(project.slug || '');
  const links = (project.externalLinks || []).map((link) => ({ ...link, kind: stegaClean(link.kind || ''), url: stegaClean(link.url || '') })).filter((link) => link.url);
  const demo = links.find((link) => link.kind === 'demo');
  const repository = links.find((link) => link.kind === 'repository');
  const others = links.filter((link) => link !== demo && link !== repository);
  const reportHref = project.reports?.length ? `/proyectos/${projectSlug}/informe` : null;

  // Destino principal: el caso de estudio si existe; si no, la demo.
  const primary = reportHref
    ? { href: reportHref, label: 'caso de estudio', external: false }
    : demo ? { href: demo.url, label: 'ver demo', external: isExternal(demo.url) } : null;

  const title = primary
    ? primary.external
      ? <a className={styles.primary} href={primary.href} target="_blank" rel="noopener noreferrer">{project.title}<span className="sr-only"> (abre la demo en una pestaña nueva)</span></a>
      : <Link className={styles.primary} href={primary.href}>{project.title}</Link>
    : project.title;

  return <article className={`project-card ${project.featured ? 'project-card-featured' : ''} ${styles.card} ${primary ? styles.clickable : ''}`}>
    {mainImage && <div className={styles.media}>
      <Image className="project-preview" src={mainImage} alt={mainAlt} width={1000} height={640} sizes="(max-width: 760px) 100vw, 60vw" loading={project.featured ? 'eager' : undefined} unoptimized/>
      {primary && <span className={styles.badge} aria-hidden="true">{primary.label} {primary.external ? '↗' : '→'}</span>}
    </div>}
    <div className="project-card-body">
      <p className="project-num">[ {project.customLabel || String(index + 1).padStart(3, '0')} ]</p>
      <Heading className="project-title">{title}</Heading>
      {project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}
      <p className="project-desc">{project.description}</p>
      {project.stats?.length > 0 && <div className="project-stats" aria-label={`Resultados de ${project.title}`}>{project.stats.map((stat) => <span key={`${stat.value}-${stat.label}`}><strong>{stat.value}</strong> {stat.label}</span>)}</div>}
      {project.tags?.length > 0 && <div className="tag-list">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>}
      <div className={`project-links ${styles.links}`}>
        {reportHref && <Link className="project-link" href={reportHref}>caso de estudio →</Link>}
        {demo && <a className="project-link" href={demo.url} target={isExternal(demo.url) ? '_blank' : undefined} rel={isExternal(demo.url) ? 'noopener noreferrer' : undefined}>{demo.label || 'demo'} ↗</a>}
        {repository && <a className="project-link" href={repository.url} target="_blank" rel="noopener noreferrer">{repository.label || 'código'} ↗</a>}
        {others.map((link) => <a className="project-link" href={link.url} target={isExternal(link.url) ? '_blank' : undefined} rel={isExternal(link.url) ? 'noopener noreferrer' : undefined} download={link.kind === 'download' || undefined} key={`${link.kind}-${link.url}`}>{link.label}</a>)}
      </div>
    </div>
  </article>;
}
