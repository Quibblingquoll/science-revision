import Link from 'next/link';

export default function SiteHeader() {
  return (
    <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-5xl px-4 py-5 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600">
            Science-Revision
          </span>
        </h1>
        <nav className="text-sm text-neutral-600">
          <Link href="/" className="hover:text-neutral-900">
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
