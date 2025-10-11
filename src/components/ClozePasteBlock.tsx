'use client';

import { useMemo, useState } from 'react';

type ClozeValue = {
  text: string;
  targetBlanks?: number;
  minLen?: number;
  caseSensitive?: boolean;
};

type Part = { type: 'text'; value: string } | { type: 'blank'; answer: string; idx: number };

const STOPWORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'but',
  'by',
  'for',
  'from',
  'has',
  'have',
  'in',
  'is',
  'it',
  'its',
  'of',
  'on',
  'or',
  'that',
  'the',
  'to',
  'was',
  'were',
  'with',
  'this',
  'these',
  'those',
  'we',
  'you',
  'they',
  'our',
  'your',
  'their',
  'he',
  'she',
  'his',
  'her',
]);

const isWord = (t: string) => /^\p{L}[\p{L}\p{M}'-]*$/u.test(t);
const shuffle = <T,>(arr: T[]) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function splitWithBrackets(text: string): Part[] {
  const out: Part[] = [];
  const re = /\[([^\]]+)\]/g;
  let last = 0,
    m: RegExpExecArray | null,
    idx = 0;

  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ type: 'text', value: text.slice(last, m.index) });
    out.push({ type: 'blank', answer: m[1].trim(), idx: idx++ });
    last = re.lastIndex;
  }
  if (last < text.length) out.push({ type: 'text', value: text.slice(last) });
  return out;
}

function autoBlank(text: string, target = 12, minLen = 5): Part[] {
  const tokens = Array.from(text.matchAll(/(\p{L}[\p{L}\p{M}'-]*|\s+|[^\s\p{L}\p{M}])/gu)).map(
    (t) => t[0]
  );
  const wordIdxs: number[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (isWord(tok)) {
      const base = tok.toLowerCase();
      if (tok.length >= minLen && !STOPWORDS.has(base) && !seen.has(base)) {
        wordIdxs.push(i);
        seen.add(base);
      }
    }
  }
  if (!wordIdxs.length) return [{ type: 'text', value: text }];

  const pickCount = Math.min(target, wordIdxs.length);
  const picks = new Set<number>();
  for (let p = 0; p < pickCount; p++) {
    const pos = Math.round((p / Math.max(1, pickCount - 1)) * (wordIdxs.length - 1));
    picks.add(wordIdxs[pos]);
  }

  const out: Part[] = [];
  let b = 0;
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (isWord(tok) && picks.has(i)) {
      out.push({ type: 'blank', answer: tok, idx: b++ });
    } else {
      const last = out[out.length - 1];
      if (last && last.type === 'text') last.value += tok;
      else out.push({ type: 'text', value: tok });
    }
  }
  return out;
}

export default function ClozePasteBlock({ value }: { value: ClozeValue }) {
  const { text, targetBlanks = 12, minLen = 5, caseSensitive = false } = value;

  // Build parts + answers
  const parts = useMemo<Part[]>(() => {
    const hasBrackets = /\[[^\]]+\]/.test(text);
    return hasBrackets ? splitWithBrackets(text) : autoBlank(text, targetBlanks, minLen);
  }, [text, targetBlanks, minLen]);

  const blanks = parts.filter((p): p is Extract<Part, { type: 'blank' }> => p.type === 'blank');
  const answers = blanks.map((b) => b.answer);

  // Unique answers and counts (supports duplicates)
  const initialCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of answers) m.set(a, (m.get(a) ?? 0) + 1);
    return m;
  }, [text]); // recalc when the passage changes

  // State
  const [counts, setCounts] = useState<Map<string, number>>(initialCounts);
  const [selected, setSelected] = useState<string[]>(Array(blanks.length).fill(''));
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Keep an immutable, shuffled list of unique options for nicer UX
  const uniqueOptions = useMemo(() => shuffle([...new Set(answers)]), [text]);

  const norm = (s: string) => (caseSensitive ? s : s.toLowerCase().trim());

  const onSelect = (i: number, next: string) => {
    setSelected((prev) => {
      const curr = prev[i];
      if (curr === next) return prev;

      // Return previous selection to pool
      setCounts((old) => {
        const m = new Map(old);
        if (curr) m.set(curr, (m.get(curr) ?? 0) + 1);
        if (next) m.set(next, Math.max(0, (m.get(next) ?? 0) - 1));
        return m;
      });

      const copy = prev.slice();
      copy[i] = next;
      return copy;
    });
    setChecked(false);
    setRevealed(false);
  };

  const optionsFor = (i: number) => {
    // Show any word with remaining count > 0, plus the currently selected (so it doesn't disappear)
    const current = selected[i];
    const list = uniqueOptions.filter((opt) => (counts.get(opt) ?? 0) > 0 || opt === current);
    return list;
  };

  const score = checked
    ? blanks.reduce((acc, b) => acc + (norm(selected[b.idx]) === norm(b.answer) ? 1 : 0), 0)
    : 0;

  const onCheck = () => {
    setChecked(true);
    setRevealed(false);
  };

  const onReveal = () => {
    // Fill with correct answers and zero out the pool
    setSelected(blanks.map((b) => b.answer));
    const m = new Map<string, number>();
    for (const a of uniqueOptions) m.set(a, 0);
    setCounts(m);
    setRevealed(true);
    setChecked(false);
  };

  const onReset = () => {
    setSelected(Array(blanks.length).fill(''));
    setCounts(initialCounts);
    setChecked(false);
    setRevealed(false);
  };

  return (
    <div className="my-6">
      <div className="leading-relaxed">
        {parts.map((p, i) =>
          p.type === 'text' ? (
            <span key={i}>{p.value}</span>
          ) : (
            <select
              key={i}
              value={selected[p.idx] || ''}
              onChange={(e) => onSelect(p.idx, e.target.value)}
              className={[
                'mx-1 px-2 py-1 border rounded-md bg-white align-baseline',
                checked
                  ? norm(selected[p.idx]) === norm(p.answer)
                    ? 'border-green-600'
                    : 'border-red-600'
                  : 'border-neutral-300',
              ].join(' ')}
              aria-label={`Blank ${p.idx + 1}`}
            >
              <option value="" disabled>
                — choose —
              </option>
              {optionsFor(p.idx).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={onCheck} className="rounded-xl px-3 py-1 border shadow-sm hover:shadow">
          Check answers
        </button>
        <button onClick={onReveal} className="rounded-xl px-3 py-1 border shadow-sm hover:shadow">
          Reveal
        </button>
        <button onClick={onReset} className="rounded-xl px-3 py-1 border shadow-sm hover:shadow">
          Reset
        </button>
        {checked && (
          <span className="ml-2 self-center text-sm">
            Score: <strong>{score}</strong> / {blanks.length}
          </span>
        )}
        {revealed && <span className="ml-2 self-center text-sm italic">Answers revealed</span>}
      </div>
    </div>
  );
}
