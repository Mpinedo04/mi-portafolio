import styles from './OpsConsole.module.css';
import { stegaClean } from 'next-sanity';

export default function OpsConsole({ capabilities }) {
  const labels = {
    identity_control: 'WINDOWS_SERVER',
    linux_defense: 'LINUX_HARDENING',
    system_audit: 'SYSTEM_AUDIT',
    network_analysis: 'NETWORK_DEFENSE',
    database_security: 'SQL_SECURITY',
  };
  const stream = capabilities.map((item) => labels[stegaClean(item.sector || '')] || stegaClean(item.title || '').replaceAll(' ', '_').toUpperCase()).join(' // ');
  return <div className={`ops-console ${styles.console}`} aria-label={`${capabilities.length} capacidades operativas activas`}>
    <div className="ops-console-status"><span className="ops-pulse"/><span>live capability matrix</span></div>
    <div className="ops-console-stream"><div className="ops-console-track"><span>{`${stream} //`}</span><span>{`${stream} //`}</span></div></div>
    <span className="ops-console-count">{String(capabilities.length).padStart(2, '0')} nodes online</span>
  </div>;
}
