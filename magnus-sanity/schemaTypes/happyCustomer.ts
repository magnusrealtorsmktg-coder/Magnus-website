import {defineField, defineType} from 'sanity'

/** A photo in the "Our Happy Customers" gallery on the site. */
export const happyCustomer = defineType({
  name: 'happyCustomer',
  title: 'Happy Customer',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Customer name',
      type: 'string',
      description: 'Shown under the photo, e.g. "Sharma Family".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location (optional)',
      type: 'string',
      description: 'Small line under the name, e.g. "Virar West".',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      description: 'The customer photo. Drag the focus point so faces stay visible when cropped.',
      options: {hotspot: true},
      validation: (r) => r.required(),
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
  preview: {select: {title: 'name', subtitle: 'location', media: 'photo'}},
})
