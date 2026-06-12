import type {StructureResolver} from 'sanity/structure'

/** Custom Studio layout: friendly groupings + the two settings docs pinned
 *  as single items (so the client can't accidentally create duplicates). */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('property').title('Properties'),
      S.documentTypeListItem('city').title('Locations'),
      S.documentTypeListItem('featuredProject').title('Featured Projects'),
      S.documentTypeListItem('teamMember').title('Team / Owners'),
      S.documentTypeListItem('review').title('Reviews'),
      S.documentTypeListItem('happyCustomer').title('Happy Customers'),
      S.divider(),
      S.listItem()
        .title('Market Insights')
        .id('marketInsights')
        .child(S.document().schemaType('marketInsights').documentId('marketInsights')),
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])
