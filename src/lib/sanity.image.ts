// src/lib/sanity.image.ts
import imageUrlBuilder from '@sanity/image-url';
import { client } from './sanity.client';

export interface SanityImageSource {
  _type?: string;
  asset?: {
    _ref?: string;
    _id?: string;
    _type?: string;
    metadata?: { lqip?: string };
  };
  crop?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  hotspot?: {
    x?: number;
    y?: number;
    height?: number;
    width?: number;
  };
  // ⛔️ removed the index signature to avoid assignability errors
}

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  // keep this cast to avoid `any` while satisfying the builder API
  return builder.image(source as Record<string, unknown>);
}

export function hasImageAsset(
  src: SanityImageSource | null | undefined
): src is SanityImageSource & { asset: { _ref?: string; _id?: string } } {
  return !!src?.asset && (!!src.asset._ref || !!src.asset._id);
}
