import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect, afterAll } from 'vitest'
import { Invitation, Tag, User } from '@/payload-types'

let payload: Payload

describe('Invitations Service', () => {
  let invitation: Invitation
  let tags: Tag[] = []
  let user: User
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
    tags.push(
      await payload.create({
        collection: 'tags',
        data: {
          name: 'test',
          slug: 'test-invitation',
        },
      }),
    )
    user = await payload.create({
      collection: 'users',
      data: {
        email: 'test.invitation@example.com',
        username: 'test.invitation',
        password: 'changeme',
        roles: ['user', 'designer'],
      },
    })
  })

  it('create invitations', async () => {
    invitation = await payload.create({
      collection: 'invitations',
      data: {
        title: 'Test Invitation',
      },
      user: user,
    })
    expect(invitation).toBeDefined()
    expect(invitation.slug).toContain('test-invitation')
    expect(invitation.title).toEqual('Test Invitation')
    expect((invitation.owner as User).username).toEqual('test.invitation')
  })

  it('fetches invitations', async () => {
    const invitations = await payload.find({
      collection: 'invitations',
      where: {
        or: [{ id: { equals: invitation.id } }],
      },
    })
    expect(invitations).toBeDefined()
    expect(invitations.docs[0]).toBeDefined()
  })

  it('get invitations by id', async () => {
    const invitations = await payload.findByID({
      collection: 'invitations',
      id: invitation.id,
    })
    expect(invitations).toBeDefined()
  })

  it('patch invitations with new tags', async () => {
    const invitations = await payload.update({
      collection: 'invitations',
      id: invitation.id,
      data: {
        tags: [tags[0].id, { name: 'Tag Baru', slug: 'tag-baru' }, { name: 'Tag Baru 2' }],
      },
    })
    expect(invitations).toBeDefined()
    expect(invitations.tags?.[0]).toBeDefined()
    expect(invitations.tags?.length).toEqual(3)
    for (let inv of invitations.tags!) {
      tags.push(inv as Tag)
    }
  })

  it('delete invitation', async () => {
    await payload.delete({
      collection: 'invitations',
      id: invitation.id,
    })
    const invitations = await payload.find({
      collection: 'invitations',
      where: {
        or: [{ id: { equals: invitation.id } }],
      },
    })
    expect(invitations.totalDocs).toEqual(0)
  })

  afterAll(async () => {
    await payload.delete({
      collection: 'tags',
      where: {
        id: {
          in: tags.map(({ id }) => id),
        },
      },
    })
    await payload.delete({
      collection: 'users',
      where: {
        id: {
          in: [user.id],
        },
      },
    })
  })
})
