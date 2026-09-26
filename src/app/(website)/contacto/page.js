import { contactContent } from '@/data/portfolio';
import { getPage } from '@/sanity/lib/queries';
import ContactLinks from '@/components/ContactLinks';
import { stegaClean } from 'next-sanity';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  const contact = await getPage('contact', 'contact', contactContent, { stega: false });
  return pageMetadata({ title: contact.seo?.metaTitle || contactContent.seo.metaTitle, description: contact.seo?.metaDescription || contactContent.seo.metaDescription, path: '/contacto' });
}

export default async function ContactPage() {
  const contact = await getPage('contact', 'contact', contactContent);
  const email = contact.links?.find((item) => stegaClean(item.iconKey || '') === 'mail');
  const otherLinks = (contact.links || []).filter((item) => item !== email);
  return <main className="page-main">
    <section id="contacto" className="page-section">
      <p className="section-label">{contact.sectionLabel}</p>
      <h2>{contact.title}</h2>
      <p className="subtitle">{contact.subtitle}</p>
      {email && <a className="btn-primary" href={stegaClean(email.url || '')} target={stegaClean(email.url || '').startsWith('mailto:') ? undefined : '_blank'} rel={stegaClean(email.url || '').startsWith('mailto:') ? undefined : 'noopener noreferrer'}>{email.label}</a>}
      <ContactLinks links={otherLinks}/>
    </section>
  </main>;
}
