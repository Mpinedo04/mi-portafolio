export default {
  name: 'codeBlock',
  title: 'Código o log',
  type: 'object',
  fields: [
    { name: 'language', title: 'Lenguaje', type: 'string', initialValue: 'text' },
    { name: 'caption', title: 'Descripción', type: 'string' },
    { name: 'code', title: 'Código / log', type: 'text', rows: 12, validation: (rule) => rule.required() },
  ],
  preview: { select: { title: 'caption', subtitle: 'language' }, prepare: ({ title, subtitle }) => ({ title: title || 'Código o log', subtitle }) },
};
