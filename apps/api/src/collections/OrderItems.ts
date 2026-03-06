import type { CollectionConfig } from 'payload'

export const OrderItems: CollectionConfig = {
  slug: 'order-items',
  fields: [
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
    },

    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'quantity',
      type: 'number',
      defaultValue: 1,
    },
    {
      name: 'price',
      type: 'number',
    },

    {
      name: 'meta',
      type: 'json',
    },
  ],
}
