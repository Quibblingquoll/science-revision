'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

export type Page = { title: string; slug: string };
export type Topic = {
  title: string;
  slug: string;
  year: number | string;
  term?: number;
  pages: Page[];
};
export type YearGroup = { year: string; topics: Topic[] };

function bgForYear(year: string): string {
  switch (year) {
    case '7':
      return 'bg-amber-100';
    case '8':
      return 'bg-lime-100';
    case '9':
      return 'bg-sky-100';
    case '10':
      return 'bg-violet-100';
    default:
      return 'bg-neutral-100';
  }
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`h-4 w-4 transition-transform ${open ? 'rotate-90' : 'rotate-0'}`}
      focusable="false"
    >
      <path d="M7 5l6 5-6 5V5z" fill="currentColor" />
    </svg>
  );
}

function TopicCard({
  topic,
  year,
  defaultOpen = false,
}: {
  topic: Topic;
  year: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={`rounded-xl border border-black p-3 shadow-sm overflow-hidden ${bgForYear(year)}`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`panel-${year}-${topic.slug}`}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium mb-0 text-black underline underline-offset-2 hover:no-underline">
            {topic.title}
          </h3>
          <div className="ml-3 flex items-center gap-2 text-sm text-neutral-800">
            {typeof topic.term === 'number' && (
              <span className="inline-flex items-center rounded-full border border-black/20 bg-white/60 px-2 py-0.5 text-xs font-medium text-black">
                Term {topic.term}
              </span>
            )}
            <span className="whitespace-nowrap">{topic.pages?.length ?? 0} pages</span>
            <Chevron open={open} />
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`panel-${year}-${topic.slug}`}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'tween', duration: 0.22 }}
          >
            <div className="pt-2">
              {topic.pages?.length ? (
                <ul className="space-y-1">
                  {topic.pages.map((p) => (
                    <li key={p.slug}>
                      <Link
                        className="block rounded-lg px-2 py-1 hover:bg-black/5"
                        href={`/${year}/${topic.slug}/${p.slug}`}
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-neutral-700">No pages yet</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function YearTopicAccordions({ years }: { years: YearGroup[] }) {
  // Optional: open an item if URL hash matches topic-slug (e.g., #forces)
  const hash = typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') : '';
  const initialSlug = useMemo(() => hash || '', [hash]);

  return (
    <div className="space-y-6">
      {years.map((y) => (
        <section key={y.year} className="rounded-2xl border border-black bg-neutral-50 p-4">
          <h2 className="text-xl font-semibold mb-3 text-black">Year {y.year}</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {y.topics.map((t) => (
              <TopicCard
                key={t.slug}
                topic={t}
                year={String(y.year)}
                defaultOpen={t.slug === initialSlug}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
