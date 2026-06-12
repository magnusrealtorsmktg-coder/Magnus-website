import {defineField, defineType} from 'sanity'

/** A client review shown in the scrolling testimonials marquee. */
export const review = defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Reviewer name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'initials', title: 'Avatar initials', type: 'string',
      description: 'The 2 letters in the round avatar, e.g. "KB". Leave blank to auto-use the name initials.'}),
    defineField({name: 'quote', title: 'Review text', type: 'text', rows: 3, validation: (r) => r.required()}),
    defineField({name: 'rating', title: 'Star rating', type: 'number',
      description: 'Number of stars (1–5). Leave blank for 5.',
      initialValue: 5,
      validation: (r) => r.min(1).max(5).integer()}),
    defineField({name: 'roleLabel', title: 'Role (optional)', type: 'string', description: 'Small text under the name. Usually left blank.'}),
    defineField({name: 'googleUrl', title: 'Google review link', type: 'url', description: 'The "verify on Google" link. Optional.'}),
    defineField({name: 'order', title: 'Display order', type: 'number'}),
  ],
  orderings: [{title: 'Display order', name: 'displayOrder', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'name', subtitle: 'quote'}},
})
