import { generateId } from '@/utils/generate-id'
import { APIError, PayloadHandler } from 'payload'
import { slugify } from 'payload/shared'
import z from 'zod'

const dataSchema = z.object({
  name: z.string(),
  plan: z.string().or(z.number()).optional(),
})

type PayloadData = z.infer<typeof dataSchema>

export const TenantCreateHandler: PayloadHandler = async (req) => {
  try {
    const user = req.user
    if (!user) throw new APIError('Not allowed', 403)

    const body = await req.json?.()
    const data = dataSchema.parse(body)

    const tenant = await req.payload.create({
      collection: 'tenants',
      data: {
        name: data.name,
        plan: data.plan as number,
      },
    })

    const tenantUser = await req.payload.create({
      collection: 'tenant-users',
      data: {
        role: 'owner',
        tenant: tenant.id,
        user: user.id,
      },
    })

    return Response.json({
      message: `Create successfully.`,
      doc: tenantUser.tenant,
    })
  } catch (error) {
    console.error('Creating error:', error)
    return Response.json(
      {
        message: 'Creating failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error,
      },
      { status: 500 },
    )
  }
}
