import type { CollectionConfig } from 'payload'

export const CheckInLogs: CollectionConfig = {
  slug: 'checkin-logs',
  fields: [
    {
      name: 'tentant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
    },

    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
    },
    {
      name: 'entitlement',
      type: 'relationship',
      relationTo: 'entitlements',
      required: true,
    },

    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'deviceId',
      type: 'text',
    },

    {
      name: 'status',
      type: 'radio',
      options: ['success', 'rejected'],
      required: true,
      defaultValue: 'active',
    },

    {
      name: 'note',
      type: 'text',
    },

    {
      name: 'meta',
      type: 'json',
    },
  ],
}
