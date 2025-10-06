import { client } from '@/lib/sanity.client';
import { TOPICS_WITH_PAGES } from '@/lib/groq';
import SiteHeader from '@/components/SiteHeader';

export const revalidate = 300;

type Page = { title: string; slug: string };
type Topic = { title: string; slug: string; year: number | string; term?: number; pages: Page[] };
type YearGroup = { year: string; topics: Topic[] };

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
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* <p className="text-neutral-600 mb-6">Pick a year, then a topic, then a lesson page.</p>*/}

        {!years.length ? (
          <div className="rounded-xl border p-6 text-neutral-600">
            No published content found yet. Add <code>Topic</code> and <code>Content Page</code>{' '}
            docs in Studio and publish them.
          </div>
        ) : (
          <div className="space-y-6">
            {years.map((y) => (
              <section key={y.year} className="rounded-2xl border p-4">
                <h2 className="text-xl font-semibold mb-3">Year {y.year}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {y.topics.map((t) => (
                    <div key={t.slug} className="rounded-xl border p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">
                          {t.title}
                          {typeof t.term === 'number' ? ` (Term ${t.term})` : ''}
                        </h3>
                        <a
                          href={`/${y.year}/${t.slug}`}
                          className="text-sm underline underline-offset-2 hover:no-underline"
                        >
                          Topic page
                        </a>
                      </div>
                      <ul className="space-y-1">
                        {t.pages.length ? (
                          t.pages.map((p) => (
                            <li key={p.slug}>
                              <a
                                className="block rounded-lg px-2 py-1 hover:bg-neutral-50"
                                href={`/${y.year}/${t.slug}/${p.slug}`}
                              >
                                {p.title}
                              </a>
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-neutral-500">No pages yet</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
      <footer className="mt-10 py-10 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Science-Revision
      </footer>
    </>
  );
}
