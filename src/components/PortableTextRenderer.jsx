import Image from 'next/image';
import { PortableText, stegaClean } from 'next-sanity';
import { urlForImage } from '@/sanity/lib/image';
import styles from './PortableTextRenderer.module.css';

const components = {
  types: {
    codeBlock: ({ value }) => <figure className={styles.codeFigure}><figcaption>{value.caption || value.language || 'terminal'}</figcaption><pre><code>{value.code}</code></pre></figure>,
    reportImage: ({ value }) => {
      const src = value.image?.asset?._ref ? urlForImage(value.image, 1400) : (value.image?.asset?.url || value.url);
      if (!src) return null;
      return <figure className={styles.figure}><a href={src} target="_blank" rel="noreferrer"><Image src={src} alt={value.alt || value.caption || 'Evidencia del informe'} width={1400} height={900} unoptimized/></a>{value.caption && <figcaption>{value.caption}</figcaption>}</figure>;
    },
    reportTable: ({ value }) => <div className={styles.tableWrap}><table><tbody>{value.rows?.map((row, rowIndex) => {
      const cells = Array.isArray(row) ? row : (row.cells || []);
      return <tr key={row._key || rowIndex}>{cells.map((cell, cellIndex) => rowIndex === 0 ? <th key={cell._key || cellIndex}>{typeof cell === 'string' ? cell : cell.text}</th> : <td key={cell._key || cellIndex}>{typeof cell === 'string' ? cell : cell.text}</td>)}</tr>;
    })}</tbody></table></div>,
    downloadLink: ({ value }) => <p className={styles.download}><a href={stegaClean(value.url || '')} download>{String(value.label || 'Descargar archivo').replace(/\s*↓\s*$/, '')} ↓</a></p>,
  },
  block: {
    h1: ({ children }) => <h1>{children}</h1>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: { code: ({ children }) => <code>{children}</code>, link: ({ children, value }) => {
    const href = stegaClean(value?.href || '');
    return <a href={href} target={href.startsWith('/') ? undefined : '_blank'} rel={href.startsWith('/') ? undefined : 'noreferrer'}>{children}</a>;
  } },
};

export default function PortableTextRenderer({ value }) {
  return <div className={styles.content}><PortableText value={value || []} components={components}/></div>;
}
