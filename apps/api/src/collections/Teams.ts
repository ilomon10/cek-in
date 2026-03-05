import type { CollectionConfig } from 'payload'
import { canReadPage } from './Teams.access'

export const Teams: CollectionConfig = {
  slug: 'teams',
  admin: {
    useAsTitle: 'name',
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
      name: 'members',
      type: 'array',
      fields: [
        {
          name: 'role',
          type: 'select',
          hasMany: true,
          defaultValue: 'member',
          options: [
            {
              label: 'Owner',
              value: 'owner',
            },
            {
              label: 'Member',
              value: 'member',
            },
          ],
        },
        {
          name: 'member',
          type: 'relationship',
          relationTo: 'users',
        },
      ],
    },
  ],
}
