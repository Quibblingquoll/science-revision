'use client';

import Link from 'next/link';

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50">
      <div
        className="
          bg-sky-100/70 backdrop-blur-md
          border-b border-black/10 shadow-sm
        "
      >
        <div className="mx-auto max-w-5xl px-4 py-4">
          {/* 3-col grid so the title stays perfectly centred */}
          <div className="grid grid-cols-3 items-center">
            <div /> {/* left spacer */}
            <h1
              className="
                text-center text-3xl font-extrabold tracking-tight
                bg-gradient-to-r from-sky-600 via-blue-600 to-emerald-600
                bg-clip-text text-transparent
              "
            >
              revise.idlerise
            </h1>
            <nav className="justify-self-end">
              <Link href="/" className="text-sm text-gray-700 hover:text-gray-900 hover:underline">
                Home
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
