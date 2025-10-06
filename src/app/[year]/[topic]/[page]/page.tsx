import { client } from '@/lib/sanity.client';
import { PortableText } from '@portabletext/react';

export const revalidate = 1800;

export default async function RevisionPage({
  params,
}: {
  params: Promise<{ year: string; topic: string; page: string }>;
}) {
  const { page } = await params;

  const data = await client.fetch(
    `*[_type=="contentPage" && slug.current==$page][0]{ title, content }`,
    { page }
  );

  if (!data) return <div className="mx-auto max-w-3xl p-6">Not found</div>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
      <article className="prose prose-neutral max-w-none">
        <PortableText value={data.content} />
      </article>
    </main>
  );
}
