import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Breadcrumbs from '@/components/Breadcrumbs'; // ✅ added

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Science Revision',
  description: 'Interactive science revision site for Years 7–10',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-b from-sky-50 via-cyan-50 to-emerald-50 text-gray-900`}
      >
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* ✅ Breadcrumbs now display globally */}
          <Breadcrumbs />

          {/* ✅ Page content */}
          <main>{children}</main>

          {/* ✅ Footer (optional) */}
          <footer className="py-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Science Revision
          </footer>
        </div>
      </body>
    </html>
  );
}
