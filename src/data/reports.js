import guide from './reports/guia-lab-soc-wazuh.json' with { type: 'json' };
import ssh from './reports/incidente-ssh-soc-2026-001.json' with { type: 'json' };
import powershell from './reports/incidente-powershell-soc-2026-002.json' with { type: 'json' };
import fim from './reports/incidente-fim-soc-2026-003.json' with { type: 'json' };
import { projects } from './portfolio.js';

const project = { title: 'Laboratorio SOC con Wazuh', slug: 'laboratorio-soc-wazuh' };

export const reports = [
  { _id: 'report-guide', ...guide, project, projectSlug: project.slug },
  { _id: 'report-ssh', ...ssh, project, projectSlug: project.slug },
  { _id: 'report-powershell', ...powershell, project, projectSlug: project.slug },
  { _id: 'report-fim', ...fim, project, projectSlug: project.slug },
];

export const projectsWithReports = projects.map((item) => ({
  ...item,
  reports: reports.filter((report) => report.projectSlug === item.slug).map(({ _id, title, slug, seo }) => ({ _id, title, slug, seo })),
}));
