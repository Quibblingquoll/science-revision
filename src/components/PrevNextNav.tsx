import Link from 'next/link';
import type { Route } from 'next';
import { client } from '@/lib/sanity.client';

type PageLite = {
  title: string;
  slug: string;
  order: number;
};

async function getOrderedSiblings(topicSlug: string): Promise<PageLite[]> {
  const q = `
    *[_type == "contentPage" && topic->slug.current == $topic]
      | order(order asc){
        title,
        "slug": slug.current,
        order
      }
  `;
  return client.fetch(q, { topic: topicSlug });
}

export default async function PrevNextNav({
  year,
  topicSlug,
  pageSlug,
}: {
  year: string;
  topicSlug: string;
  pageSlug: string;
}) {
  const pages = await getOrderedSiblings(topicSlug);
  if (!pages?.length) return null;

  const idx = pages.findIndex((p) => p.slug === pageSlug);
  if (idx === -1) return null;

  const prev = idx > 0 ? pages[idx - 1] : null;
  const next = idx < pages.length - 1 ? pages[idx + 1] : null;

  return (
    <nav aria-label="Pagination" className="mt-10 border-t pt-6">
      <div className="flex items-center justify-between">
        {prev ? (
          <Link
            href={`/${year}/${topicSlug}/${prev.slug}` as Route}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-3 ring-1 ring-gray-300 hover:bg-gray-50"
          >
            <span aria-hidden>←</span>
            <span className="truncate">
              <span className="block text-xs text-gray-500">Previous</span>
              <span className="block font-medium">{prev.title}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}

        {next ? (
          <Link
            href={`/${year}/${topicSlug}/${next.slug}` as Route}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-3 ring-1 ring-gray-300 hover:bg-gray-50"
          >
            <span className="truncate text-right">
              <span className="block text-xs text-gray-500">Next</span>
              <span className="block font-medium">{next.title}</span>
            </span>
            <span aria-hidden>→</span>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </nav>
  );
}
