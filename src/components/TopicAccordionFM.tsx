'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';

export type Page = { title: string; slug: string };
export type Topic = { title: string; slug: string; year: string | number; pages: Page[] };

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={clsx('h-4 w-4 transition-transform', open ? 'rotate-90' : 'rotate-0')}
      focusable="false"
    >
      <path d="M7 5l6 5-6 5V5z" fill="currentColor" />
    </svg>
  );
}

function TopicCard({ topic, defaultOpen = false }: { topic: Topic; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border bg-white/70 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`panel-${topic.slug}`}
        className="w-full px-4 py-3 text-left font-semibold hover:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <div className="flex items-center justify-between gap-4">
          <span className="truncate">{topic.title}</span>
          <div className="flex items-center gap-3 shrink-0 text-sm text-muted-foreground">
            <span>{topic.pages?.length ?? 0} pages</span>
            <Chevron open={open} />
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`panel-${topic.slug}`}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'tween', duration: 0.22 }}
          >
            <div className="px-4 pb-4">
              {topic.pages?.length ? (
                <ul className="mt-2 space-y-2">
                  {topic.pages.map((p) => (
                    <li key={p.slug}>
                      <a
                        href={`/${topic.slug}/${p.slug}`}
                        className="underline text-blue-700 hover:no-underline"
                      >
                        {p.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">No pages yet.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TopicAccordionFM({ topics }: { topics: Topic[] }) {
  // Open an item if the URL has a hash like #physics
  const hash = typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') : '';
  const initialSlug = useMemo(() => hash || '', [hash]);

  return (
    <div className="space-y-3">
      {topics.map((t) => (
        <TopicCard key={t.slug} topic={t} defaultOpen={t.slug === initialSlug} />
      ))}
    </div>
  );
}
