import { generateId } from '@/utils/generate-id'
import { generateSimpleHash } from '@/utils/generate-simple-hash'
import { APIError, Endpoint } from 'payload'
import z, { ZodError } from 'zod'

const schema = z.object({
  tenant: z.number(),
  name: z.string(),
  phone: z.string(),
  email: z.string().optional(),

  product: z.number(),
})

const CreateMembershipHandler: Omit<Endpoint, 'root'> = {
  path: '/membership/create',
  method: 'post',
  handler: async (req) => {
    const raw = await req.json?.()
    try {
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
          status: 'pending',
        },
      })

      await req.payload.create({
        collection: 'order-items',
        data: {
          order: order.id,
          product: product.id,
          quantity: 1,
          price: product.price,
        },
      })

      return Response.json({
        success: 'OK',
        message: 'Member was created',
        orderId: order.id,
      })
    } catch (err: unknown) {
      console.log(err)
      if (err instanceof ZodError) {
        throw new APIError('Bad Request.', 400, err.issues)
      } else if (err instanceof Error) {
        throw new APIError(err.message)
      } else {
        throw new APIError('Something went wrong', 500)
      }
    }
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
