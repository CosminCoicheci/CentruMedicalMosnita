import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'galleryPage',
  title: 'Galerie foto',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Titlu secțiune', type: 'string' }),
    defineField({ name: 'description', title: 'Descriere', type: 'string' }),
    defineField({
      name: 'images',
      title: 'Imagini',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            // Image URL resolved via @sanity/image-url in build.js
            defineField({ name: 'path', title: 'Imagine', type: 'image' }),
            defineField({ name: 'caption', title: 'Legendă (opțional)', type: 'string' }),
          ],
        },
      ],
    }),
  ],
})
