'use client';
import * as React from 'react';

export type ClozePasteBlockProps = {
  title: string;
  instructions?: string;
  passage: string; // full text with [bracketed] answers
  distractors?: string[]; // optional extras to add to the bank
  shuffleBank?: boolean;
  bgColor?: string;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Parse passage -> tokens of {type:'text'|'blank', value:string}
function parsePassage(passage: string): Array<{ type: 'text' | 'blank'; value: string }> {
  const tokens: Array<{ type: 'text' | 'blank'; value: string }> = [];
  const re = /\[([^\]]+)\]/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(passage)) !== null) {
    if (m.index > lastIndex) {
      tokens.push({ type: 'text', value: passage.slice(lastIndex, m.index) });
    }
    tokens.push({ type: 'blank', value: m[1].trim() });
    lastIndex = re.lastIndex;
  }
  if (lastIndex < passage.length) tokens.push({ type: 'text', value: passage.slice(lastIndex) });
  return tokens;
}

export default function ClozePasteBlock({
  title,
  instructions,
  passage,
  distractors = [],
  shuffleBank = true,
  bgColor,
}: ClozePasteBlockProps) {
  const tokens = React.useMemo(() => parsePassage(passage), [passage]);

  // Answers appear in order of blanks in the passage
  const answers = React.useMemo(
    () => tokens.filter((t) => t.type === 'blank').map((t) => t.value),
    [tokens]
  );

  // Build the single, shared bank: unique answers + unique distractors
  const bank = React.useMemo(() => {
    const uniq = Array.from(new Set([...answers, ...distractors]));
    return shuffleBank ? shuffle(uniq) : uniq;
  }, [answers, distractors, shuffleBank]);

  const blankCount = answers.length;
  const [selected, setSelected] = React.useState<(string | '')[]>(() => Array(blankCount).fill(''));
  const [checked, setChecked] = React.useState(false);

  // Prevent duplicates across the whole passage
  const inUse = React.useMemo(() => new Set(selected.filter(Boolean) as string[]), [selected]);

  const results = React.useMemo(() => {
    if (!checked) return Array(blankCount).fill(null) as (boolean | null)[];
    return answers.map((ans, i) => selected[i] === ans);
  }, [answers, selected, checked]);

  const allAnswered = selected.every(Boolean);
  const correctCount = results.filter((r) => r === true).length;

  const onSelect = (idx: number, value: string) =>
    setSelected((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });

  const onCheck = () => setChecked(true);
  const onRetry = () => {
    setSelected((prev) => prev.map((v, i) => (results[i] ? v : '')));
    setChecked(false);
  };

  const cardStyle: React.CSSProperties = { backgroundColor: bgColor || '#f8fafc' };

  // Render passage, replacing blanks with <select> in order
  let bi = -1;

  return (
    <section className="my-6 rounded-2xl border border-slate-200 p-4 shadow-sm" style={cardStyle}>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {instructions && <p className="mt-1 text-sm text-slate-700">{instructions}</p>}

      <p className="mt-4 text-base leading-7 text-slate-900">
        {tokens.map((t, i) => {
          if (t.type === 'text') return <span key={i}>{t.value}</span>;
          bi++;
          const value = selected[bi] ?? '';
          const isCorrect = checked ? results[bi] === true : null;
          return (
            <React.Fragment key={i}>
              <select
                value={value}
                onChange={(e) => onSelect(bi, e.target.value)}
                disabled={checked && isCorrect === true}
                className={[
                  'mx-1 rounded-md border px-2 py-1 text-sm align-baseline',
                  isCorrect === true && 'border-emerald-500 ring-1 ring-emerald-300',
                  isCorrect === false && 'border-rose-500 ring-1 ring-rose-300',
                  !value && 'border-slate-300',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <option value="">choose</option>
                {bank.map((w) => {
                  const isSelectedHere = value === w;
                  const usedElsewhere = inUse.has(w) && !isSelectedHere;
                  return (
                    <option key={`bank:${w}`} value={w} disabled={usedElsewhere}>
                      {w}
                    </option>
                  );
                })}
              </select>
              {checked && isCorrect === false && (
                <span className="ml-2 rounded bg-rose-50 px-2 py-0.5 text-xs text-rose-700 align-baseline">
                  Try again
                </span>
              )}
            </React.Fragment>
          );
        })}
      </p>

      <div className="mt-4 flex items-center gap-3">
        {!checked ? (
          <button
            type="button"
            onClick={onCheck}
            disabled={!allAnswered}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Check answers
          </button>
        ) : (
          <>
            <span className="text-sm text-slate-700">
              {correctCount}/{blankCount} correct
            </span>
            {correctCount < blankCount ? (
              <button
                type="button"
                onClick={onRetry}
                className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm font-medium text-white"
              >
                Retry incorrect
              </button>
            ) : (
              <span className="rounded bg-emerald-50 px-2 py-1 text-sm text-emerald-700">
                All correct
              </span>
            )}
          </>
        )}
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-slate-600">Show word bank</summary>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          {bank.map((w) => (
            <span
              key={`pill:${w}`}
              className={[
                'rounded-full border px-2 py-0.5',
                inUse.has(w)
                  ? 'border-slate-300 text-slate-400 line-through'
                  : 'border-slate-300 text-slate-700',
              ].join(' ')}
            >
              {w}
            </span>
          ))}
        </div>
      </details>
    </section>
  );
}
