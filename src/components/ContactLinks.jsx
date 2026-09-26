import styles from './ContactLinks.module.css';
import { stegaClean } from 'next-sanity';

function ContactIcon({ kind }) {
  if (kind === 'mail') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3zM3 6l9 7 9-7"/></svg>;
  if (kind === 'github') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7M21 3l-10 10"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>;
}

export default function ContactLinks({ links }) {
  return <div className={`contact-links ${styles.links}`}>
    {links.filter((item) => item.url && stegaClean(item.url) !== '#').map((item) => {
      const url = stegaClean(item.url);
      return <a className="contact-link" href={url} key={url} target={url.startsWith('mailto:') ? undefined : '_blank'} rel={url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}><ContactIcon kind={stegaClean(item.iconKey || '')}/>{item.label}</a>;
    })}
  </div>;
}
