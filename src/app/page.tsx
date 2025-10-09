import { client } from '@/lib/sanity.client';
import { TOPICS_WITH_PAGES } from '@/lib/groq';
import YearTopicAccordions, { YearGroup } from '@/components/YearTopicAccordions';

export const revalidate = 300;

type Page = { title: string; slug: string };
type Topic = {
  title: string;
  slug: string;
  year: number | string;
  term?: number;
  pages: Page[];
};

function groupByYear(topics: Topic[]): YearGroup[] {
  const map = new Map<string, Topic[]>();
  for (const t of topics) {
    const y = String(t.year ?? '');
    map.set(y, [...(map.get(y) ?? []), t]);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([year, topics]) => ({ year, topics }));
}

export default async function HomePage() {
  const topics: Topic[] = await client.fetch(TOPICS_WITH_PAGES);
  const years = groupByYear(topics).filter((g) => g.year); // drop empty

  return (
    <>
      <main className="mx-auto max-w-5xl px-4 py-8">
        {!years.length ? (
          <div className="rounded-xl border border-black p-6 text-neutral-700">
            No published content found yet. Add <code>Topic</code> and <code>Content Page</code>{' '}
            docs in Studio and publish them.
          </div>
        ) : (
          <YearTopicAccordions years={years} />
        )}
      </main>
    </>
  );
}
