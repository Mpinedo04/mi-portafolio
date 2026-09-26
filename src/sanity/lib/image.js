import { createImageUrlBuilder } from '@sanity/image-url';
import { client } from './client';

const builder = client ? createImageUrlBuilder(client) : null;

export function urlForImage(image, width = 1200) {
  if (typeof image === 'string') return image;
  if (!image?.asset?._ref || !builder) return '';
  return builder.image(image).width(width).auto('format').url();
}
