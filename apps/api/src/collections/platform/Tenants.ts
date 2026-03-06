import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    group: 'Platform',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
    },
    {
      name: 'status',
      type: 'radio',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Suspended',
          value: 'suspended',
        },
        {
          label: 'Trial',
          value: 'trial',
        },
      ],
    },
    {
      name: 'plan',
      type: 'relationship',
      relationTo: 'plans',
    },
    {
      name: 'logoAsset',
      label: 'Logo Asset',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'subscription_plan',
      type: 'text',
    },

    {
      name: 'meta',
      type: 'json',
    },
    {
      name: 'isDeleted',
      type: 'checkbox',
    },
    {
      name: 'deletedAt',
      type: 'date',
    },
  ],
}
