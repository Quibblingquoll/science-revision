'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ipuzToReactCrossword } from '@/lib/ipuzToCrossword';

const Crossword = dynamic(() => import('@jaredreisinger/react-crossword').then((m) => m.default), {
  ssr: false,
});

type Props = {
  value: { title?: string; slug?: { current: string }; ipuz: string };
  pageSlug: string;
};

export default function CrosswordIpuzBlock({ value, pageSlug }: Props) {
  const [startedAt] = useState<number>(Date.now());
  const checks = useRef(0);
  const reveals = useRef(0);

  const ipuz = useMemo(() => {
    try {
      return JSON.parse(value.ipuz);
    } catch {
      return null;
    }
  }, [value.ipuz]);

  const data = useMemo(
    () => (ipuz ? ipuzToReactCrossword(ipuz) : { across: {}, down: {} }),
    [ipuz]
  );
  const storageKey = `cw:${pageSlug}:${value.slug?.current ?? 'puzzle'}`;

  type CrosswordState = Record<string, unknown>;

  const saveProgress = (state: CrosswordState) => {
    // Persist locally; replace with POST to /api/crossword/progress if you want DB
    localStorage.setItem(storageKey, JSON.stringify({ ts: Date.now(), state }));
  };

  const onComplete = async (correct: boolean) => {
    const timeMs = Date.now() - startedAt;
    const wordsTotal = Object.keys(data.across).length + Object.keys(data.down).length;
    // Hook: send to API/DB
    // await fetch('/api/crossword/submit', { ... })

    console.info('Crossword submitted', {
      pageSlug,
      puzzleSlug: value.slug?.current,
      correct,
      timeMs,
      checksUsed: checks.current,
      revealsUsed: reveals.current,
      wordsTotal,
    });
  };

  if (!ipuz) return <div className="rounded-xl border p-4">Invalid IPUZ JSON.</div>;

  return (
    <div className="my-8 rounded-2xl border bg-white/70 p-4">
      {value.title && <h3 className="mb-3 text-xl font-semibold">{value.title}</h3>}

      <div className="mb-3 flex gap-2">
        <button
          className="rounded-lg border px-3 py-1 text-sm"
          onClick={() => {
            checks.current += 1; /* wire to lib if using a fork that supports check */
          }}
        >
          Check
        </button>
        <button
          className="rounded-lg border px-3 py-1 text-sm"
          onClick={() => {
            reveals.current += 1; /* wire to reveal */
          }}
        >
          Reveal
        </button>
        <button
          className="rounded-lg border px-3 py-1 text-sm"
          onClick={() => localStorage.removeItem(storageKey)}
        >
          Reset saved
        </button>
      </div>

      <Crossword
        data={data}
        onCellChange={(_coord: [number, number], _char: string) => {
          // Save something lightweight each change
          saveProgress({ ts: Date.now() });
        }}
        onCrosswordCorrect={onComplete}
      />
    </div>
  );
}
