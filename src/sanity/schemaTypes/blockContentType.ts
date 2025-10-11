import { defineType, defineArrayMember } from 'sanity';
import { ImageIcon } from '@sanity/icons';

/**
 * Schema for rich “Block Content” used across document types.
 * This version supports headings, quotes, images, links,
 * and the custom Cloze (Paste Text) block.
 */

export const blockContentType = defineType({
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    // ✏️ Standard Portable Text blocks
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [{ title: 'Bullet', value: 'bullet' }],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),

    // 🖼️ Image block
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for accessibility and SEO',
        },
      ],
    }),

    // 🧩 Cloze (Paste Text) block
    defineArrayMember({
      type: 'clozePasteBlock',
      title: 'Cloze (Paste Text)',
    }),
  ],
});
