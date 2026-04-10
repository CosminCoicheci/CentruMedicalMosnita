import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'centru-medical-mosnita',
  title: 'Centrul Medical Moșnița',
  projectId: 'YOUR_PROJECT_ID',   // placeholder — filled in during setup
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
