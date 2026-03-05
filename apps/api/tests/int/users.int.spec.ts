import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'
import { User } from '@/payload-types'

let payload: Payload

describe('Users Service', () => {
  let user: User
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('create users', async () => {
    user = await payload.create({
      collection: 'users',
      data: {
        email: 'test.user@example.com',
        username: 'test.user',
        password: 'changeme',
        roles: ['user'],
      },
    })
    expect(user).toBeDefined()
    expect(user.roles?.[0]).toEqual('user')
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })

  it('get user by id', async () => {
    const users = await payload.findByID({
      collection: 'users',
      id: user.id,
    })
    expect(users).toBeDefined()
  })

  it('delete user', async () => {
    await payload.delete({
      collection: 'users',
      id: user.id,
    })
    const users = await payload.find({
      collection: 'users',
      where: {
        or: [
          {
            id: {
              equals: user.id,
            },
          },
        ],
      },
    })
    expect(users.totalDocs).toEqual(0)
  })
})
