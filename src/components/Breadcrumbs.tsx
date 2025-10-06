'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect } from 'react';
import type { Route } from 'next';

export default function Breadcrumbs() {
  const pathname = usePathname() || '/';

  useEffect(() => {
    // Debug: check what Next thinks the current path is
    // eslint-disable-next-line no-console
    console.log('[Breadcrumbs] pathname:', pathname);
  }, [pathname]);

  const segments = pathname.split('/').filter(Boolean);

  const formatSegment = (seg: string) =>
    decodeURIComponent(seg)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

  // Build hrefs progressively
  const buildHref = (idx: number) => `/${segments.slice(0, idx + 1).join('/')}` as Route;

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-700 my-4">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link href="/" className="hover:underline text-blue-600">
            Home
          </Link>
        </li>

        {segments.map((seg, idx) => {
          const href = buildHref(idx);
          const isLast = idx === segments.length - 1;
          return (
            <Fragment key={idx}>
              <span className="text-gray-400 mx-1">›</span>
              <li>
                {isLast ? (
                  <span className="font-semibold text-gray-900">{formatSegment(seg)}</span>
                ) : (
                  <Link href={href} className="hover:underline text-blue-600">
                    {formatSegment(seg)}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
