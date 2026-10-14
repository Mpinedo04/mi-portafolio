import { getContent } from '@/data/content';
import { t } from '@/i18n/ui';
import { getPage } from '@/sanity/lib/queries';
import ContactLinks from '@/components/ContactLinks';
import ContactForm from '@/components/ContactForm';
import { stegaClean } from 'next-sanity';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { contactContent } = getContent(lang);
  const contact = await getPage('contact', 'contact', contactContent, { stega: false, lang });
  return pageMetadata({ title: contact.seo?.metaTitle || contactContent.seo.metaTitle, description: contact.seo?.metaDescription || contactContent.seo.metaDescription, path: '/contacto', lang });
}

// El asunto del correo va en el idioma de la página.
const withSubject = (url, subject) => (url.startsWith('mailto:') ? `${url.split('?')[0]}?subject=${encodeURIComponent(subject)}` : url);

export default async function ContactPage({ params }) {
  const { lang } = await params;
  const ui = t(lang);
  const { contactContent } = getContent(lang);
  const contact = await getPage('contact', 'contact', contactContent, { lang });
  const email = contact.links?.find((item) => stegaClean(item.iconKey || '') === 'mail');
  const otherLinks = (contact.links || []).filter((item) => item !== email);
  const formId = stegaClean(contact.formspreeId || contactContent.formspreeId || process.env.NEXT_PUBLIC_FORMSPREE_ID || '');
  return <main className="page-main">
    <section id="contacto" className="page-section">
      <p className="section-label">{contact.sectionLabel}</p>
      <h2>{contact.title}</h2>
      <p className="subtitle">{contact.subtitle}</p>
      {formId && <ContactForm formId={formId} lang={lang}/>}
      {formId && email && <p className="contact-or">{ui.contact.orWrite}</p>}
      {email && <a className="btn-primary" href={withSubject(stegaClean(email.url || ''), ui.form.subject)}>{email.label}</a>}
      <ContactLinks links={otherLinks}/>
    </section>
  </main>;
}
