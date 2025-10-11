import { client } from '@/lib/sanity.client';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity.image';
import PrevNextNav from '@/components/PrevNextNav';
import ClozeBlock from '@/components/ClozeBlock';
import ClozePasteBlock from '@/components/ClozePasteBlock';

export const revalidate = 300;

type RouteParams = { year: string; topic: string; page: string };

/* ---- Local prop helpers (keep value non-optional) ---- */
type PTProps<T> = { value: T };

type SanityImage = {
  alt?: string;
  asset?: { metadata?: { lqip?: string } };
  caption?: string;
};

type FigureValue = {
  image?: SanityImage;
  caption?: string;
};

type ClozeBlockValue = {
  _type: 'clozeBlock';
  text: string;
  blanks?: string[];
};

type ClozePasteBlockValue = {
  _type: 'clozePasteBlock';
  text: string;
};

/* --------------------------------------
   Portable Text renderers (images + cloze)
-------------------------------------- */
const components = {
  types: {
    image: ({
      value,
    }: {
      value: { alt?: string; asset?: { metadata?: { lqip?: string } }; caption?: string };
    }) => {
      const src = urlFor(value).width(1200).fit('max').url();
      if (!src) return null;
      return (
        <figure className="my-6">
          <Image
            src={src}
            alt={value.alt || ''}
            width={1200}
            height={675}
            sizes="(min-width: 768px) 700px, 100vw"
            style={{ width: '100%', height: 'auto' }}
            placeholder={value.asset?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={value.asset?.metadata?.lqip}
          />
          {value.caption && (
            <figcaption className="mt-2 text-sm text-neutral-500">{value.caption}</figcaption>
          )}
        </figure>
      );
    },

    figure: ({
      value,
    }: {
      value: {
        image?: { alt?: string; asset?: { metadata?: { lqip?: string } } };
        caption?: string;
      };
    }) => {
      const img = value.image;
      if (!img) return null;
      const src = urlFor(img).width(1200).fit('max').url();
      if (!src) return null;
      return (
        <figure className="my-6">
          <Image
            src={src}
            alt={img.alt || ''}
            width={1200}
            height={675}
            sizes="(min-width: 768px) 700px, 100vw"
            style={{ width: '100%', height: 'auto' }}
            placeholder={img.asset?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={img.asset?.metadata?.lqip}
          />
          {value.caption && (
            <figcaption className="mt-2 text-sm text-neutral-500">{value.caption}</figcaption>
          )}
        </figure>
      );
    },

    clozeBlock: ({ value }: { value: unknown }) => (
      <ClozeBlock {...(value as React.ComponentProps<typeof ClozeBlock>)} />
    ),

    clozePasteBlock: ({ value }: { value: unknown }) => (
      <ClozePasteBlock {...(value as React.ComponentProps<typeof ClozePasteBlock>)} />
    ),
  },
};

/* --------------------------------------
   Page component
-------------------------------------- */
export default async function ContentPage({ params }: { params: Promise<RouteParams> }) {
  const { year, topic, page } = await params;

  const data = await client.fetch(
    `*[_type=="contentPage" && slug.current==$page][0]{
      title,
      content[]{
        ...,
        _type == "image" => {
          ...,
          asset->{ _id, metadata{ lqip } }
        },
        _type == "figure" => {
          ...,
          image{
            ...,
            asset->{ _id, metadata{ lqip } }
          }
        },
        _type == "clozeBlock" => { _type, text, blanks },
        _type == "clozePasteBlock" => { _type, text }
      }
    }`,
    { page }
  );

  if (!data) {
    return <div className="mx-auto max-w-3xl p-6 text-neutral-700">Not found</div>;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>

      <article className="prose prose-neutral max-w-none">
        <PortableText value={data.content} components={components} />
      </article>

      <PrevNextNav year={year} topicSlug={topic} pageSlug={page} />
    </main>
  );
}
