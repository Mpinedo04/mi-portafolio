import { projects } from '@/data/portfolio';

// Rutas públicas (sin idioma) para sugerir la más parecida cuando alguien escribe mal una dirección.
const ROUTES = ['/', '/sobre-mi', '/proyectos', '/estudios', '/contacto', ...projects.map((project) => `/proyectos/${project.slug}`)];

// Nombres en inglés o catalán de las secciones (los slugs de la web están en español).
const ALIASES = {
  about: '/sobre-mi', 'about-me': '/sobre-mi', aboutme: '/sobre-mi', 'sobre-mi': '/sobre-mi', perfil: '/sobre-mi', profile: '/sobre-mi',
  projects: '/proyectos', projectes: '/proyectos', work: '/proyectos', portfolio: '/proyectos',
  education: '/estudios', studies: '/estudios', estudis: '/estudios', formacio: '/estudios', formacion: '/estudios',
  contact: '/contacto', contacte: '/contacto', email: '/contacto', mail: '/contacto',
};

const distance = (a, b) => {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i += 1) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const current = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[b.length];
};

const normalize = (value) => decodeURIComponent(value).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\/+$/, '') || '/';

export function closestRoute(path) {
  const target = normalize(path);
  const tailTarget = target.split('/').pop();
  if (ALIASES[tailTarget]) return ALIASES[tailTarget];
  let best = null;
  ROUTES.forEach((route) => {
    // Se compara la ruta entera y también solo el último tramo (/proyecto/wazuh → /proyectos/laboratorio-soc-wazuh).
    const whole = distance(target, route) / Math.max(target.length, route.length);
    const last = route.split('/').pop();
    const tail = last ? distance(tailTarget, last) / Math.max(tailTarget.length, last.length) : 1;
    const containsSlug = last && tailTarget.length > 3 && (last.includes(tailTarget) || tailTarget.includes(last)) ? 0.2 : 1;
    const score = Math.min(whole, tail, containsSlug);
    if (!best || score < best.score) best = { route, score };
  });
  return best && best.score <= 0.5 && best.route !== target ? best.route : null;
}
