// /schemas/objects/clozeBlock.ts
import { defineType, defineField } from 'sanity';
import type { Rule, ValidationContext } from 'sanity';

const uniqueArrayValidation = (arr?: string[]): true | string => {
  if (!arr || arr.length === 0) return true;
  const set = new Set(arr);
  return set.size === arr.length ? true : 'Word bank must not contain duplicates.';
};

export default defineType({
  name: 'clozeBlock',
  type: 'object',
  title: 'Cloze (single bank, long passage)',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      // was: validation: (rule: Rule) => rule.required(),
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'instructions',
      type: 'text',
      rows: 3,
      initialValue: 'Choose words from the bank. Each word can be used once.',
    }),

    // Pastel background colour picker
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
        layout: 'dropdown',
      },
      initialValue: '#f8fafc',
    }),

    // Single shared word bank
    defineField({
      name: 'bank',
      type: 'array',
      title: 'Word bank',
      description:
        'Include all correct answers plus any distractors. Each word can be used once total.',
      of: [{ type: 'string' }],
      validation: (rule) =>
        rule.custom((arr: unknown): true | string => uniqueArrayValidation(arr as string[])),
    }),

    // Passage parts (inline subtypes: no global registration needed)
    defineField({
      name: 'parts',
      type: 'array',
      title: 'Passage parts (alternate text and blanks)',
      of: [
        {
          type: 'object',
          name: 'clozeTextPart',
          title: 'Text segment',
          fields: [
            defineField({
              name: 'text',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'text' },
            prepare: ({ title }: { title?: string }) => ({
              title: String(title ?? '').slice(0, 80),
            }),
          },
        },
        {
          type: 'object',
          name: 'clozeBlankPart',
          title: 'Blank',
          fields: [
            defineField({
              name: 'answer',
              type: 'string',
              title: 'Correct answer',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'answer' },
            prepare: ({ title }: { title?: string }) => ({
              title: `[${title ?? ''}]`,
            }),
          },
        },
      ],
      validation: (rule) =>
        rule.custom((parts: unknown, ctx: ValidationContext): true | string => {
          const arr =
            (parts as Array<{
              _type: 'clozeTextPart' | 'clozeBlankPart';
              text?: string;
              answer?: string;
            }>) ?? [];

          if (arr.length === 0) return 'Add text and blanks to form the passage.';

          const bank = (ctx?.parent as { bank?: string[] })?.bank ?? [];
          let blanks = 0;
          let wordCount = 0;

          for (const p of arr) {
            if (p._type === 'clozeTextPart') {
              wordCount += (p.text ?? '').trim().split(/\s+/).filter(Boolean).length;
            } else if (p._type === 'clozeBlankPart') {
              blanks++;
              if (bank.length && !bank.includes(p.answer ?? '')) {
                return `Answer "${p.answer}" must be present in the word bank.`;
              }
            }
          }

          if (blanks < 1) return 'Add at least one blank.';
          if (blanks > 30) return 'Too many blanks; keep under 30.';
          if (wordCount && (wordCount < 80 || wordCount > 400))
            return 'Aim for roughly 100–300 words.';

          return true;
        }),
    }),

    defineField({
      name: 'shuffleBank',
      type: 'boolean',
      title: 'Shuffle bank',
      initialValue: true,
    }),
  ],
  preview: { select: { title: 'title' } },
});
