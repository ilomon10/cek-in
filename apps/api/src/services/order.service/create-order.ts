import { BaseService } from '../baseService'
import { Customer, Order, OrderItem } from '@/payload-types'
import { generateSimpleHash } from '@/utils/generate-simple-hash'
import { generateId } from '@/utils/generate-id'

type Data = {
  name: string
  phone: string
  email?: string

  tenantId: number
  productId: number
}

type CreateOrderEntity = {
  customer: Customer
  order: Order
  orderItems: OrderItem[]
}

type CreateOrderService = BaseService<Data, CreateOrderEntity>

// validate
// create customer
// create order + items
export const createOrder: CreateOrderService = async (req, data) => {
  const product = await req.payload.findByID({
    collection: 'products',
    id: data.productId,
    select: {
      id: true,
      price: true,
    },
  })

  const customer = await req.payload.create({
    collection: 'customers',
    data: {
      tenant: data.tenantId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      memberId: `CI${generateSimpleHash(generateId())}`,
    },
  })

  const order = await req.payload.create({
    collection: 'orders',
    data: {
      tenant: data.tenantId,
      customer: customer.id,
      status: 'pending',
    },
  })

  const orderItem = await req.payload.create({
    collection: 'order-items',
    data: {
      order: order.id,
      product: product.id,
      quantity: 1,
      price: product.price,
    },
  })

  return {
    entity: {
      customer,
      order,
      orderItems: [orderItem],
    },
  }
}
