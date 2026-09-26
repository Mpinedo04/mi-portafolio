import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextCoreWebVitals,
  {
    ignores: ['.next/**', 'node_modules/**', 'content/**', 'src/data/reports/**', 'public/**', '*.html', 'script.js', 'scripts/**'],
  },
];

export default config;
