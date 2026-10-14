import * as es from '../portfolio.js';
import en from './en.js';
import ca from './ca.js';
import { withReports } from '../reports.js';

/*
 * Contenido de la web en cada idioma. El español (src/data/portfolio.js) es la base completa;
 * en.js y ca.js solo traen los textos traducidos y se combinan encima:
 * - los objetos se combinan campo a campo;
 * - las listas de la misma longitud, elemento a elemento (así se conservan orden, enlaces, imágenes…);
 * - los proyectos se emparejan por slug.
 */
const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

function merge(base, over) {
  if (over === undefined) return base;
  if (Array.isArray(base) && Array.isArray(over)) {
    return base.length === over.length ? base.map((item, index) => merge(item, over[index])) : over;
  }
  if (isObject(base) && isObject(over)) {
    const out = { ...base };
    Object.keys(over).forEach((key) => { out[key] = merge(base[key], over[key]); });
    return out;
  }
  return over;
}

function build(translation) {
  const projects = translation
    ? es.projects.map((project) => merge(project, translation.projects?.[project.slug]))
    : es.projects;
  return {
    siteSettings: merge(es.siteSettings, translation?.siteSettings),
    homeContent: merge(es.homeContent, translation?.homeContent),
    aboutContent: merge(es.aboutContent, translation?.aboutContent),
    experienceContent: merge(es.experienceContent, translation?.experienceContent),
    capabilities: merge(es.capabilities, translation?.capabilities),
    studiesContent: merge(es.studiesContent, translation?.studiesContent),
    contactContent: merge(es.contactContent, translation?.contactContent),
    projects,
    projectsWithReports: withReports(projects),
  };
}

const content = { es: build(null), en: build(en), ca: build(ca) };

export function getContent(lang) {
  return content[lang] || content.es;
}
