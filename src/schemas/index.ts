import type { ComponentType } from 'react'
import type { SchemaId } from '@/content/schema'
import type { SchemaProps } from './types'
import { PipelineSchema } from './PipelineSchema'
import { ConfiguratorSchema } from './ConfiguratorSchema'
import { McpSchema } from './McpSchema'
import { MonorepoSchema } from './MonorepoSchema'

export type { SchemaProps } from './types'

/** Uno schema SVG per `SchemaId`: `Work`/`ProjectCard` guardano qui, mai
 *  direttamente i singoli componenti, così un nuovo progetto con un
 *  `schema` senza voce corrispondente è un errore di compilazione, non
 *  una card silenziosamente senza disegno. */
export const SCHEMAS: Record<SchemaId, ComponentType<SchemaProps>> = {
  pipeline: PipelineSchema,
  configurator: ConfiguratorSchema,
  mcp: McpSchema,
  monorepo: MonorepoSchema,
}
