import type { CollectionConfig } from 'payload'

export const Entitlements: CollectionConfig = {
  slug: 'entitlements',
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
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Expired', value: 'expired' },
        { label: 'Used Up', value: 'used_up' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
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

    {
      name: 'checkInLogs',
      type: 'join',
      collection: 'checkin-logs',
      on: 'entitlement',
    },
  ],

  hooks: {
    beforeDelete: [
      async ({ id, req, context }) => {
        const res = await req.payload.findByID({
          collection: 'entitlements',
          id: id,
          depth: 0,
        })
        // Remove Checkin Logs before delete entitlement
        for (const id of res.checkInLogs?.docs as number[]) {
          await req.payload.delete({
            collection: 'checkin-logs',
            id: id,
          })
        }
      },
    ],
  },
}
