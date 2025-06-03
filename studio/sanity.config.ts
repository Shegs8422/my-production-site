import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'My Portfolio Content',

  projectId: 'tq8k2gol',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool({
      defaultApiVersion: 'v2021-03-25',
      defaultDataset: 'production',
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})

