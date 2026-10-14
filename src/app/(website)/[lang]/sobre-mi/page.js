import { getContent } from '@/data/content';
import { t } from '@/i18n/ui';
import { getPage } from '@/sanity/lib/queries';
import CapabilityCard from '@/components/CapabilityCard';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import OpsConsole from '@/components/OpsConsole';
import styles from './page.module.css';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { aboutContent } = getContent(lang);
  const about = await getPage('about', 'about', aboutContent, { stega: false, lang });
  return pageMetadata({ title: about.seo?.metaTitle || aboutContent.seo.metaTitle, description: about.seo?.metaDescription || aboutContent.seo.metaDescription, path: '/sobre-mi', lang });
}

export default async function AboutPage({ params }) {
  const { lang } = await params;
  const content = getContent(lang);
  const ui = t(lang);
  const [about, workstation] = await Promise.all([
    getPage('about', 'about', content.aboutContent, { lang }),
    getPage('workstation', 'workstation', { capabilities: content.capabilities }, { lang }),
  ]);
  const experience = content.experienceContent;
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

    <section className={`page-section ${styles.experience}`}>
      <p className="section-label">{experience.sectionLabel}</p>
      <h2>{experience.title}</h2>
      <ExperienceTimeline items={about.experience?.length ? about.experience : experience.items} others={experience.others}/>
    </section>

    <section className={`page-section capabilities-section ${styles.capabilities}`}>
      <p className="section-label">{ui.about.capabilitiesLabel}</p>
      <h2>{ui.about.capabilitiesTitle}</h2>
      <OpsConsole capabilities={capabilities} label={ui.about.opsAria}/>
      <div className="capabilities-grid">{capabilities.map((item) => <CapabilityCard item={item} key={item.node || item.title}/>)}</div>
    </section>
  </main>;
}
