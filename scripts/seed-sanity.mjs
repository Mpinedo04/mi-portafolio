import { createReadStream, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from 'next-sanity';
import {
  aboutContent,
  capabilities,
  contactContent,
  homeContent,
  projects,
  siteSettings,
  studiesContent,
} from '../src/data/portfolio.js';
import { reports } from '../src/data/reports.js';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('Configura NEXT_PUBLIC_SANITY_PROJECT_ID y SANITY_API_WRITE_TOKEN en .env.local antes de sembrar Sanity.');
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: '2026-09-26', token, useCdn: false });

// `npm run seed:informes` solo reemplaza las guías e informes, sin tocar el resto del contenido editado en Sanity.
const onlyReports = process.argv.includes('--informes');

async function uploadLocalImage(publicPath) {
  if (!publicPath?.startsWith('/assets/')) return undefined;
  const filePath = resolve(process.cwd(), 'public', publicPath.slice(1));
  if (!existsSync(filePath)) throw new Error(`No existe el asset local: ${filePath}`);
  const filename = filePath.split(/[\\/]/).at(-1);
  const existingAssetId = await client.fetch('*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id', { filename });
  if (existingAssetId) return { _type: 'image', asset: { _type: 'reference', _ref: existingAssetId } };
  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename,
  });
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
}

const withKeys = (items, type, prefix) => (items || []).map((item, index) => ({ _key: `${prefix}${index + 1}`, _type: type, ...item }));

const singletons = [
  { _id: 'settings', _type: 'settings', ...siteSettings, navigation: withKeys(siteSettings.navigation, 'navigationLink', 'nav') },
  { _id: 'home', _type: 'home', ...homeContent, terminalLines: withKeys(homeContent.terminalLines, 'terminalLine', 'line') },
  { _id: 'about', _type: 'about', ...aboutContent, bio: aboutContent.bio.join('\n\n'), skills: withKeys(aboutContent.skills, 'skill', 'skill') },
  { _id: 'workstation', _type: 'workstation', capabilities: withKeys(capabilities, 'capability', 'cap') },
  { _id: 'studies', _type: 'studies', ...studiesContent, certifications: withKeys(studiesContent.certifications, 'certification', 'cert') },
  { _id: 'contact', _type: 'contact', ...contactContent, links: withKeys(contactContent.links, 'contactLink', 'contact') },
];

singletons[1].primaryCta = { _type: 'object', ...homeContent.primaryCta };
singletons[1].secondaryCta = { _type: 'object', ...homeContent.secondaryCta };

if (!onlyReports) {
  for (const document of singletons) await client.createOrReplace(document);
  console.log(`Actualizados ${singletons.length} documentos singleton.`);
}

const projectDocuments = [];
for (const project of onlyReports ? [] : projects) {
  const mainImage = await uploadLocalImage(project.mainImage);
  projectDocuments.push({
    _id: project._id,
    _type: 'project',
    orderRank: project.orderRank,
    title: project.title,
    slug: { _type: 'slug', current: project.slug },
    subtitle: project.subtitle,
    category: project.category,
    customLabel: project.customLabel,
    ...(mainImage ? { mainImage: { ...mainImage, alt: project.mainImageAlt } } : {}),
    externalLinks: withKeys(project.externalLinks, 'projectLink', 'link'),
    description: project.description,
    tags: project.tags,
    stats: withKeys(project.stats, 'projectStat', 'stat'),
    year: project.year,
    featured: project.featured,
    seo: project.seo,
  });
}
if (!onlyReports) {
  await Promise.all(projectDocuments.map((document) => client.createOrReplace(document)));
  console.log(`Actualizados ${projectDocuments.length} proyectos y sus imágenes principales.`);
}

const projectIdsBySlug = Object.fromEntries(projects.map((project) => [project.slug, project._id]));
const reportDocuments = reports.map((report) => ({
  _id: `report-${report.slug}`,
  _type: 'report',
  title: report.title,
  slug: { _type: 'slug', current: report.slug },
  project: { _type: 'reference', _ref: projectIdsBySlug[report.projectSlug] },
  seo: report.seo,
  body: report.body,
}));
await Promise.all(reportDocuments.map((document) => client.createOrReplace(document)));
console.log(`Actualizados ${reportDocuments.length} guías e informes Portable Text.`);
console.log('Carga inicial terminada. Los documentos usan IDs fijos para que puedas repetir la carga tras editar la copia local.');
