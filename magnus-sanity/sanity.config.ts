import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

const singletons = ['marketInsights', 'siteSettings']

export default defineConfig({
  name: 'default',
  title: 'Magnus Realtors',

  // Replace these two values with your own (printed when you run `sanity init`).
  projectId: '93f80h7a',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    // keep the two settings docs out of the global "create new" menu
    templates: (prev) => prev.filter((t) => !singletons.includes(t.schemaType)),
  },

  document: {
    // hide "Delete"/"Duplicate" type actions on the singletons
    actions: (prev, {schemaType}) =>
      singletons.includes(schemaType)
        ? prev.filter(({action}) => action !== 'unpublish' && action !== 'delete' && action !== 'duplicate')
        : prev,
  },
})
