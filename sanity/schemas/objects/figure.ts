// schemas/objects/figure.ts
import { defineType, defineField } from 'sanity'
export default defineType({
  name: 'figure',
  title: 'Figure',
  type: 'object',
  fields: [
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'alt', type: 'string', validation: r => r.required() }),
    defineField({ name: 'caption', type: 'string' }),
    defineField({
      name: 'credit', type: 'string',
      description: 'Source/attribution'
    }),
    defineField({
      name: 'maxWidth',
      type: 'string',
      options: { list: ['narrow', 'wide', 'full'] },
      initialValue: 'wide'
    }),
  ],
  preview: {
    select: { title: 'caption', media: 'image' },
    prepare: ({ title, media }) => ({ title: title || 'Figure', media }),
  },
})
