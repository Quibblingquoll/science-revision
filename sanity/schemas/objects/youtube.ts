import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'youtube',
  title: 'YouTube Video',
  type: 'object',
  fields: [
    defineField({ name: 'url', title: 'URL', type: 'url', validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'start', title: 'Start at (s)', type: 'number' }),
  ],
});
