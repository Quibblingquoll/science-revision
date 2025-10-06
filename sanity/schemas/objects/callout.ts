// schemas/objects/callout.ts
import { defineType, defineField } from 'sanity';
export default defineType({
  name: 'callout',
  title: 'Callout',
  type: 'object',
  fields: [
    defineField({
      name: 'style',
      type: 'string',
      options: { list: ['info', 'tip', 'warning'] },
      initialValue: 'info',
    }),
    defineField({ name: 'text', type: 'text' }),
  ],
  preview: {
    select: { style: 'style', text: 'text' },
    prepare: ({ style, text }) => ({ title: `Callout · ${style}`, subtitle: text }),
  },
});
