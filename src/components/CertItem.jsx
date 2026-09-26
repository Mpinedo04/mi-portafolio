import styles from './CertItem.module.css';

export default function CertItem({ item }) {
  return <div className={`cert-item ${styles.item}`}>
    <div className="cert-left"><span className="cert-dot"/><div><div className="cert-name">{item.name}</div><div className="cert-issuer">{item.issuer}</div></div></div>
    <div className="cert-year">{item.year}</div>
  </div>;
}
