import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'topic',
  title: 'Topic',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      options: {
        list: [
          { title: 'Year 7', value: '7' },
          { title: 'Year 8', value: '8' },
          { title: 'Year 9', value: '9' },
          { title: 'Year 10', value: '10' },
        ],
        layout: 'dropdown',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'term',
      title: 'Term',
      type: 'string',
      options: {
        list: [
          { title: 'Term 1', value: '1' },
          { title: 'Term 2', value: '2' },
          { title: 'Term 3', value: '3' },
          { title: 'Term 4', value: '4' },
        ],
        layout: 'dropdown',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Topic order (within Year/Term)',
      type: 'number',
      description: 'For sorting topics within the same Year & Term (1..n).',
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
    }),
  ],
  preview: {
    select: { title: 'title', year: 'year', term: 'term', order: 'order' },
    prepare({ title, year, term, order }) {
      return { title, subtitle: `Year ${year} • Term ${term} • #${order}` };
    },
  },
});
