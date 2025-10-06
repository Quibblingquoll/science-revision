// src/lib/sanity.image.ts
import imageUrlBuilder from '@sanity/image-url';
import { client } from './sanity.client';

/**
 * Minimal local definition matching Sanity image objects.
 */
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
  [key: string]: unknown;
}

const builder = imageUrlBuilder(client);

/**
 * Type-safe helper to build Sanity image URLs.
 */
export function urlFor(source: SanityImageSource) {
  // The builder API accepts anything shaped like a Sanity image object,
  // so we can safely widen the type using a generic constraint.
  return builder.image(source as Record<string, unknown>);
}

/** Optional guard for runtime use */
export function hasImageAsset(
  src: SanityImageSource | null | undefined
): src is SanityImageSource & { asset: { _ref?: string; _id?: string } } {
  return !!src?.asset && (!!src.asset._ref || !!src.asset._id);
}
