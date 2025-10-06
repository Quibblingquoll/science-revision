'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import type { Route } from 'next'; // ← key line

export default function Breadcrumbs() {
  const pathname = usePathname() || '/';

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  const formatSegment = (seg: string) =>
    seg.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-600 my-4">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link href="/" className="hover:underline text-blue-600">
            Home
          </Link>
        </li>

        {segments.map((seg, idx) => {
          const href = `/${segments.slice(0, idx + 1).join('/')}` as Route; // ← cast
          const isLast = idx === segments.length - 1;

          return (
            <Fragment key={idx}>
              <span className="text-gray-400 mx-1">›</span>
              <li>
                {isLast ? (
                  <span className="font-semibold text-gray-800">
                    {formatSegment(decodeURIComponent(seg))}
                  </span>
                ) : (
                  <Link href={href} className="hover:underline text-blue-600">
                    {formatSegment(decodeURIComponent(seg))}
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
