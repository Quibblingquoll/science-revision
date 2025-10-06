import { client } from '@/lib/sanity.client';
import { TOPICS_WITH_PAGES } from '@/lib/groq';
import SiteHeader from '@/components/SiteHeader';
import Link from 'next/link';

export const revalidate = 300;

type Page = { title: string; slug: string };
type Topic = {
  title: string;
  slug: string;
  year: number | string;
  term?: number;
  pages: Page[];
};
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

// Soft fill colour per year (feel free to tweak)
function bgForYear(year: string): string {
  switch (year) {
    case '7':
      return 'bg-amber-100'; // warm yellow
    case '8':
      return 'bg-lime-100'; // light green
    case '9':
      return 'bg-sky-100'; // light blue
    case '10':
      return 'bg-violet-100'; // light purple
    default:
      return 'bg-neutral-100'; // light grey fallback
  }
}

export default async function HomePage() {
  const topics: Topic[] = await client.fetch(TOPICS_WITH_PAGES);
  const years = groupByYear(topics).filter((g) => g.year); // drop empty

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        {!years.length ? (
          <div className="rounded-xl border border-black p-6 text-neutral-700">
            No published content found yet. Add <code>Topic</code> and <code>Content Page</code>{' '}
            docs in Studio and publish them.
          </div>
        ) : (
          <div className="space-y-6">
            {years.map((y) => (
              <section key={y.year} className="rounded-2xl border border-black bg-neutral-50 p-4">
                <h2 className="text-xl font-semibold mb-3 text-black">Year {y.year}</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {y.topics.map((t) => (
                    <div
                      key={t.slug}
                      className={`rounded-xl border border-black p-3 shadow-sm transition-transform hover:scale-[1.01] ${bgForYear(
                        String(y.year)
                      )}`}
                    >
                      {/* Topic title = link (black text, underline) */}
                      <h3 className="font-medium mb-2 text-black">
                        <Link
                          href={`/${y.year}/${t.slug}`}
                          className="underline underline-offset-2 hover:no-underline"
                        >
                          {t.title}
                        </Link>
                        {typeof t.term === 'number' && (
                          <span className="ml-2 inline-flex items-center rounded-full border border-black/20 bg-white/60 px-2 py-0.5 text-xs font-medium text-black">
                            Term {t.term}
                          </span>
                        )}
                      </h3>

                      {/* Pages list */}
                      <ul className="space-y-1">
                        {t.pages.length ? (
                          t.pages.map((p) => (
                            <li key={p.slug}>
                              <Link
                                className="block rounded-lg px-2 py-1 hover:bg-black/5"
                                href={`/${y.year}/${t.slug}/${p.slug}`}
                              >
                                {p.title}
                              </Link>
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-neutral-700">No pages yet</li>
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

      <footer className="mt-10 py-10 text-center text-xs text-neutral-600">
        © {new Date().getFullYear()} Science-Revision
      </footer>
    </>
  );
}
