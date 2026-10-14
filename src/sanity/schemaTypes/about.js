export default {
  name: 'about', title: 'Sobre mí', type: 'document',
  fields: [
    { name: 'sectionLabel', title: 'Etiqueta de sección', type: 'string' },
    { name: 'sectionTitle', title: 'Título de perfil', type: 'string' },
    { name: 'bio', title: 'Biografía', type: 'text', rows: 8 },
    { name: 'skills', title: 'Habilidades destacadas', type: 'array', of: [{ type: 'object', name: 'skill', fields: [
      { name: 'name', title: 'Habilidad', type: 'string' },
      { name: 'detail', title: 'Herramientas / detalle', type: 'string' },
    ] }] },
    { name: 'experience', title: 'Experiencia', type: 'array', of: [{ type: 'object', name: 'experienceItem', fields: [
      { name: 'role', title: 'Puesto', type: 'string' },
      { name: 'company', title: 'Empresa', type: 'string' },
      { name: 'period', title: 'Periodo', description: 'Por ejemplo «01/2026 – 06/2026 (fines de semana)».', type: 'string' },
      { name: 'detail', title: 'Detalle', type: 'text', rows: 2 },
    ], preview: { select: { title: 'role', subtitle: 'company' } } }] },
    { name: 'seo', title: 'SEO de Sobre mí', type: 'object', fields: [
      { name: 'metaTitle', title: 'Título SEO', type: 'string' },
      { name: 'metaDescription', title: 'Descripción SEO', type: 'text', rows: 3 },
    ] },
  ],
};
