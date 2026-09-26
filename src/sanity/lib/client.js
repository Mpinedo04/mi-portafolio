import { createClient } from 'next-sanity';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '00000000';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const sanityReady = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
export const sanityLiveReady = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.SANITY_API_READ_TOKEN);
export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-09-26',
  useCdn: false,
  perspective: 'published',
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3000/admin',
  },
});

export const readToken = process.env.SANITY_API_READ_TOKEN;
