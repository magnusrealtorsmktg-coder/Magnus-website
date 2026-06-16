import {defineField, defineType} from 'sanity'

/** A card in the "A complete property practice" (Services) grid. */
export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'The small line icon shown above the title.',
      options: {
        list: [
          {title: 'Home', value: 'home'},
          {title: 'House (with door)', value: 'house'},
          {title: 'Briefcase', value: 'briefcase'},
          {title: 'Buildings', value: 'buildings'},
          {title: 'Growth chart', value: 'chart'},
          {title: 'Checklist / verified', value: 'checklist'},
          {title: 'Search / magnifier', value: 'search'},
          {title: 'Location pin', value: 'pin'},
        ],
      },
      initialValue: 'home',
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first.',
    }),
  ],
  orderings: [
    {title: 'Display order', name: 'displayOrder', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {select: {title: 'title', subtitle: 'description'}},
})
