import type { CollectionConfig } from 'payload'

export const Devices: CollectionConfig = {
  slug: 'devices',
  admin: {
    group: 'Platform',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'deviceType',
      type: 'radio',
      options: ['qr_scanner', 'gate', 'tablet'],
      required: true,
    },
    {
      name: 'apiKey',
      type: 'text',
      required: true,
    },
    {
      name: 'lastSeen',
      type: 'date',
    },
    {
      name: 'status',
      type: 'text',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      defaultValue: (props) => {
        const { user, req } = props
        return req.user?.id || user?.id
      },
    },
  ],
}
