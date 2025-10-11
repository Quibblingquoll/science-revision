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

function splitWithBrackets(text: string): Part[] {
  const parts: Part[] = [];
  const regex = /\[([^\]]+)\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let idx = 0;

  while ((m = regex.exec(text))) {
    if (m.index > last) parts.push({ type: 'text', value: text.slice(last, m.index) });
    const answer = m[1].trim();
    parts.push({ type: 'blank', answer, idx: idx++ });
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) });
  return parts;
}

function autoBlank(text: string, target = 12, minLen = 5): Part[] {
  const tokens = Array.from(text.matchAll(/(\p{L}[\p{L}\p{M}'-]*|\s+|[^\s\p{L}\p{M}])/gu)).map(
    (t) => t[0]
  );
  const wordIndices: number[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (/^\p{L}[\p{L}\p{M}'-]*$/u.test(tok)) {
      const base = tok.toLowerCase();
      if (tok.length >= minLen && !STOPWORDS.has(base) && !seen.has(base)) {
        wordIndices.push(i);
        seen.add(base);
      }
    }
  }

  if (wordIndices.length === 0) return [{ type: 'text', value: text }];

  const pickCount = Math.min(target, wordIndices.length);
  const picks = new Set<number>();
  for (let p = 0; p < pickCount; p++) {
    const pos = Math.round((p / Math.max(1, pickCount - 1)) * (wordIndices.length - 1));
    picks.add(wordIndices[pos]);
  }

  const parts: Part[] = [];
  let blankIdx = 0;
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (/^\p{L}[\p{L}\p{M}'-]*$/u.test(tok) && picks.has(i)) {
      parts.push({ type: 'blank', answer: tok, idx: blankIdx++ });
    } else {
      const lastPart = parts[parts.length - 1];
      if (lastPart?.type === 'text') {
        (lastPart as Extract<Part, { type: 'text' }>).value += tok;
      } else {
        parts.push({ type: 'text', value: tok });
      }
    }
  }
  return parts;
}

export default function ClozePasteBlock({ value }: { value: ClozeValue }) {
  const { text, targetBlanks = 12, minLen = 5, caseSensitive = false } = value;

  const parts = useMemo<Part[]>(() => {
    const hasBrackets = /\[[^\]]+\]/.test(text);
    return hasBrackets ? splitWithBrackets(text) : autoBlank(text, targetBlanks, minLen);
  }, [text, targetBlanks, minLen]);

  const blankCount = parts.filter((p) => p.type === 'blank').length;
  const [inputs, setInputs] = useState<string[]>(Array(blankCount).fill(''));
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const norm = (s: string) => (caseSensitive ? s : s.toLowerCase().trim());
  const score = checked
    ? parts.reduce((acc, p) => {
        if (p.type !== 'blank') return acc;
        const ok = norm(inputs[p.idx] || '') === norm(p.answer);
        return acc + (ok ? 1 : 0);
      }, 0)
    : 0;

  const onChange = (i: number, v: string) => {
    const next = inputs.slice();
    next[i] = v;
    setInputs(next);
  };

  const onCheck = () => {
    setChecked(true);
    setRevealed(false);
  };

  const onReveal = () => {
    const filled = parts
      .filter((p): p is Extract<Part, { type: 'blank' }> => p.type === 'blank')
      .map((p) => p.answer);
    setInputs(filled);
    setRevealed(true);
    setChecked(false);
  };

  const onReset = () => {
    setInputs(Array(blankCount).fill(''));
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
            <input
              key={i}
              type="text"
              inputMode="text"
              value={inputs[p.idx] ?? ''}
              onChange={(e) => onChange(p.idx, e.target.value)}
              className={[
                'mx-1 px-2 border-b outline-none bg-transparent',
                'focus:border-black',
                checked
                  ? norm(inputs[p.idx] || '') === norm(p.answer)
                    ? 'border-green-600'
                    : 'border-red-600'
                  : 'border-gray-400',
              ].join(' ')}
              style={{ width: `${Math.min(Math.max(p.answer.length + 1, 6), 18)}ch` }}
              aria-label={`Blank ${p.idx + 1}`}
            />
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
            Score: <strong>{score}</strong> / {blankCount}
          </span>
        )}
        {revealed && <span className="ml-2 self-center text-sm italic">Answers revealed</span>}
      </div>
    </div>
  );
}
