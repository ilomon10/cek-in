import { generateId } from '@/utils/generate-id'
import { generateSimpleHash } from '@/utils/generate-simple-hash'
import { APIError, Endpoint } from 'payload'
import z from 'zod'

const schema = z.object({
  tenant: z.number(),
  name: z.string(),
  phone: z.string(),
  email: z.string().optional(),

  product: z.number(),

  payment: z
    .object({
      paid: z.boolean(),
      method: z.string().optional(),
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
    ),
})

const CreateMembershipHandler: Omit<Endpoint, 'root'> = {
  path: '/membership/create',
  method: 'post',
  handler: async (req) => {
    const raw = await req.json?.()
    const data = schema.parse(raw)
    const tenantId = data.tenant

    const product = await req.payload.findByID({
      collection: 'products',
      id: data.product,
    })

    const customer = await req.payload.create({
      collection: 'customers',
      data: {
        tenant: tenantId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        memberId: `CI${generateSimpleHash(generateId())}`,
      },
    })

    const order = await req.payload.create({
      collection: 'orders',
      data: {
        tenant: tenantId,
        customer: customer.id,
        status: data.payment.paid ? 'paid' : 'pending',
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

    if (data.payment.paid) {
      await req.payload.create({
        collection: 'entitlements',
        data: {
          tenant: tenantId,
          orderItem: orderItem.id,
          product: product.id,
          customer: customer.id,
          status: 'active',
        },
      })
    } else {
    }
    console.log('customer')
    throw new APIError('Not Found', 404)
  },
}

export default CreateMembershipHandler

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
