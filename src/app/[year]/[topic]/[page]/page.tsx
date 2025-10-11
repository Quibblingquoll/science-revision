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
type SanityImage = {
  alt?: string;
  asset?: { metadata?: { lqip?: string } };
  caption?: string;
};

type FigureValue = {
  image?: SanityImage;
  caption?: string;
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

    // Use the actual component prop types to avoid mismatches
    clozeBlock: ({ value }: { value: React.ComponentProps<typeof ClozeBlock> }) => (
      <ClozeBlock {...value} />
    ),
    clozePasteBlock: ({ value }: { value: React.ComponentProps<typeof ClozePasteBlock> }) => (
      <ClozePasteBlock {...value} />
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
        _type == "clozeBlock" => { _type, /* props will be spread */ text, blanks },
        _type == "clozePasteBlock" => { _type, /* props will be spread */ text }
      }
    }`,
    { page }
  );

  if (!data) {
    return <div className="mx-auto max-w-3xl p-6 text-neutral-700">Not found</div>;
  }

  // DEBUG: list block types without using `any`
  type PTBlock = { _type?: string };
  const blockTypes: (string | undefined)[] = Array.isArray(data.content)
    ? (data.content as PTBlock[]).map((b) => b._type)
    : [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>

      {/* DEBUG (remove when done) */}
      <pre className="text-xs text-neutral-500 bg-neutral-100 p-2 rounded mb-4">
        {JSON.stringify(blockTypes, null, 2)}
      </pre>

      <article className="prose prose-neutral max-w-none">
        <PortableText value={data.content} components={components} />
      </article>

      <PrevNextNav year={year} topicSlug={topic} pageSlug={page} />
    </main>
  );
}
