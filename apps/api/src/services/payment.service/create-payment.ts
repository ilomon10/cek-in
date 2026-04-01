import { Payment } from '@/payload-types'
import { BaseService } from '../baseService'

type Data = {
  orderId: number
  method: Payment['method']
  status?: Payment['status']
}

type CreatePaymentEntity = {
  payment: Payment
}

type CreatePaymentService = BaseService<Data, CreatePaymentEntity, { url: string }>

// create payment record
// integrate gateways
export const createPayment: CreatePaymentService = async (req, data) => {
  const payment = await req.payload.create({
    collection: 'payments',
    data: {
      method: data.method,
      order: data.orderId,
      status: data.status || 'waiting',
    },
  })

  return {
    url: `/payment/${payment.referenceNumber}`,
    entity: {
      payment,
    },
  }
}
