// /schemas/objects/clozePasteBlock.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'clozePasteBlock',
  type: 'object',
  title: 'Cloze (paste with [blanks])',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'instructions',
      type: 'text',
      rows: 3,
      initialValue: 'Choose words from the bank. Each word can be used once.',
    }),
    defineField({
      name: 'bgColor',
      type: 'string',
      title: 'Background colour',
      options: {
        list: [
          { title: 'Sky (50)', value: '#f0f9ff' },
          { title: 'Cyan (50)', value: '#ecfeff' },
          { title: 'Emerald (50)', value: '#ecfdf5' },
          { title: 'Lime (50)', value: '#f7fee7' },
          { title: 'Yellow (50)', value: '#fefce8' },
          { title: 'Orange (50)', value: '#fff7ed' },
          { title: 'Rose (50)', value: '#fff1f2' },
          { title: 'Purple (50)', value: '#faf5ff' },
          { title: 'Slate (50)', value: '#f8fafc' },
        ],
      },
      initialValue: '#f8fafc',
    }),
    defineField({
      name: 'passage',
      type: 'text',
      title: 'Passage (use [brackets] for blanks)',
      rows: 10,
      description: 'Example: Science relies on [observations] made using our [senses].',
      validation: (r) =>
        r.custom((val: unknown) => {
          const s = String(val || '');
          const blanks = [...s.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1].trim());
          if (!s.trim()) return 'Paste your passage.';
          if (blanks.length < 1) return 'Add at least one [blank] using square brackets.';
          if (blanks.length > 30) return 'Too many blanks; keep under 30.';
          const words = s.trim().split(/\s+/).length;
          if (words < 80 || words > 400) return 'Aim for roughly 100–300 words.';
          return true;
        }),
    }),
    defineField({
      name: 'distractors',
      type: 'array',
      title: 'Extra word bank items (optional)',
      description: 'Optional extra choices to include in the dropdowns.',
      of: [{ type: 'string' }],
      validation: (r) =>
        r.custom((arr) => {
          if (!Array.isArray(arr)) return true;
          const set = new Set(arr);
          return set.size === arr.length ? true : 'Distractors must be unique.';
        }),
    }),
    defineField({ name: 'shuffleBank', type: 'boolean', initialValue: true, title: 'Shuffle bank' }),
  ],
  preview: { select: { title: 'title' } },
});
