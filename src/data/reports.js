import guide from './reports/guia-lab-soc-wazuh.json' with { type: 'json' };
import ssh from './reports/incidente-ssh-soc-2026-001.json' with { type: 'json' };
import powershell from './reports/incidente-powershell-soc-2026-002.json' with { type: 'json' };
import fim from './reports/incidente-fim-soc-2026-003.json' with { type: 'json' };
import stageplot from './reports/caso-stageplot-studio.json' with { type: 'json' };
import { stegaClean } from 'next-sanity';
import { projects } from './portfolio.js';

// Proyectos con documentación técnica (solo en español).
const socLab = { title: 'Laboratorio SOC con Wazuh', slug: 'laboratorio-soc-wazuh' };
const stagePlot = { title: 'StagePlot Studio', slug: 'stageplot-studio' };

export const reports = [
  { _id: 'report-guide', ...guide, project: socLab, projectSlug: socLab.slug },
  { _id: 'report-ssh', ...ssh, project: socLab, projectSlug: socLab.slug },
  { _id: 'report-powershell', ...powershell, project: socLab, projectSlug: socLab.slug },
  { _id: 'report-fim', ...fim, project: socLab, projectSlug: socLab.slug },
  { _id: 'report-stageplot', ...stageplot, project: stagePlot, projectSlug: stagePlot.slug },
];

// Añade a cada proyecto el resumen de sus informes (título, slug y SEO).
export const withReports = (items) => items.map((item) => ({
  ...item,
  reports: reports.filter((report) => report.projectSlug === item.slug).map(({ _id, title, slug, seo }) => ({ _id, title, slug, seo })),
}));

export const projectsWithReports = withReports(projects);

// Enlace a la documentación de un proyecto: directo al informe si solo hay uno; si hay varios, al índice.
export function caseStudyPath(project) {
  const slug = stegaClean(project?.slug || '');
  const items = project?.reports || [];
  if (!slug || !items.length) return null;
  return items.length === 1 ? `/proyectos/${slug}/informe/${stegaClean(items[0].slug || '')}` : `/proyectos/${slug}/informe`;
}
