import Image from 'next/image';
import Link from 'next/link';
import { stegaClean } from 'next-sanity';
import styles from './FeaturedProject.module.css';

const isExternal = (url) => /^https?:\/\//.test(url);
const imageOf = (project) => (project.mainImage?.asset ? project.mainImage.asset.url : (typeof project.mainImage === 'string' ? project.mainImage : ''));

/* Portada: proyecto principal con sus cifras e informes, y el resto en una fila compacta. */
export default function FeaturedProject({ projects = [] }) {
  const ordered = [...projects].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (a.orderRank || 0) - (b.orderRank || 0));
  const [featured, ...rest] = ordered;
  if (!featured) return null;

  const slug = stegaClean(featured.slug || '');
  const caseStudy = featured.reports?.length ? `/proyectos/${slug}/informe` : `/proyectos/${slug}`;
  const downloads = (featured.externalLinks || []).filter((link) => stegaClean(link.kind || '') === 'download');
  const image = imageOf(featured);

  return <section className={styles.section} aria-labelledby="destacado-titulo">
    <div className={styles.head}>
      <p className="section-label">{'// 01 - proyecto destacado'}</p>
      <Link className={styles.all} href="/proyectos">todos los proyectos →</Link>
    </div>

    <article className={styles.feature}>
      {image && <Link href={caseStudy} className={styles.media} tabIndex={-1} aria-hidden="true">
        <Image src={image} alt="" width={1600} height={1000} sizes="(max-width: 900px) 100vw, 58vw" unoptimized/>
        <span className={styles.mediaHint}>abrir caso de estudio →</span>
      </Link>}

      <div className={styles.body}>
        {featured.customLabel && <p className="project-num">[ {featured.customLabel} ]</p>}
        <h2 id="destacado-titulo" className={styles.title}><Link href={caseStudy}>{featured.title}</Link></h2>
        <p className={styles.description}>{featured.description}</p>

        {featured.stats?.length > 0 && <dl className={styles.stats}>
          {featured.stats.map((stat) => <div key={`${stat.value}-${stat.label}`}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}
        </dl>}

        {featured.reports?.length > 0 && <div className={styles.reports}>
          <p className={styles.reportsLabel}>informes publicados</p>
          <ul>
            {featured.reports.map((report) => <li key={report._id || report.slug}>
              <Link href={`/proyectos/${slug}/informe/${stegaClean(report.slug || '')}`}>{report.title}<span aria-hidden="true">→</span></Link>
            </li>)}
          </ul>
        </div>}

        {featured.tags?.length > 0 && <div className="tag-list">{featured.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>}

        <div className={styles.actions}>
          <Link className="btn-primary" href={caseStudy}>ver caso de estudio</Link>
          {downloads.map((link) => <a className="btn-ghost" key={link.url} href={stegaClean(link.url || '')} download>{link.label}</a>)}
        </div>
      </div>
    </article>

    {rest.length > 0 && <div className={styles.others}>
      <p className={styles.othersLabel}>también he construido</p>
      <ul>
        {rest.map((project) => {
          const demo = (project.externalLinks || []).find((link) => stegaClean(link.kind || '') === 'demo');
          const demoUrl = stegaClean(demo?.url || '');
          const thumb = imageOf(project);
          const href = demoUrl || `/proyectos/${stegaClean(project.slug || '')}`;
          const external = isExternal(href);
          return <li key={project._id || project.slug}>
            <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className={styles.other}>
              {thumb && <Image src={thumb} alt="" width={480} height={300} sizes="(max-width: 900px) 100vw, 30vw" unoptimized/>}
              <span className={styles.otherMeta}>{project.category || 'proyecto'}</span>
              <span className={styles.otherTitle}>{project.title}<span aria-hidden="true">{external ? ' ↗' : ' →'}</span></span>
              {external && <span className="sr-only"> (se abre en una pestaña nueva)</span>}
            </a>
          </li>;
        })}
      </ul>
    </div>}
  </section>;
}
