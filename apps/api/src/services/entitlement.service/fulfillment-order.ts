import { Customer, Entitlement, Order, OrderItem, Product, Tenant } from '@/payload-types'
import { BaseService } from '../baseService'
import { getPayload } from 'payload'
import config from '@payload-config'
import dayjs from 'dayjs'

type Data = {
  orderId: number
}

type FullfillOrderEntity = {
  order: Order
  entitlements: Entitlement[]
}

type FullfillOrderService = BaseService<Data, FullfillOrderEntity>

export const fullfillOrder: FullfillOrderService = async (req, data) => {
  const payload = await getPayload({ config })
  const order = await payload.findByID({
    collection: 'orders',
    id: data.orderId,
    depth: 2,
    populate: {
      tenants: {},
      customers: {},
      'order-items': {
        product: true,
      },
    },
    // select: {
    //   tenant: true,
    //   customer: true,
    //   items: true,
    // },
  })

  await payload.update({
    collection: 'orders',
    id: data.orderId,
    data: {
      status: 'paid',
    },
    depth: 1,
  })
  console.log('fulfillOrder', order)

  const entitlements: Entitlement[] = []

  const items = (order.items?.docs as OrderItem[]) || []
  for (const item of items) {
    const product = item.product as Product
    console.log(`ITEM PRODUCT ${item.id}`, product)
    const now = dayjs()
    const entitlement = await payload.create({
      collection: 'entitlements',
      data: {
        tenant: (order.tenant as Tenant).id,
        customer: (order.customer as Customer).id,
        orderItem: item.id,
        product: product.id,
        status: 'active',
        startAt: now.toISOString(),
        endAt: now.add(product.config!.duration_days as number, 'day').toISOString(),
      },
    })
    entitlements.push(entitlement)
  }

  return {
    entity: {
      order,
      entitlements,
    },
  }
}
