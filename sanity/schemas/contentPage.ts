import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'contentPage',
  title: 'Content Page',
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
      name: 'topic',
      title: 'Topic',
      type: 'reference',
      to: [{ type: 'topic' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Lesson order (within Topic)',
      type: 'number',
      description: '1..n within this topic.',
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'outcomes',
      title: 'Outcomes',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'outcome' }] }],
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
        { type: 'callout' },
        { type: 'youtube' },
      ],
    }),
    defineField({
      name: 'duration',
      title: 'Estimated duration (mins)',
      type: 'number',
    }),
  ],
  preview: {
    select: { title: 'title', order: 'order', topicTitle: 'topic.title' },
    prepare({ title, order, topicTitle }) {
      return { title: `${order}. ${title}`, subtitle: topicTitle };
    },
  },
});
