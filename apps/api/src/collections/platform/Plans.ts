import type { CollectionConfig } from 'payload'

export const Plans: CollectionConfig = {
  slug: 'plans',
  admin: {
    group: 'Platform',
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      defaultValue: 1,
    },
    {
      name: 'price',
      type: 'number',
    },

    {
      name: 'maxStaff',
      type: 'number',
    },
    {
      name: 'maxProducts',
      type: 'number',
    },
    {
      name: 'maxCheckinsPerMonth',
      type: 'number',
    },

    {
      name: 'features',
      type: 'json',
    },
  ],
}
