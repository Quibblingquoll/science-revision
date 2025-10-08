// /schemas/objects/crosswordIpuz.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'crosswordIpuz',
  title: 'Crossword (IPUZ)',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({
      name: 'ipuz',
      title: 'IPUZ JSON',
      type: 'text',
      rows: 24,
      description: 'Paste full IPUZ JSON (crossword kind).',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', slugify: (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') }
    })
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) { return { title: `🧩 ${title || 'Crossword (IPUZ)'}` }; }
  }
});
