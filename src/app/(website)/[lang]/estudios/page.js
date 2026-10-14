import { getContent } from '@/data/content';
import { getPage } from '@/sanity/lib/queries';
import CertItem from '@/components/CertItem';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { studiesContent } = getContent(lang);
  const studies = await getPage('studies', 'studies', studiesContent, { stega: false, lang });
  return pageMetadata({ title: studies.seo?.metaTitle || studiesContent.seo.metaTitle, description: studies.seo?.metaDescription || studiesContent.seo.metaDescription, path: '/estudios', lang });
}

export default async function StudiesPage({ params }) {
  const { lang } = await params;
  const studies = await getPage('studies', 'studies', getContent(lang).studiesContent, { lang });
  const certifications = [...(studies.certifications || [])].sort((a, b) => (a.orderRank || 0) - (b.orderRank || 0));
  return <main className="page-main">
    <section id="estudios" className="page-section">
      <p className="section-label">{studies.sectionLabel}</p>
      <h2>{studies.title}</h2>
      <div className="certs-list">{certifications.map((item) => <CertItem item={item} key={item._key || item.name}/>)}</div>
    </section>
  </main>;
}
