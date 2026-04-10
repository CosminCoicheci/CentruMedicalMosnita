import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'site',
  title: 'Setări site',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Titlu pagină', type: 'string' }),
    defineField({ name: 'sitename', title: 'Nume site', type: 'string' }),
    defineField({ name: 'phone1', title: 'Telefon 1', type: 'string' }),
    defineField({ name: 'phone2', title: 'Telefon 2', type: 'string' }),
    defineField({
      name: 'nav',
      title: 'Navigație',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Etichetă', type: 'string' }),
            defineField({ name: 'href', title: 'Link', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({ name: 'headline', title: 'Titlu principal', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtitlu', type: 'string' }),
        defineField({ name: 'heroImage', title: 'Imagine hero', type: 'image' }),
        defineField({ name: 'whyTitle', title: 'Titlu secțiune De ce', type: 'string' }),
        defineField({ name: 'whyBody', title: 'Text secțiune De ce', type: 'text' }),
        defineField({ name: 'learnMoreLabel', title: 'Etichetă buton Află mai mult', type: 'string' }),
        defineField({
          name: 'iconBoxes',
          title: 'Casete cu icoane',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'icon', title: 'Clasă iconiță', type: 'string' }),
                defineField({ name: 'title', title: 'Titlu', type: 'string' }),
                defineField({ name: 'text', title: 'Text', type: 'string' }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'about',
      title: 'Despre noi',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Titlu', type: 'string' }),
        defineField({ name: 'intro', title: 'Introducere', type: 'text' }),
        defineField({ name: 'image', title: 'Imagine', type: 'image' }),
        defineField({
          name: 'items',
          title: 'Elemente listă',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'icon', title: 'Clasă iconiță', type: 'string' }),
                defineField({ name: 'title', title: 'Titlu', type: 'string' }),
                defineField({ name: 'text', title: 'Text', type: 'string' }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Titlu', type: 'string' }),
        defineField({ name: 'description', title: 'Descriere', type: 'text' }),
        defineField({ name: 'mapSrc', title: 'URL hartă Google Maps (embed)', type: 'string' }),
      ],
    }),
    defineField({ name: 'formReceivingEmail', title: 'Email primire formulare', type: 'string' }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        defineField({ name: 'sitename', title: 'Nume site', type: 'string' }),
        defineField({ name: 'address', title: 'Adresă', type: 'text' }),
        defineField({ name: 'phoneFix', title: 'Telefon fix', type: 'string' }),
        defineField({ name: 'phoneMobil', title: 'Telefon mobil', type: 'string' }),
        defineField({ name: 'linksTitle1', title: 'Titlu coloană linkuri 1', type: 'string' }),
        defineField({
          name: 'links1',
          title: 'Linkuri coloană 1',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'label', title: 'Etichetă', type: 'string' }),
                defineField({ name: 'href', title: 'Link', type: 'string' }),
              ],
            },
          ],
        }),
        defineField({ name: 'linksTitle2', title: 'Titlu coloană linkuri 2', type: 'string' }),
        defineField({
          name: 'links2',
          title: 'Linkuri coloană 2',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({ name: 'label', title: 'Etichetă', type: 'string' }),
                defineField({ name: 'href', title: 'Link', type: 'string' }),
              ],
            },
          ],
        }),
        defineField({ name: 'copyright', title: 'Text copyright', type: 'string' }),
        defineField({ name: 'credits', title: 'Credite', type: 'string' }),
      ],
    }),
  ],
})
