import { defineLive } from 'next-sanity/live';
import { client, readToken, sanityReady } from './client';

const live = defineLive({
  client,
  serverToken: sanityReady ? (readToken || false) : false,
  browserToken: sanityReady ? (readToken || false) : false,
});

export const sanityFetch = live.sanityFetch;
export const SanityLive = live.SanityLive;
