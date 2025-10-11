// sanity/schemas/contentPage.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'contentPage',
  title: 'Content Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
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
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'hero',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt text' },
        { name: 'credit', type: 'string', title: 'Credit' },
      ],
    }),

    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'array',
      of: [{ type: 'block' }],
    }),

    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'figure' },
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
              validation: (Rule) => Rule.required(),
            },
          ],
        },
        { type: 'callout' },
        { type: 'clozePasteBlock' }, // ✅ Cloze (Paste Text) block
      ],
    }),

    defineField({
      name: 'outcomes',
      title: 'Outcomes',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'outcome' }] }],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'topic.title', media: 'hero' },
  },
});
