import {defineField, defineType} from 'sanity'

/** Single settings document: contact details, social links, section intros. */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Hero image (main)',
      type: 'image',
      description: 'The large landscape photo on the right of the top banner. Drag the focus point so the key part stays visible when cropped.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'aboutImageBig',
      title: 'About section — main image',
      type: 'image',
      description: 'The large photo in the "About Magnus" section. Optional.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'aboutImageSmall',
      title: 'About section — small inset image',
      type: 'image',
      description: 'The smaller photo that overlaps the main About image. Optional.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'whyImage',
      title: 'Why Magnus — image',
      type: 'image',
      description: 'The photo shown beside the "Why Magnus" list. Optional.',
      options: {hotspot: true},
    }),
    defineField({name: 'phone', title: 'Phone number', type: 'string',
      description: 'Full international format, e.g. "+919820420547". Used for tap-to-call AND WhatsApp.'}),
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({name: 'instagram', title: 'Instagram URL', type: 'url',
      description: 'Your Instagram profile link. Powers the Instagram icon in the footer.'}),
    defineField({name: 'facebook', title: 'Facebook URL', type: 'url',
      description: 'Your Facebook page link. Powers the Facebook icon in the footer.'}),
    defineField({name: 'linkedin', title: 'LinkedIn URL', type: 'url'}),
    defineField({name: 'youtube', title: 'YouTube URL', type: 'url',
      description: 'Your YouTube channel or video link. Powers the YouTube icon in the footer.'}),
    defineField({name: 'ownerIntro', title: 'Owner section intro', type: 'text', rows: 3,
      description: 'The paragraph under "Meet the Owners".'}),
  ],
  preview: {prepare: () => ({title: 'Site Settings'})},
})
