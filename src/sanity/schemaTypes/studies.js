export default {
  name: 'studies', title: 'Estudios y certificaciones', type: 'document',
  fields: [
    { name: 'sectionLabel', title: 'Etiqueta de sección', type: 'string' },
    { name: 'title', title: 'Título', type: 'string' },
    { name: 'certifications', title: 'Certificaciones', type: 'array', of: [{ type: 'object', name: 'certification', fields: [
      { name: 'name', title: 'Nombre', type: 'string', validation: (rule) => rule.required() },
      { name: 'issuer', title: 'Emisor', type: 'string' },
      { name: 'year', title: 'Año o estado', type: 'string' },
      { name: 'orderRank', title: 'Orden manual', type: 'number' },
    ], preview: { select: { title: 'name', subtitle: 'issuer' } } }] },
    { name: 'seo', title: 'SEO de Estudios', type: 'object', fields: [
      { name: 'metaTitle', title: 'Título SEO', type: 'string' },
      { name: 'metaDescription', title: 'Descripción SEO', type: 'text', rows: 3 },
    ] },
  ],
};
