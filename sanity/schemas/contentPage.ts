// /schemas/contentPage.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'contentPage',
  title: 'Content Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'order',
      type: 'number',
      title: 'Order within topic',
      description: 'Used to sort lessons in a topic.',
    }),

    defineField({
      name: 'topic',
      type: 'reference',
      title: 'Topic',
      to: [{ type: 'topic' }],
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' }, // standard Portable Text
        { type: 'figure' }, // custom image object (with caption/credit)
        { type: 'youtube' }, // custom YouTube embed (if present in /objects)
        { type: 'callout' }, // custom callout panel
        { type: 'clozeBlock' }, // ✅ single-bank cloze passage block
        { type: 'clozePasteBlock' },
        {
          type: 'image',
          title: 'Image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              description: 'Short description for accessibility',
              validation: (r) => r.required(),
            },
          ],
        },
      ],
      validation: (r) => r.min(1),
    }),

    defineField({
      name: 'outcomes',
      title: 'Outcomes',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'outcome' }] }],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'topic.title',
    },
  },
});
