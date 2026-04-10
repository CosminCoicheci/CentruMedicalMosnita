import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'servicesPage',
  title: 'Servicii medicale',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Titlu secțiune', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitlu', type: 'string' }),
    defineField({
      name: 'services',
      title: 'Servicii',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'icon', title: 'Clasă iconiță', type: 'string' }),
            defineField({ name: 'title', title: 'Titlu serviciu', type: 'string' }),
            // body may contain HTML markup
            defineField({ name: 'body', title: 'Descriere (HTML permis)', type: 'text' }),
          ],
        },
      ],
    }),
  ],
})
