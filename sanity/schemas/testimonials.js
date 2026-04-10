import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testimonialsPage',
  title: 'Testimoniale',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Titlu secțiune', type: 'string' }),
    defineField({ name: 'intro', title: 'Text introductiv', type: 'string' }),
    defineField({
      name: 'testimonials',
      title: 'Testimoniale',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'author', title: 'Autor', type: 'string' }),
            defineField({ name: 'role', title: 'Rol / Funcție', type: 'string' }),
            defineField({ name: 'quote', title: 'Citat', type: 'text' }),
            // Image URL resolved via @sanity/image-url in build.js
            defineField({ name: 'image', title: 'Fotografie', type: 'image' }),
          ],
        },
      ],
    }),
  ],
})
