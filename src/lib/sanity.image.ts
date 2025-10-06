import imageUrlBuilder from '@sanity/image-url';
import { client } from './sanity.client';

/**
 * Local replacement for SanityImageSource (since new versions of @sanity/image-url
 * no longer export it directly)
 */
export type SanityImageSource = {
  _type?: string;
  asset?: {
    _ref?: string;
    _type?: string;
    metadata?: {
      lqip?: string;
    };
  };
};

/** Build Sanity image URLs safely */
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
