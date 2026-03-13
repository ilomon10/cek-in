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
      options: [
        { label: 'Cash', value: 'cash' },
        { label: 'Transfer', value: 'transfer' },
        { label: 'QRIS', value: 'qris' },
        { label: 'Other', value: 'other' },
      ],
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
      options: [
        { label: 'Paid', value: 'paid' },
        { label: 'Waiting', value: 'waiting' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
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
