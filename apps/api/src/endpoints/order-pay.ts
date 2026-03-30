import { fullfillOrder } from '@/services/entitlement.service/fulfillment-order'
import { createPayment } from '@/services/payment.service/create-payment'
import { APIError, Endpoint } from 'payload'
import z, { ZodError } from 'zod'

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

    try {
      const params = paramsSchema.parse(req.routeParams)
      const orderId = params.id
      const raw = await req.json?.()
      const data = schema.parse(raw)

      const {
        url,
        entity: { payment },
      } = await createPayment(req, {
        method: data.method || 'other',
        orderId: orderId,
      })

      if (data.paid) {
        await fullfillOrder(req, { orderId })
      }

      return Response.json({
        status: 'OK',
        message: 'Payment was Created',
        data: {
          // url,
          paymentId: payment.id,
        },
      })
    } catch (err) {
      console.error(err)
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

export default OrderPayHandler
