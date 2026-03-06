import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  fields: [
    {
      name: 'tenant',
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
      name: 'items',
      type: 'join',
      collection: 'order-items',
      on: 'order',
    },

    {
      name: 'invoiceNumber',
      type: 'text',
      required: true,
      minLength: 3,
    },
    {
      name: 'totalAmount',
      type: 'number',
    },
    {
      name: 'status',
      type: 'radio',
      options: ['pending', 'paid', 'cancelled', 'refunded'],
      defaultValue: 'pending',
    },

    {
      name: 'meta',
      type: 'json',
    },
  ],
}
