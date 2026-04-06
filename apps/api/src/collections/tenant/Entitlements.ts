import dayjs from 'dayjs'
import type { CollectionConfig } from 'payload'
import { decodeJwt, UnsecuredJWT } from 'jose'

export const Entitlements: CollectionConfig = {
  slug: 'entitlements',
  admin: {
    useAsTitle: 'productName',
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
      hooks: {
        // beforeValidate:
        beforeValidate: [
          async function ({ siblingData, value }) {
            if (value === 'cancelled') {
              return value
            }
            const endAt = dayjs(siblingData.endAt)
            const now = dayjs().endOf('day')
            const diff = endAt.diff(now, 'day')
            if (diff < 0) {
              return 'expired'
            }
            if (siblingData.remainingQuota && siblingData.remainingQuota <= 0) {
              return 'used_up'
            }
            return value
          },
        ],
      },
    },

    {
      name: 'parentId',
      type: 'relationship',
      relationTo: 'entitlements',
      hooks: {
        beforeChange: [
          async function ({ siblingData, value }) {
            return siblingData.id === value ? undefined : value
          },
        ],
      },
    },

    {
      name: 'qrCode',
      type: 'text',
      hooks: {
        beforeChange: [
          async function ({ req, siblingData }) {
            const product = await req.payload.findByID({
              collection: 'products',
              id: siblingData.product,
              select: {
                productType: true,
              },
            })

            const customer = await req.payload.findByID({
              collection: 'customers',
              id: siblingData.customer,
              select: {
                name: true,
                memberId: true,
              },
            })
            const data = {
              member: {
                id: customer.memberId,
                name: customer.name,
              },
              product: {
                type: product.productType,
              },
            }
            const jwt = new UnsecuredJWT(data)
              .setIssuedAt()
              .setExpirationTime(dayjs(siblingData.endAt).unix())
              .encode()

            return jwt
          },
        ],
      },
    },

    {
      name: 'meta',
      type: 'json',
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
      name: 'productType',
      type: 'text',
      virtual: 'product.productType',
      admin: {
        readOnly: true,
      },
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
        // console.log('DELETING ENTITLEMENT')
        const res = await req.payload.findByID({
          collection: 'entitlements',
          id: id,
          depth: 0,
        })

        // console.log('Remove checkin-logs')
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
