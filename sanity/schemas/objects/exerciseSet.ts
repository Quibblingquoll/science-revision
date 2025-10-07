// /schemas/objects/exerciseSet.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'exerciseSet',
  title: 'Exercise Set',
  type: 'object',
  fields: [
    defineField({
      name: 'cloze',
      title: 'Cloze passage',
      type: 'text',
      rows: 8,
      description: 'Mark blanks like [[word]].',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'wordBank',
      title: 'Word bank',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'clozePdf',
      title: 'A5 Cloze PDF (download)',
      type: 'file',
      options: { accept: 'application/pdf' },
    }),
    defineField({
      name: 'answersPdf',
      title: 'Answers PDF (subscribers only)',
      type: 'file',
      options: { accept: 'application/pdf' },
      description: 'Uploaded answers; only shown to paid users.',
    }),
  ],
});
