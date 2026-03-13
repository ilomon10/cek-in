import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'memberId',
      type: 'text',
      unique: true,
      required: true,
      minLength: 4,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      minLength: 3,
    },
    {
      name: 'email',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'gender',
      type: 'radio',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
    },
    {
      name: 'birthDate',
      type: 'date',
    },

    {
      name: 'avatarAsset',
      label: 'Avatar Asset',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'meta',
      type: 'json',
    },

    {
      name: 'entitlements',
      type: 'join',
      collection: 'entitlements',
      on: 'customer',
    },

    {
      name: 'orders',
      type: 'join',
      collection: 'orders',
      on: 'customer',
      admin: {
        defaultColumns: ['invoiceNumber', 'status', 'items', 'totalAmount'],
      },
    },

    {
      name: 'subscriptions',
      type: 'join',
      collection: 'subscriptions',
      on: 'customer',
      admin: {
        defaultColumns: ['invoiceNumber', 'status', 'items', 'totalAmount'],
      },
    },

    {
      name: 'checkInLogs',
      type: 'join',
      collection: 'checkin-logs',
      on: 'customer',
      admin: {
        defaultColumns: ['invoiceNumber', 'status', 'items', 'totalAmount'],
      },
    },
  ],
  hooks: {
    beforeDelete: [
      async ({ id, req, context }) => {
        const res = await req.payload.findByID({
          collection: 'customers',
          id: id,
          depth: 0,
        })
        // Remove `Orders` before delete Customer
        for (const id of res.orders?.docs as number[]) {
          await req.payload.delete({
            collection: 'orders',
            id: id,
          })
        }

        // Remove `Orders` before delete Customer
        for (const id of res.entitlements?.docs as number[]) {
          await req.payload.delete({
            collection: 'entitlements',
            id: id,
          })
        }

        // Remove `Subscriptions` before delete Customer
        for (const id of res.subscriptions?.docs as number[]) {
          await req.payload.delete({
            collection: 'subscriptions',
            id: id,
          })
        }
      },
    ],
  },
}
