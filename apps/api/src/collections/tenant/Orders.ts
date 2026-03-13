import type { CollectionConfig } from 'payload'
import dayjs from 'dayjs'
import { numberToRoman } from '@/utils/number-to-roman'

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
    },

    {
      name: 'invoiceNumber',
      type: 'text',
      required: true,
      minLength: 3,
      hooks: {
        beforeChange: [
          async ({ req }) => {
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
      name: 'seats',
      type: 'join',
      collection: 'seat-reservations',
      on: 'order',
    },

    {
      name: 'payments',
      type: 'join',
      collection: 'payments',
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
