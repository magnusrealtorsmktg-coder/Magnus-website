import {defineField, defineType} from 'sanity'

/**
 * A single property listing.
 * Every field here maps directly to what the Magnus website expects,
 * so anything your client edits shows up on the live site after a refresh.
 */
export const property = defineType({
  name: 'property',
  title: 'Property',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Property name',
      type: 'string',
      description: 'e.g. "The Meridian Residences"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first on the site. Leave blank to sort by date.',
    }),
    defineField({
      name: 'tag',
      title: 'Badge / tag',
      type: 'string',
      description: 'The little label shown on the card.',
      options: {
        list: [
          'New Project',
          'Villa',
          'Commercial',
          'For Rent',
          'Investment',
          'Luxury',
          'Plots',
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'city',
      title: 'City / Location',
      type: 'reference',
      to: [{type: 'city'}],
      description: 'Pick the location. Manage the list under "Location (City)". Controls which filter pill shows this property.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'loc',
      title: 'Location text',
      type: 'string',
      description: 'Full location shown on the card, e.g. "Global City, Virar West".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'type',
      title: 'Property type',
      type: 'string',
      description: 'Controls the "Type" filter dropdown.',
      options: {
        list: [
          {title: 'Apartment', value: 'apartment'},
          {title: 'Villa', value: 'villa'},
          {title: 'Penthouse', value: 'penthouse'},
          {title: 'Commercial', value: 'commercial'},
          {title: 'Plot', value: 'plot'},
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'purpose',
      title: 'Purpose',
      type: 'string',
      options: {
        list: [
          {title: 'Buy', value: 'buy'},
          {title: 'Rent', value: 'rent'},
          {title: 'Commercial', value: 'commercial'},
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price label',
      type: 'string',
      description: 'Exactly as it should appear, e.g. "₹ 78L – 1.45 Cr" or "₹ 22,000 / month".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'pmin',
      title: 'Minimum price (number, for the budget filter)',
      type: 'number',
      description:
        'In rupees, no commas. e.g. 7800000 for ₹78L. For rentals use the monthly amount, e.g. 22000.',
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'pmax',
      title: 'Maximum price (number, for the budget filter)',
      type: 'number',
      description: 'In rupees, no commas. If there is a single price, put the same value as the minimum.',
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'hero',
      title: 'Property card image',
      type: 'image',
      description: 'The photo shown on the property card in the listings grid. Also used as the detail-page banner if you do not set a separate landscape image below.',
      options: {hotspot: true},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'detailImage',
      title: 'Detail page image (landscape) — optional',
      type: 'image',
      description: 'The large banner shown when someone opens this property. Use a wide / landscape photo. If left empty, the card image above is used automatically.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'logo',
      title: 'Card logo',
      type: 'image',
      description: 'Small logo shown in the top-right corner of the property card (e.g. the project / developer logo). A transparent PNG works best. Optional.',
    }),
    defineField({
      name: 'desc',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'facts',
      title: 'Key facts',
      type: 'array',
      description: 'The labelled rows in the detail view (e.g. Configuration → 2 & 3 BHK).',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'key', title: 'Label', type: 'string'},
            {name: 'value', title: 'Value', type: 'string'},
          ],
          preview: {
            select: {title: 'key', subtitle: 'value'},
          },
        },
      ],
    }),
    defineField({
      name: 'amen',
      title: 'Amenities',
      type: 'array',
      description: 'The small pills, e.g. Clubhouse, Swimming Pool, etc.',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'gallery',
      title: 'Photo gallery',
      type: 'array',
      description: 'Extra images shown in the detail view.',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'brochure',
      title: 'Brochure (PDF)',
      type: 'file',
      description: 'Optional PDF brochure. When set, a "Download Brochure" button appears on the property page.',
      options: {accept: 'application/pdf'},
    }),
    defineField({
      name: 'video',
      title: '3D / walkthrough video',
      type: 'file',
      description: 'Optional short video (MP4). When set, a "View in 3D" button appears next to the price and plays this video. Keep it short to stay within upload limits.',
      options: {accept: 'video/*'},
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'displayOrder',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'loc', media: 'hero'},
  },
})
