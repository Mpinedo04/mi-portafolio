import { projectsWithReports } from '@/data/reports';
import { localePath, locales } from '@/i18n/config';
import { siteUrl } from '@/lib/seo';

// /sitemap.xml: cada página en los tres idiomas, con sus alternativas.
const PAGES = ['/', '/sobre-mi', '/proyectos', '/estudios', '/contacto'];

export default function sitemap() {
  const paths = [
    ...PAGES,
    ...projectsWithReports.flatMap((project) => [
      `/proyectos/${project.slug}`,
      ...(project.reports?.length > 1 ? [`/proyectos/${project.slug}/informe`] : []),
      ...(project.reports || []).map((report) => `/proyectos/${project.slug}/informe/${report.slug}`),
    ]),
  ];
  return paths.flatMap((path) => locales.map((lang) => ({
    url: `${siteUrl}${localePath(lang, path)}`,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : PAGES.includes(path) ? 0.8 : 0.6,
    alternates: { languages: Object.fromEntries(locales.map((code) => [code, `${siteUrl}${localePath(code, path)}`])) },
  })));
}
