import { client } from '@/lib/sanity.client';

export const revalidate = 300;

type ContentPage = { title: string; slug: string };
type TopicData = {
  title: string;
  term?: number;
  year?: number | string;
  pages: ContentPage[];
};

export default async function TopicPage({
  params,
}: {
  params: Promise<{ year: string; topic: string }>;
}) {
  const { year, topic } = await params;

  const data = await client.fetch<TopicData>(
    `*[_type=="topic" && slug.current==$topic][0]{
      title, term, year,
      "pages": *[_type=="contentPage" && references(^._id)]
        | order(coalesce(order,999), title asc){ title, "slug": slug.current }
    }`,
    { topic }
  );

  if (!data) return <div className="mx-auto max-w-3xl p-6">Not found</div>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
      <p className="text-neutral-600 mb-6">
        Year {data.year ?? year} • {data.term ? `Term ${data.term}` : 'Topic'}
      </p>
      <ul className="space-y-2">
        {data.pages?.map((p) => (
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
