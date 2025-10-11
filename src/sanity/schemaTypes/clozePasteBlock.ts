import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'clozePasteBlock',
  type: 'object',
  title: 'Cloze (Paste Text)',
  fields: [
    defineField({
      name: 'text',
      type: 'text',
      title: 'Source Text',
      description:
        'Paste your paragraph. If you include [brackets], those words become blanks. If not, blanks are auto-selected.',
      rows: 8,
      validation: (Rule) => Rule.required().min(40),
    }),
    defineField({
      name: 'targetBlanks',
      type: 'number',
      title: 'Target blanks (auto mode)',
      description: 'Used only when no [brackets] are found.',
      initialValue: 12,
      validation: (Rule) => Rule.min(4).max(20),
    }),
    defineField({
      name: 'minLen',
      type: 'number',
      title: 'Minimum word length (auto mode)',
      initialValue: 5,
      validation: (Rule) => Rule.min(3).max(12),
    }),
    defineField({
      name: 'caseSensitive',
      type: 'boolean',
      title: 'Case-sensitive marking?',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'text' },
    prepare({ title }) {
      const t = (title || '').replace(/\s+/g, ' ').trim();
      return {
        title: t ? `Cloze: ${t.slice(0, 60)}${t.length > 60 ? '…' : ''}` : 'Cloze (Paste Text)',
      };
    },
  },
});
