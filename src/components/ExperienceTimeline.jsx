import styles from './ExperienceTimeline.module.css';

// Línea de tiempo de experiencia: rol, empresa, periodo y detalle, de lo más reciente a lo más antiguo.
export default function ExperienceTimeline({ items = [], others = '' }) {
  return <div className={styles.wrap}>
    <ol className={styles.list}>
      {items.map((item) => <li className={styles.item} key={`${item.role}-${item.company}`}>
        <span className={styles.dot} aria-hidden="true"/>
        <div className={styles.head}>
          <h3 className={styles.role}>{item.role}</h3>
          <span className={styles.period}>{item.period}</span>
        </div>
        <p className={styles.company}>{item.company}</p>
        {item.detail && <p className={styles.detail}>{item.detail}</p>}
      </li>)}
    </ol>
    {others && <p className={styles.others}>{others}</p>}
  </div>;
}
