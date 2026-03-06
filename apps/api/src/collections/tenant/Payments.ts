import type { CollectionConfig } from 'payload'

export const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    group: 'Platform',
  },
  fields: [
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
    },

    {
      name: 'method',
      type: 'radio',
      options: ['cash', 'transfer'],
      required: true,
      defaultValue: 'cash',
    },

    {
      name: 'amount',
      type: 'number',
    },

    {
      name: 'price',
      type: 'number',
    },

    {
      name: 'status',
      type: 'radio',
      options: ['paid', 'waiting', 'cancelled'],
      required: true,
      defaultValue: 'waiting',
    },

    {
      name: 'paidAt',
      type: 'date',
    },

    {
      name: 'referenceNumber',
      type: 'text',
    },

    {
      name: 'meta',
      type: 'json',
    },
  ],
}
