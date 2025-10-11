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

/* ---------------------------
   Inline Dropdown Component
--------------------------- */
function InlineDropdown({
  idx,
  answer,
  value,
  options,
  onChange,
  checked,
  caseSensitive,
}: {
  idx: number;
  answer: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  checked: boolean;
  caseSensitive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const norm = (s: string) => (caseSensitive ? s : s.toLowerCase().trim());
  const correct = checked && value && norm(value) === norm(answer);

  return (
    <span className="relative inline-block mx-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[
          'underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-500',
          'text-base transition select-none',
          checked
            ? correct
              ? 'text-green-700 decoration-green-400'
              : 'text-red-700 decoration-red-400'
            : 'text-neutral-800',
        ].join(' ')}
      >
        {value || '— choose —'} <span className="text-neutral-400">▾</span>
      </button>

      {open && (
        <ul
          className="absolute z-10 mt-1 bg-white/95 rounded-lg shadow-lg ring-1 ring-black/5 min-w-[8rem] p-1"
          onMouseLeave={() => setOpen(false)}
        >
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="cursor-pointer px-3 py-1 rounded-md hover:bg-neutral-100 active:bg-neutral-200"
            >
              {opt}
            </li>
          ))}
          <li
            onClick={() => {
              onChange('');
              setOpen(false);
            }}
            className="cursor-pointer px-3 py-1 rounded-md text-neutral-500 hover:bg-neutral-100"
          >
            Clear
          </li>
        </ul>
      )}
    </span>
  );
}

/* ---------------------------
   Main Component
--------------------------- */
export default function ClozePasteBlock({ value }: { value: ClozeValue }) {
  const { text, targetBlanks = 12, minLen = 5, caseSensitive = false } = value;

  const parts = useMemo<Part[]>(() => {
    const hasBrackets = /\[[^\]]+\]/.test(text);
    return hasBrackets ? splitWithBrackets(text) : autoBlank(text, targetBlanks, minLen);
  }, [text, targetBlanks, minLen]);

  const blanks = parts.filter((p) => p.type === 'blank') as Array<Extract<Part, { type: 'blank' }>>;
  const answers = blanks.map((b) => b.answer);

  const initialCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of answers) m.set(a, (m.get(a) ?? 0) + 1);
    return m;
  }, [text]);

  const [counts, setCounts] = useState<Map<string, number>>(initialCounts);
  const [selected, setSelected] = useState<string[]>(Array(blanks.length).fill(''));
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [mode, setMode] = useState<'dropdown' | 'typed'>('dropdown'); // 🔘 mode switch

  const uniqueOptions = useMemo(() => shuffle([...new Set(answers)]), [text]);
  const norm = (s: string) => (caseSensitive ? s : s.toLowerCase().trim());

  const onSelect = (i: number, next: string) => {
    setSelected((prev) => {
      const curr = prev[i];
      if (curr === next) return prev;
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
    const current = selected[i];
    return uniqueOptions.filter((opt) => (counts.get(opt) ?? 0) > 0 || opt === current);
  };

  const score = checked
    ? blanks.reduce((acc, b) => acc + (norm(selected[b.idx]) === norm(b.answer) ? 1 : 0), 0)
    : 0;

  const onCheck = () => {
    setChecked(true);
    setRevealed(false);
  };
  const onReveal = () => {
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

  /* ----- RENDERERS FOR BOTH MODES ----- */
  const renderBlankTyped = (p: Extract<Part, { type: 'blank' }>) => (
    <input
      key={p.idx}
      type="text"
      value={selected[p.idx] || ''}
      onChange={(e) => onSelect(p.idx, e.target.value)}
      className={[
        'mx-1 bg-transparent border-b border-neutral-400 focus:border-indigo-400 focus:outline-none',
        'text-neutral-800 px-1',
        checked
          ? norm(selected[p.idx]) === norm(p.answer)
            ? 'border-green-500 text-green-700'
            : 'border-red-500 text-red-700'
          : '',
      ].join(' ')}
      style={{ minWidth: '4ch' }}
    />
  );

  const renderBlankDropdown = (p: Extract<Part, { type: 'blank' }>) => (
    <InlineDropdown
      key={p.idx}
      idx={p.idx}
      answer={p.answer}
      value={selected[p.idx] || ''}
      options={optionsFor(p.idx)}
      onChange={(v) => onSelect(p.idx, v)}
      checked={checked}
      caseSensitive={caseSensitive}
    />
  );

  /* ----- MAIN RETURN ----- */
  return (
    <div className="my-8 rounded-2xl border border-neutral-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-pink-50 p-6 shadow-sm">
      {/* 🔘 MODE SWITCH BAR */}
      <div className="flex justify-end gap-2 mb-3">
        <button
          onClick={() => setMode('typed')}
          className={`px-3 py-1 rounded-full text-sm shadow-sm ${
            mode === 'typed'
              ? 'bg-indigo-500 text-white'
              : 'bg-white text-neutral-700 hover:bg-neutral-100'
          }`}
        >
          ✏️ Typed
        </button>
        <button
          onClick={() => setMode('dropdown')}
          className={`px-3 py-1 rounded-full text-sm shadow-sm ${
            mode === 'dropdown'
              ? 'bg-indigo-500 text-white'
              : 'bg-white text-neutral-700 hover:bg-neutral-100'
          }`}
        >
          🔽 Dropdown
        </button>
      </div>

      {/* CLOZE CONTENT */}
      <div className="bg-white/90 rounded-xl p-5 shadow-inner leading-relaxed text-neutral-800">
        {parts.map((p, i) =>
          p.type === 'text' ? (
            <span key={i}>{p.value}</span>
          ) : mode === 'typed' ? (
            renderBlankTyped(p)
          ) : (
            renderBlankDropdown(p)
          )
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={onCheck}
          className="rounded-xl bg-indigo-500 text-white px-3 py-1 shadow hover:bg-indigo-600"
        >
          Check
        </button>
        <button
          onClick={onReveal}
          className="rounded-xl bg-amber-400 text-white px-3 py-1 shadow hover:bg-amber-500"
        >
          Reveal
        </button>
        <button
          onClick={onReset}
          className="rounded-xl bg-neutral-300 text-neutral-800 px-3 py-1 shadow hover:bg-neutral-400"
        >
          Reset
        </button>

        {checked && (
          <span className="ml-2 self-center text-sm text-neutral-700">
            Score: <strong>{score}</strong> / {blanks.length}
          </span>
        )}
        {revealed && (
          <span className="ml-2 self-center text-sm italic text-neutral-600">Answers revealed</span>
        )}
      </div>
    </div>
  );
}
