import type { CollectionConfig, PaginatedDocs } from 'payload'
import dayjs from 'dayjs'
import { numberToRoman } from '@/utils/number-to-roman'
import { OrderItem } from '@/payload-types'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'invoiceNumber',
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
      name: 'items',
      type: 'join',
      collection: 'order-items',
      on: 'order',
      maxDepth: 2,
    },

    {
      name: 'invoiceNumber',
      type: 'text',
      required: true,
      minLength: 3,
      hooks: {
        beforeChange: [
          async ({ req, value }) => {
            if (value) {
              return value
            }
            const lastInvoice = await req.payload.find({
              collection: 'orders',
              limit: 1,
            })
            const currentDate = dayjs()
            const invNo = `INV/${currentDate.format('YYYYMMDD')}/${numberToRoman(Number(currentDate.format('MM')))}/${lastInvoice.totalDocs + 1}`
            return invNo
          },
        ],
      },
    },
    {
      name: 'totalAmount',
      type: 'number',
      virtual: true,
      admin: {
        readOnly: true,
      },
      hooks: {
        afterRead: [
          async function ({ siblingData, req }) {
            const doc = await req.payload.findByID({
              collection: 'orders',
              id: siblingData.id,
              depth: 1,
              select: { items: true },
              populate: { 'order-items': { price: true } },
            })
            if (!doc) {
              return 0
            }
            const items = doc.items as PaginatedDocs<OrderItem>
            const result = items.docs.reduce((prev, curr) => {
              return prev + (curr.price || 0)
            }, 0)
            return result
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'radio',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
      ],
      defaultValue: 'pending',
    },

    {
      name: 'meta',
      type: 'json',
    },

    {
      name: 'payments',
      type: 'join',
      collection: 'payments',
      on: 'order',
    },

    {
      name: 'seats',
      type: 'join',
      collection: 'seat-reservations',
      on: 'order',
    },
  ],
  hooks: {
    beforeDelete: [
      async ({ id, req }) => {
        const res = await req.payload.findByID({
          collection: 'orders',
          id: id,
          depth: 0,
        })

        // Remove Order Items before delete Order
        for (const id of res.items?.docs as number[]) {
          await req.payload.delete({
            collection: 'order-items',
            id: id,
          })
        }

        // Remove Seats before delete Order
        for (const id of res.seats?.docs as number[]) {
          await req.payload.delete({
            collection: 'seat-reservations',
            id: id,
          })
        }

        // Remove Payments before delete Order
        for (const id of res.payments?.docs as number[]) {
          await req.payload.delete({
            collection: 'payments',
            id: id,
          })
        }
      },
    ],
  },
}
