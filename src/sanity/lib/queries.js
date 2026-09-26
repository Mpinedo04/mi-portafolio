import { sanityFetch as liveFetch } from './live';
import { sanityReady } from './client';

export async function sanityFetch(query, params = {}, fallback = null, options = {}) {
  if (!sanityReady) return fallback;
  try {
    const { data } = await liveFetch({ query, params, ...options });
    return data ?? fallback;
  } catch (error) {
    console.error('No se pudo consultar Sanity; se muestra el contenido local de respaldo.', error.message);
    return fallback;
  }
}

export function getPage(type, id, fallback, options = {}) {
  return sanityFetch(`*[_type == $type && _id == $id][0]`, { type, id }, fallback, options);
}

export function getProjects(fallback, options = {}) {
  return sanityFetch(`*[_type == "project"] | order(orderRank asc) {
    _id, orderRank, title, subtitle, "slug": slug.current, category, customLabel,
    "mainImage": mainImage.asset->url, "mainImageAlt": mainImage.alt,
    description, tags, stats, year, featured, externalLinks, seo,
    "reports": *[_type == "report" && references(^._id)] | order(title asc) { _id, title, "slug": slug.current, seo }
  }`, {}, fallback, options);
}

export async function getProject(slug, fallback = null, options = {}) {
  return sanityFetch(`*[_type == "project" && slug.current == $slug][0] {
    _id, orderRank, title, subtitle, category, customLabel, "slug": slug.current,
    "mainImage": mainImage.asset->url, "mainImageAlt": mainImage.alt,
    description, tags, stats, year, featured, externalLinks, seo,
    "reports": *[_type == "report" && references(^._id)] | order(title asc) { _id, title, "slug": slug.current, seo }
  }`, { slug }, fallback, options);
}

export async function getReport(projectSlug, reportSlug, fallback = null, options = {}) {
  return sanityFetch(`*[_type == "report" && project->slug.current == $projectSlug && slug.current == $reportSlug][0] {
    _id, title, "slug": slug.current, seo, body,
    "project": project->{ title, "slug": slug.current }
  }`, { projectSlug, reportSlug }, fallback, options);
}
