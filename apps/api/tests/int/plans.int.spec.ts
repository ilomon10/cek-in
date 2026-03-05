import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect, afterAll } from 'vitest'
import { Plan, Tag, User } from '@/payload-types'

let payload: Payload

describe('Plans Service', () => {
  let plan: Plan
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('create plans', async () => {
    plan = await payload.create({
      collection: 'plans',
      data: {
        slug: 'test-plan',
        name: 'Test Plan',
        features: [],
      },
    })
    expect(plan).toBeDefined()
    expect(plan.slug).toEqual('test-plan')
    expect(plan.name).toEqual('Test Plan')
  })

  it('fetches plans', async () => {
    const plans = await payload.find({
      collection: 'plans',
      where: {
        or: [{ id: { equals: plan.id } }],
      },
    })
    expect(plans).toBeDefined()
    expect(plans.docs[0]).toBeDefined()
  })

  it('get plans by id', async () => {
    const plans = await payload.findByID({
      collection: 'plans',
      id: plan.id,
    })
    expect(plans).toBeDefined()
  })

  it('delete plan', async () => {
    await payload.delete({
      collection: 'plans',
      id: plan.id,
    })
    const plans = await payload.find({
      collection: 'plans',
      where: {
        or: [{ id: { equals: plan.id } }],
      },
    })
    expect(plans.totalDocs).toEqual(0)
  })
})
