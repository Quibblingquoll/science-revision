export default {
  name: 'stage',
  type: 'document',
  title: 'Stage',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
  ],
}
