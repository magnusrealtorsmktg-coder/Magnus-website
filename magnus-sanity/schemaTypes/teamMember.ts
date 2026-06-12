import {defineField, defineType} from 'sanity'

/** A person in the "Meet the Owners" section. */
export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'role', title: 'Role / title', type: 'string',
      description: 'e.g. "Director \u2013 Accounts & Development | Visionary Leader".'}),
    defineField({name: 'photo', title: 'Photo', type: 'image', options: {hotspot: true}, validation: (r) => r.required()}),
    defineField({name: 'bio', title: 'Bio', type: 'text', rows: 3, description: 'The short paragraph shown when you hover the card.'}),
    defineField({name: 'stat', title: 'Stat line', type: 'string', description: 'Small badge, e.g. "15+ yrs \u00b7 Virar".'}),
    defineField({name: 'order', title: 'Display order', type: 'number'}),
  ],
  orderings: [{title: 'Display order', name: 'displayOrder', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'name', subtitle: 'role', media: 'photo'}},
})
