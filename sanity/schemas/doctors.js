import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'doctorsPage',
  title: 'Medici / Personal',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Titlu secțiune', type: 'string' }),
    defineField({
      name: 'doctors',
      title: 'Medici',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Nume', type: 'string' }),
            defineField({ name: 'role', title: 'Rol / Specialitate', type: 'string' }),
            defineField({ name: 'description', title: 'Descriere (opțional)', type: 'string' }),
            // Image URL resolved via @sanity/image-url in build.js
            defineField({ name: 'image', title: 'Fotografie', type: 'image' }),
          ],
        },
      ],
    }),
  ],
})
