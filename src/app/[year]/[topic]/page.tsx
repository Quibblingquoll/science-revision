import { client } from '@/lib/sanity.client';

export const revalidate = 1800;

export default async function TopicPage({
  params: { year, topic },
}: {
  params: { year: string; topic: string };
}) {
  const data = await client.fetch(
    `*[_type=="topic" && slug.current==$topic][0]{
      title, term,
      "year": year-> { title, "slug": slug.current },
      "pages": *[_type=="revisionPage" && references(^._id)]|order(coalesce(order,999), title asc){
        title, "slug": slug.current
      }
    }`,
    { topic }
  );

  if (!data) return <div className="mx-auto max-w-3xl p-6">Not found</div>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
      <p className="text-neutral-600 mb-6">
        {data.year?.title} • {data.term ? `Term ${data.term}` : 'Topic'}
      </p>
      <ul className="space-y-2">
        {data.pages?.map((p: any) => (
          <li key={p.slug}>
            <a className="underline" href={`/${year}/${topic}/${p.slug}`}>
              {p.title}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
