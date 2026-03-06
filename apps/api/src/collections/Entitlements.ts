import type { CollectionConfig } from 'payload'

export const Entitlements: CollectionConfig = {
  slug: 'entitlements',
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
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'orderItem',
      type: 'relationship',
      relationTo: 'order-items',
      required: true,
    },

    {
      name: 'startAt',
      type: 'date',
    },
    {
      name: 'endAt',
      type: 'date',
    },

    {
      name: 'remainingQuota',
      type: 'number',
    },

    {
      name: 'status',
      type: 'radio',
      options: ['active', 'expired', 'used_up', 'cancelled'],
      required: true,
      defaultValue: 'active',
    },

    {
      name: 'qrCode',
      type: 'text',
    },

    {
      name: 'meta',
      type: 'json',
    },
  ],
}
