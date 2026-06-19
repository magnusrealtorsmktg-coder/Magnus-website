import {defineField, defineType} from 'sanity'

/** A person in the "Our Team" section (separate from the Owners cards). */
export const ourTeamMember = defineType({
  name: 'ourTeamMember',
  title: 'Our Team',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'role', title: 'Role / title', type: 'string',
      description: 'e.g. "Sales Consultant" or "Client Relations".'}),
    defineField({name: 'photo', title: 'Photo', type: 'image', options: {hotspot: true}, validation: (r) => r.required()}),
    defineField({name: 'bio', title: 'Short bio', type: 'text', rows: 3,
      description: 'Optional. The short paragraph shown when you hover the card.'}),
    defineField({name: 'order', title: 'Display order', type: 'number',
      description: 'Lower numbers appear first.'}),
  ],
  orderings: [{title: 'Display order', name: 'displayOrder', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'name', subtitle: 'role', media: 'photo'}},
})
