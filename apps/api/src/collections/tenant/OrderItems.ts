import type { CollectionConfig } from 'payload'

export const OrderItems: CollectionConfig = {
  slug: 'order-items',
  admin: {
    useAsTitle: 'productName',
  },
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
      name: 'invoiceNumber',
      type: 'text',
      virtual: 'order.invoiceNumber',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'productName',
      type: 'text',
      virtual: 'product.name',
      admin: {
        readOnly: true,
      },
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
