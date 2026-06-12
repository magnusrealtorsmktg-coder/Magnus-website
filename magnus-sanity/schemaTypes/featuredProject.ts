import {defineField, defineType} from 'sanity'

/** A card in the "Featured Projects" showcase grid. */
export const featuredProject = defineType({
  name: 'featuredProject',
  title: 'Featured Project',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'category', title: 'Category line', type: 'string',
      description: 'The small line above the title, e.g. "Apartments \u00b7 Global City".'}),
    defineField({name: 'tagline', title: 'Tagline', type: 'string',
      description: 'The one-line description, e.g. "Premium 2 & 3 BHK with skyline views".'}),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}, validation: (r) => r.required()}),
    defineField({name: 'order', title: 'Display order', type: 'number', description: 'Position in the grid (lower = first).'}),
  ],
  orderings: [{title: 'Display order', name: 'displayOrder', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'category', media: 'image'}},
})
