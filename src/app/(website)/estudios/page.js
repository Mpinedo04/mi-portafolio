import { studiesContent } from '@/data/portfolio';
import { getPage } from '@/sanity/lib/queries';
import CertItem from '@/components/CertItem';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  const studies = await getPage('studies', 'studies', studiesContent, { stega: false });
  return pageMetadata({ title: studies.seo?.metaTitle || studiesContent.seo.metaTitle, description: studies.seo?.metaDescription || studiesContent.seo.metaDescription, path: '/estudios' });
}

export default async function StudiesPage() {
  const studies = await getPage('studies', 'studies', studiesContent);
  const certifications = [...(studies.certifications || [])].sort((a, b) => (a.orderRank || 0) - (b.orderRank || 0));
  return <main className="page-main">
    <section id="estudios" className="page-section">
      <p className="section-label">{studies.sectionLabel}</p>
      <h2>{studies.title}</h2>
      <div className="certs-list">{certifications.map((item) => <CertItem item={item} key={item._key || item.name}/>)}</div>
    </section>
  </main>;
}
