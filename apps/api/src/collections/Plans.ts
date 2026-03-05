import type { CollectionConfig } from 'payload'
import { canReadPage } from './Plans.access'

export const Plans: CollectionConfig = {
  slug: 'plans',
  admin: {
    useAsTitle: 'name',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: canReadPage,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'features',
      type: 'json',
      required: true,
    },
    {
      name: 'priceCents',
      type: 'number',
    },
    {
      name: 'currency',
      type: 'text',
    },
  ],
}
