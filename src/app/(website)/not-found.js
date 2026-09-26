import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return <main className={styles.wrap}>
    <section className={styles.section}>
      <p className="section-label">{'// ERROR 404 · RUTA NO ENCONTRADA'}</p>
      <h1 className={styles.code}>4<span>0</span>4</h1>
      <p className={styles.description}>El nodo o endpoint solicitado no existe, ha sido segmentado o no se encuentra en el mapa de red activo.</p>
      <div className="terminal" style={{ margin: '0 auto 2.5rem' }}>
        <div className="terminal-bar"><span className="dot dot-r"/><span className="dot dot-y"/><span className="dot dot-g"/><span className="terminal-title">route_error.log - bash</span></div>
        <div className="terminal-body" style={{ minHeight: 110, textAlign: 'left' }}>
          <span className="t-line"><span className="t-prompt">&gt; </span><span className="t-cmd">traceroute target_node</span></span>
          <span className="t-line"><span className="t-warn">[!] Destination unreachable: 404_NOT_FOUND</span></span>
          <span className="t-line"><span className="t-prompt">&gt; </span><span className="t-out">initiating secure fallback protocol...</span></span>
        </div>
      </div>
      <Link className="btn-primary" href="/">Volver al inicio seguro →</Link>
    </section>
  </main>;
}
