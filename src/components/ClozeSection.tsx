// /src/components/ClozeSection.tsx
'use client';
import { useState } from 'react';

type Props = {
  passage?: string;
  wordBank?: string[];
  clozeUrl?: string | null;
  answersUrl?: string | null;
  isSubscriber?: boolean; // <-- control visibility
  title?: string;
};

export default function ClozeSection({
  passage,
  wordBank = [],
  clozeUrl,
  answersUrl,
  isSubscriber = false,
  title = 'Cloze Activity',
}: Props) {
  if (!passage) return null;

  const tokens = passage.split(/\[\[([^\]]+)\]\]/g);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  return (
    <section className="my-8 rounded-2xl border border-sky-100 bg-sky-50/50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          {clozeUrl && (
            <a
              href={clozeUrl}
              target="_blank"
              rel="noopener"
              download
              className="inline-flex items-center rounded-xl border border-sky-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-sky-50"
            >
              Download A5 PDF
            </a>
          )}

          {/* Answers button ONLY renders if subscribed */}
          {isSubscriber && answersUrl && (
            <a
              href={answersUrl}
              target="_blank"
              rel="noopener"
              download
              className="inline-flex items-center rounded-xl border border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-emerald-50"
            >
              Download Answers
            </a>
          )}
        </div>
      </div>

      {wordBank.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {wordBank.map((w) => (
            <span
              key={w}
              className="rounded-full border border-cyan-200 bg-white px-2 py-0.5 text-sm"
            >
              {w}
            </span>
          ))}
        </div>
      )}

      <p className="mt-4 leading-8">
        {tokens.map((part, i) => {
          const isBlank = i % 2 === 1;
          if (!isBlank) return <span key={i}>{part}</span>;
          return (
            <select
              key={i}
              value={answers[i] ?? ''}
              onChange={(e) => setAnswers((s) => ({ ...s, [i]: e.target.value }))}
              className="mx-1 inline-block rounded-md border border-gray-300 px-2 py-1 text-sm align-baseline"
            >
              <option value="">— select —</option>
              {wordBank.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          );
        })}
      </p>
    </section>
  );
}
