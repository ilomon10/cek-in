import type { CollectionConfig } from 'payload'
import { canAccessAdminPage } from './Tags.access'
import { canReadPage } from './Tags.access'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: canReadPage,
    admin: canAccessAdminPage,
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
      unique: true,
      required: true,
      index: true,
    },
  ],
}
