import {defineField, defineType} from 'sanity'

/** Single settings document for the Market Insights section (region-level).
 *  Per-city numbers live on each Location document. */
export const marketInsights = defineType({
  name: 'marketInsights',
  title: 'Market Insights',
  type: 'document',
  fields: [
    defineField({name: 'asOf', title: 'As of (date label)', type: 'string', description: 'e.g. "February 2026".'}),
    defineField({name: 'regionContext', title: 'Region blurb', type: 'text', rows: 3,
      description: 'The "All cities" sentence shown when no specific city is selected.'}),
    defineField({name: 'regionSnapshotTag', title: 'Region snapshot label', type: 'string', description: 'e.g. "Region overview".'}),
    defineField({
      name: 'regionSnapshotStats', title: 'Region snapshot stats', type: 'array',
      description: 'The right-side tiles when "All cities" is selected.',
      of: [{type: 'object', fields: [
        {name: 'value', title: 'Value', type: 'string'},
        {name: 'label', title: 'Label', type: 'string'},
      ], preview: {select: {title: 'value', subtitle: 'label'}}}],
    }),
    defineField({
      name: 'indicators', title: 'Official indicators (left column)', type: 'array',
      description: 'The sourced, official figures (NHB / RBI / IGR etc.).',
      of: [{type: 'object', fields: [
        {name: 'value', title: 'Value', type: 'string'},
        {name: 'label', title: 'Label', type: 'string'},
        {name: 'source', title: 'Source', type: 'string'},
      ], preview: {select: {title: 'value', subtitle: 'label'}}}],
    }),
  ],
  preview: {select: {title: 'asOf'}, prepare: ({title}) => ({title: 'Market Insights', subtitle: title})},
})
