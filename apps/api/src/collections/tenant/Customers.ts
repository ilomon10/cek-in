import { Entitlement, Order, OrderItem, Payment, Product } from '@/payload-types'
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

    {
      name: 'member',
      type: 'group',
      virtual: true,
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'status',
          type: 'text',
        },
        {
          name: 'endAt',
          type: 'date',
        },
        {
          name: 'orderId',
          type: 'number',
        },
        // {
        //   name: 'entitlement',
        //   type: 'relationship',
        //   relationTo: 'entitlements',
        // },
        // {
        //   name: 'order',
        //   type: 'relationship',
        //   relationTo: 'orders',
        // },
        // {
        //   name: 'orderItem',
        //   type: 'relationship',
        //   relationTo: 'order-items',
        // },
        // {
        //   name: 'product',
        //   type: 'relationship',
        //   relationTo: 'products',
        // },
        // {
        //   name: 'payment',
        //   type: 'relationship',
        //   relationTo: 'payments',
        // },
      ],
      hooks: {
        beforeValidate: [
          async function () {
            return {}
          },
        ],
        afterRead: [
          async function ({ siblingData, req, operation }) {
            if (operation === 'read') {
              const orders = await req.payload.find({
                collection: 'orders',
                where: {
                  and: [
                    {
                      customer: {
                        equals: siblingData.id,
                      },
                    },
                    {
                      'items.product.productType': {
                        equals: 'membership',
                      },
                    },
                  ],
                },
                depth: 2,
                populate: {
                  'order-items': {
                    entitlements: true,
                    product: true,
                    productType: true,
                  },
                },
                select: {
                  tenant: false,
                  customer: false,
                },
                sort: '-createdAt',
              })
              const order = orders.docs[0] as Omit<Order, 'customer'> | undefined
              const item = (order?.items?.docs as OrderItem[])?.find(
                ({ productType }) => productType === 'membership',
              )

              const entitlementId = item?.entitlements?.docs?.[0] as number | undefined
              let entitlement = undefined
              if (entitlementId) {
                entitlement = await req.payload.findByID({
                  collection: 'entitlements',
                  id: entitlementId,
                  depth: 1,
                  select: {
                    customer: false,
                  },
                })
              }

              const product = item?.product as Product
              const payment = order?.payments?.docs?.[0] as Omit<Payment, 'customer'>

              return {
                name: product?.name,
                status: entitlement?.status || payment?.status,
                endAt: entitlement?.endAt,
                orderId: order?.id,
              }
            }
            return {}
          },
        ],
      },
    },
  ],
  hooks: {
    beforeDelete: [
      async ({ id, req }) => {
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
            depth: 0,
          })
        }

        // Remove `Entitlements` before delete Customer
        try {
          for (const id of res.entitlements?.docs as number[]) {
            await req.payload.delete({
              collection: 'entitlements',
              id: id,
              depth: 0,
            })
          }
        } catch (err) {
          // no-op
        }

        // Remove `Subscriptions` before delete Customer
        for (const id of res.subscriptions?.docs as number[]) {
          await req.payload.delete({
            collection: 'subscriptions',
            id: id,
            depth: 0,
          })
        }
      },
    ],
  },
}
