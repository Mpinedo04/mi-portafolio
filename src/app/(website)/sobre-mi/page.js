import { aboutContent, capabilities as fallbackCapabilities } from '@/data/portfolio';
import { getPage } from '@/sanity/lib/queries';
import CapabilityCard from '@/components/CapabilityCard';
import OpsConsole from '@/components/OpsConsole';
import styles from './page.module.css';
import { pageMetadata } from '@/lib/seo';

const workstationContent = { capabilities: fallbackCapabilities };

export async function generateMetadata() {
  const about = await getPage('about', 'about', aboutContent, { stega: false });
  return pageMetadata({ title: about.seo?.metaTitle || aboutContent.seo.metaTitle, description: about.seo?.metaDescription || aboutContent.seo.metaDescription, path: '/sobre-mi' });
}

export default async function AboutPage() {
  const [about, workstation] = await Promise.all([
    getPage('about', 'about', aboutContent),
    getPage('workstation', 'workstation', workstationContent),
  ]);
  const capabilities = [...(workstation.capabilities || [])].sort((a, b) => (a.orderRank || 0) - (b.orderRank || 0));
  return <main className="page-main">
    <section id="sobre-mi" className={`page-section ${styles.profile}`}>
      <p className="section-label">{about.sectionLabel}</p>
      <h2>{about.sectionTitle}</h2>
      <div className="grid">
        <div>{(Array.isArray(about.bio) ? about.bio : String(about.bio || '').split(/\n\s*\n/)).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        <div className="skills-grid">{(about.skills || []).map((skill) => <div className="skill-item" key={skill.name}><span className="skill-name">{skill.name}</span>{skill.detail}</div>)}</div>
      </div>
    </section>

    <section className={`page-section capabilities-section ${styles.capabilities}`}>
      <p className="section-label">{'// capacidades detectadas'}</p>
      <h2>Capacidades operativas</h2>
      <OpsConsole capabilities={capabilities}/>
      <div className="capabilities-grid">{capabilities.map((item) => <CapabilityCard item={item} key={item.node || item.title}/>)}</div>
    </section>
  </main>;
}
