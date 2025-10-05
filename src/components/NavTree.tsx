type Page = { title: string; slug: string };
type Topic = { title: string; term?: number; slug: string; pages: Page[] };
type Year = { title: string; slug: string; topics: Topic[] };

export default function NavTree({ years }: { years: Year[] }) {
  return (
    <div className="space-y-6">
      {years.map((y) => (
        <section key={y.slug} className="rounded-2xl border p-4">
          <h2 className="text-xl font-semibold mb-3">{y.title}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {y.topics?.map((t) => (
              <div key={t.slug} className="rounded-xl border p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">
                    {t.title}
                    {typeof t.term === 'number' ? ` (Term ${t.term})` : ''}
                  </h3>
                  <a
                    href={`/${y.slug}/${t.slug}`}
                    className="text-sm underline underline-offset-2 hover:no-underline"
                  >
                    Topic page
                  </a>
                </div>
                <ul className="space-y-1">
                  {t.pages?.length ? (
                    t.pages.map((p) => (
                      <li key={p.slug}>
                        <a
                          className="block rounded-lg px-2 py-1 hover:bg-neutral-50"
                          href={`/${y.slug}/${t.slug}/${p.slug}`}
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
  );
}
