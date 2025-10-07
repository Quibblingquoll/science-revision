import { client } from '@/lib/sanity.client';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity.image';
import PrevNextNav from '@/components/PrevNextNav';

export const revalidate = 300;

type RouteParams = { year: string; topic: string; page: string };

/* --------------------------------------
   Portable Text renderers (image + figure)
-------------------------------------- */
const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const src = urlFor(value).width(1200).fit('max').url();
      if (!src) return null;
      return (
        <figure className="my-6">
          <Image
            src={src}
            alt={value?.alt || ''}
            width={1200}
            height={675}
            sizes="(min-width: 768px) 700px, 100vw"
            style={{ width: '100%', height: 'auto' }}
            placeholder={value?.asset?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={value?.asset?.metadata?.lqip}
          />
          {value?.caption && (
            <figcaption className="mt-2 text-sm text-neutral-500">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
    figure: ({ value }) => {
      const src = urlFor(value?.image).width(1200).fit('max').url();
      if (!src) return null;
      return (
        <figure className="my-6">
          <Image
            src={src}
            alt={value?.image?.alt || ''}
            width={1200}
            height={675}
            sizes="(min-width: 768px) 700px, 100vw"
            style={{ width: '100%', height: 'auto' }}
            placeholder={value?.image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={value?.image?.asset?.metadata?.lqip}
          />
          {value?.caption && (
            <figcaption className="mt-2 text-sm text-neutral-500">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
  },
};

/* --------------------------------------
   Page component
-------------------------------------- */
export default async function ContentPage({ params }: { params: RouteParams }) {
  const { year, topic, page } = params;

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
        }
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
