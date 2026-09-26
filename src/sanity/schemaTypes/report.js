const seoFields = [
  { name: 'metaTitle', title: 'Título SEO', type: 'string' },
  { name: 'metaDescription', title: 'Descripción SEO', type: 'text', rows: 3 },
];

const reportBody = {
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Título 1', value: 'h1' },
        { title: 'Título 2', value: 'h2' },
        { title: 'Título 3', value: 'h3' },
        { title: 'Cita', value: 'blockquote' },
      ],
      lists: [{ title: 'Viñetas', value: 'bullet' }, { title: 'Numerada', value: 'number' }],
      marks: {
        decorators: [
          { title: 'Código', value: 'code' },
          { title: 'Negrita', value: 'strong' },
          { title: 'Cursiva', value: 'em' },
        ],
        annotations: [{ name: 'link', type: 'object', title: 'Enlace', fields: [{ name: 'href', title: 'URL o ruta', type: 'string' }] }],
      },
    },
    { type: 'codeBlock' },
    { type: 'reportImage' },
    { type: 'reportTable' },
    { type: 'downloadLink' },
  ],
};

export default {
  name: 'report',
  title: 'Guías e informes',
  type: 'document',
  orderings: [{ title: 'Título', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] }],
  fields: [
    { name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (rule) => rule.required() },
    { name: 'project', title: 'Proyecto asociado', type: 'reference', to: [{ type: 'project' }], validation: (rule) => rule.required() },
    { name: 'seo', title: 'SEO del informe', type: 'object', fields: seoFields },
    { name: 'body', title: 'Contenido del informe', ...reportBody },
  ],
  preview: { select: { title: 'title', subtitle: 'project->title' } },
};
