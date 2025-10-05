import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'outcome',
  title: 'Outcome',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      title: 'Code',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    // 🆕 Category field (Knowledge or Skills)
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Knowledge', value: 'knowledge' },
          { title: 'Skills', value: 'skills' },
        ],
        layout: 'radio', // or 'dropdown' if you prefer
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
  ],

  preview: {
    select: { title: 'code', subtitle: 'category' },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? subtitle.charAt(0).toUpperCase() + subtitle.slice(1) : '',
      };
    },
  },
});
