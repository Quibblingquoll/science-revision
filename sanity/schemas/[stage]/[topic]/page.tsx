import { client } from '@/lib/sanity.client';
import { PortableText } from '@portabletext/react';

export const revalidate = 300;

type PageProps = {
  params: { stage: string; topic: string };
};

export default async function Page({ params: { stage, topic } }: PageProps) {
  const data = await client.fetch(
    `*[_type == "contentPage"
        && defined(topic->slug.current)
        && topic->slug.current == $topic
        && defined(topic->stage->slug.current)
        && topic->stage->slug.current == $stage][0]{
      title,
      content,
      outcomes[]->{code, description}
    }`,
    { stage, topic }
  );

  if (!data) {
    return <div className="mx-auto max-w-3xl p-6">Not found</div>;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
      <article id="content" className="prose prose-neutral max-w-none">
        <PortableText value={data.content} />
      </article>
    </main>
  );
}
