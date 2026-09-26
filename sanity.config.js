import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { schemaTypes, singletonTypes } from './src/sanity/schemaTypes';
import { portfolioStructure } from './src/sanity/lib/structure';
import { resolve } from './src/sanity/presentation/resolve';

const lockedSingletonActions = new Set(['publish', 'discardChanges', 'restore', 'create']);

export default defineConfig({
  name: 'default',
  title: 'Miguel Pinedo · Portfolio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '00000000',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/admin',
  plugins: [
    structureTool({ structure: portfolioStructure }),
    presentationTool({
      resolve,
      previewUrl: {
        initial: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        previewMode: { enable: '/api/draft' },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.includes(schemaType)),
  },
  document: {
    actions: (input, context) => singletonTypes.includes(context.schemaType)
      ? input.filter(({ action }) => action && lockedSingletonActions.has(action))
      : input,
  },
});
