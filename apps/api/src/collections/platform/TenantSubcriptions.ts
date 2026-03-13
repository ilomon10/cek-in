import type { CollectionConfig } from 'payload'

export const TentantSubscriptions: CollectionConfig = {
  slug: 'tentant-subscriptions',
  admin: {
    group: 'Platform',
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'planName',
      type: 'text',
      required: true,
      minLength: 3,
    },
    {
      name: 'maxMembers',
      type: 'number',
    },
    {
      name: 'maxEvents',
      type: 'number',
    },
    {
      name: 'maxStaff',
      type: 'number',
    },
    {
      name: 'price',
      type: 'number',
    },

    {
      name: 'status',
      type: 'text',
    },

    {
      name: 'meta',
      type: 'json',
    },
  ],
}
