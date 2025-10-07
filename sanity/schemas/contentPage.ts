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

    // 👇 Add back this slug
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

    // 👇 Keep the order field for sequencing inside a topic
    defineField({
      name: 'order',
      type: 'number',
      title: 'Order within topic',
      description: 'Used to sort lessons in a topic.',
    }),

    // 👇 Keep the topic reference so this page belongs to a topic
    defineField({
      name: 'topic',
      type: 'reference',
      title: 'Topic',
      to: [{ type: 'topic' }],
      validation: (r) => r.required(),
    }),

    // Keep hero, summary, content, etc. below
    defineField({
      name: 'hero',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string' },
        { name: 'credit', type: 'string' },
      ],
    }),

    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'array',
      of: [{ type: 'block' }],
    }),

    // inside fields: [...]
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'figure' },
        {
          type: 'image', // 👈 image type
          title: 'Image',
          options: { hotspot: true }, // 👈 correct place for hotspot
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
        // in contentPage.ts (or equivalent), add to `content` array types:
        { type: 'crosswordIpuz' },
      ],
    }),

    defineField({
      name: 'outcomes',
      title: 'Outcomes',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'outcome' }] }],
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'topic.title', media: 'hero' } },
});
