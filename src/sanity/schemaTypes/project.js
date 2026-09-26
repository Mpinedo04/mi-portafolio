const seoFields = [
  { name: 'metaTitle', title: 'Título SEO', type: 'string' },
  { name: 'metaDescription', title: 'Descripción SEO', type: 'text', rows: 3 },
];

export default {
  name: 'project', title: 'Proyectos', type: 'document',
  orderings: [{ title: 'Orden manual', name: 'orderRankAsc', by: [{ field: 'orderRank', direction: 'asc' }] }],
  fields: [
    { name: 'orderRank', title: 'Orden manual', type: 'number' },
    { name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (rule) => rule.required() },
    { name: 'subtitle', title: 'Subtítulo', type: 'string' },
    { name: 'category', title: 'Categoría', type: 'string', options: { list: [{ title: 'Laboratorio', value: 'laboratorio' }, { title: 'Web', value: 'web' }, { title: 'Aplicación', value: 'aplicación' }] }, validation: (rule) => rule.required() },
    { name: 'customLabel', title: 'Etiqueta visible', type: 'string' },
    { name: 'mainImage', title: 'Imagen principal', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Texto alternativo', type: 'string' }] },
    { name: 'externalLinks', title: 'Enlaces externos y descargas', type: 'array', of: [{ type: 'object', name: 'projectLink', fields: [
      { name: 'kind', title: 'Tipo', type: 'string', options: { list: ['demo', 'repository', 'download', 'external'] } },
      { name: 'label', title: 'Texto visible', type: 'string' },
      { name: 'url', title: 'URL o ruta', type: 'string' },
    ] }] },
    { name: 'description', title: 'Descripción', type: 'text', rows: 5 },
    { name: 'tags', title: 'Etiquetas', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } },
    { name: 'stats', title: 'Métricas de tarjeta', type: 'array', of: [{ type: 'object', name: 'projectStat', fields: [
      { name: 'value', title: 'Valor', type: 'string' }, { name: 'label', title: 'Etiqueta', type: 'string' },
    ] }] },
    { name: 'year', title: 'Año', type: 'number' },
    { name: 'featured', title: 'Destacado', type: 'boolean', initialValue: false },
    { name: 'seo', title: 'SEO del proyecto', type: 'object', fields: seoFields },
  ],
};
