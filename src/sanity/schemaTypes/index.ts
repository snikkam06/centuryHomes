import { type SchemaTypeDefinition } from 'sanity'

import project from './project'
import settings from './settings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, settings],
}
