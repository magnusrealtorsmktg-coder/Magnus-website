import {defineField, defineType} from 'sanity'

/** A city / location. Adding one here creates a new filter pill and makes it
 *  selectable on properties. Also holds that city's market blurb + snapshot. */
export const city = defineType({
  name: 'city',
  title: 'Location (City)',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'City name', type: 'string', description: 'e.g. "Virar"', validation: (r) => r.required()}),
    defineField({
      name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name'},
      description: 'Auto-generated from the name. Used internally for filtering.',
      validation: (r) => r.required(),
    }),
    defineField({name: 'order', title: 'Display order', type: 'number', description: 'Order of the filter pills (lower = first).'}),
    defineField({name: 'marketContext', title: 'Market blurb', type: 'text', rows: 3,
      description: 'The sentence shown under "What\u2019s shaping <city>" in Market Insights.'}),
    defineField({name: 'snapshotTag', title: 'Snapshot label', type: 'string',
      description: 'e.g. "Virar \u2014 high growth". Shown as the local-snapshot heading.'}),
    defineField({
      name: 'snapshotStats', title: 'Local snapshot stats', type: 'array',
      description: 'The 4 indicative stat tiles on the right of Market Insights.',
      of: [{type: 'object', fields: [
        {name: 'value', title: 'Value', type: 'string'},
        {name: 'label', title: 'Label', type: 'string'},
      ], preview: {select: {title: 'value', subtitle: 'label'}}}],
    }),
  ],
  orderings: [{title: 'Display order', name: 'displayOrder', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'name', subtitle: 'snapshotTag'}},
})
