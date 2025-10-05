import { client } from '@/lib/sanity.client';
import { MENU_QUERY } from '@/lib/groq';
import SiteHeader from '@/components/SiteHeader';
import dynamic from 'next/dynamic';

const NavTree = dynamic(() => import('@/components/NavTree'), { ssr: true });

export const revalidate = 1800; // 30 min

export default async function HomePage() {
  const years = await client.fetch(MENU_QUERY);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-neutral-600 mb-6">Pick a year, then a topic, then a lesson page.</p>
        <NavTree years={years} />
      </main>
      <footer className="mt-10 py-10 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Science-Revision
      </footer>
    </>
  );
}
