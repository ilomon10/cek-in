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

    {
      name: 'entitlements',
      type: 'join',
      collection: 'entitlements',
      on: 'orderItem',
    },
  ],
  hooks: {
    beforeDelete: [
      async ({ id, req, context }) => {
        const res = await req.payload.findByID({
          collection: 'order-items',
          id: id,
          depth: 0,
        })

        // Remove Tenant Users before delete Tenant
        for (const id of res.entitlements?.docs as number[]) {
          await req.payload.delete({
            collection: 'entitlements',
            id: id,
          })
        }
      },
    ],
  },
}
