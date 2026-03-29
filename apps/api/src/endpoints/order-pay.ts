import { OrderItem } from '@/payload-types'
import { generateId } from '@/utils/generate-id'
import { generateSimpleHash } from '@/utils/generate-simple-hash'
import { APIError, Endpoint } from 'payload'
import z from 'zod'

const schema = z
  .object({
    paid: z.boolean().default(false),
    method: z.enum(['cash', 'transfer', 'qris', 'other']).optional(),
  })
  .refine(
    (data) => {
      // ...but require it if paid is true
      if (data.paid === true && !data.method) {
        return false
      }
      return true
    },
    {
      message: 'Method is required when payment is paid',
      path: ['method'], // This puts the error on the 'method' field specifically
    },
  )

const bb = 'A'

const paramsSchema = z.object({
  id: z.coerce.number(),
})

const OrderPayHandler: Omit<Endpoint, 'root'> = {
  path: '/:id/pay',
  method: 'post',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ error: 'forbidden' }, { status: 403 })
    }

    const params = paramsSchema.parse(req.routeParams)
    const orderId = params.id
    const raw = await req.json?.()
    const data = schema.parse(raw)

    const payment = await req.payload.create({
      collection: 'payments',
      data: {
        method: data.method || 'other',
        order: orderId,
        status: data.paid ? 'paid' : 'waiting',
      },
    })

    if (data.paid) {
      const order = await req.payload.update({
        collection: 'orders',
        id: orderId,
        data: {
          status: 'paid',
        },
        depth: 1,
      })
      const items = order.items as OrderItem[]
      for (const item of items) {
        await req.payload.create({
          collection: 'entitlements',
          data: {
            tenant: order.tenant as number,
            customer: order.customer as number,
            orderItem: item.id,
            product: item.product as number,
            status: 'active',
          },
        })
      }
    }

    return Response.json({
      status: 'OK',
      message: 'Payment Created',
      payment,
    })
  },
}

export default OrderPayHandler

// {
//         async onSettled(data) {
//           if (data?.data) {
//             const customer = data.data as unknown as Customer;
//             console.log("customer", customer);
//             const reqOrder = await dataProvider().create({
//               resource: "orders",
//               variables: {
//                 tenant: tenant.id,
//                 customer: customer.id,
//                 status: values.payment.paid ? "paid" : "pending",
//               },
//             });
//             const reqOrderItem = await dataProvider().create({
//               resource: "order-items",
//               variables: {
//                 tenant: tenant.id,
//                 order: reqOrder.data.id,
//                 product: product.id,
//                 quantity: 1,
//                 price: product.price,
//               },
//             });

//             if (values.payment.paid) {
//               await dataProvider().create({
//                 resource: "entitlements",
//                 variables: {
//                   tenant: tenant.id,
//                   customer: customer.id,
//                   product: product.id,
//                   orderItem: reqOrderItem.data.id,
//                   startAt: dayjs(values.startDate, "DD/MM/YYYY").toISOString(),
//                   endAt: dayjs(values.endDate, "DD/MM/YYYY").toISOString(),
//                   status: "active",
//                 },
//               });

//               await dataProvider().create({
//                 resource: "payments",
//                 variables: {
//                   order: reqOrder.data.id,
//                   method: values.payment.method,
//                   status: "paid",
//                   paidAt: new Date().toISOString(),
//                 },
//               });
//             } else {
//               await dataProvider().create({
//                 resource: "payments",
//                 variables: {
//                   order: reqOrder.data.id,
//                   method: values.payment.method,
//                   status: "waiting",
//                 },
//               });
//             }
//             router.replace(`/orgs/${tenantId}/members/edit/${customer.id}`);
//           }
//         },
//       },
