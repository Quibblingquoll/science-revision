import type { PortableTextComponentProps } from '@portabletext/react';
import type { PortableTextBlock } from 'sanity';
import CrosswordIpuzBlock from '@/components/CrosswordIpuzBlock';
import Image from 'next/image';

/**
 * Strongly-typed component map for Portable Text
 * (now a function that takes pageSlug)
 */
export const portableComponents = (pageSlug: string) => ({
  types: {
    // ✅ Crossword (IPUZ) block
    crosswordIpuz: ({
      value,
    }: PortableTextComponentProps<{
      _type: 'crosswordIpuz';
      title?: string;
      slug?: { current: string };
      ipuz: string;
    }>) => <CrosswordIpuzBlock value={value} pageSlug={pageSlug} />,

    // ✅ Example image block
    image: ({
      value,
    }: PortableTextComponentProps<{
      asset?: { url?: string };
      alt?: string;
      caption?: string;
    }>) => (
      <figure className="my-6">
        <Image
          src={value?.asset?.url ?? ''}
          alt={value?.alt ?? ''}
          width={1200}
          height={800}
          style={{ width: '100%', height: 'auto' }}
        />
        {value?.caption && (
          <figcaption className="text-center text-sm text-gray-500">{value.caption}</figcaption>
        )}
      </figure>
    ),
  },
});
