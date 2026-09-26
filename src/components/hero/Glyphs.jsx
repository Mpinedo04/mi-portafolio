import styles from './Glyphs.module.css';

/*
 * Divide un texto en palabras y letras para que el motor físico pueda moverlas.
 * Es solo visual (aria-hidden): el texto accesible lo pone el componente padre.
 */
export default function Glyphs({ text = '' }) {
  const tokens = String(text).split(/(\s+)/).filter(Boolean);
  return tokens.map((token, wordIndex) => {
    if (/^\s+$/.test(token)) return ' ';
    return <span className={styles.word} data-word={token} key={`${wordIndex}-${token}`}>
      {[...token].map((char, charIndex) => <span className={styles.glyph} data-glyph key={`${charIndex}-${char}`}>{char}</span>)}
    </span>;
  });
}
