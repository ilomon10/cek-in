import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect, afterAll } from 'vitest'
import { Tag, Template, User } from '@/payload-types'

let payload: Payload

describe.only('Templates Service', () => {
  let template: Template
  let tag: Tag
  let user: User
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
    tag = await payload.create({
      collection: 'tags',
      data: {
        name: 'test',
        slug: 'test-template',
      },
    })
    user = await payload.create({
      collection: 'users',
      data: {
        email: 'test.user-template@example.com',
        username: 'test.user-template',
        password: 'changeme',
        roles: ['user', 'designer'],
      },
    })
  })

  it('create templates', async () => {
    template = await payload.create({
      collection: 'templates',
      data: {
        title: 'Test Template',
        tags: [tag.id],
      },
      user: user,
    })
    expect(template).toBeDefined()
    expect(template.slug).toContain('test-template')
    expect(template.title).toEqual('Test Template')
    expect((template.owner as User).username).toEqual('test.user-template')
  })

  it('fetches templates', async () => {
    const templates = await payload.find({
      collection: 'templates',
      where: {
        or: [{ id: { equals: template.id } }],
      },
    })
    expect(templates).toBeDefined()
    expect(templates.docs[0]).toBeDefined()
  })

  it('get template by id', async () => {
    const templates = await payload.findByID({
      collection: 'templates',
      id: template.id,
    })
    expect(templates).toBeDefined()
  })

  it('delete template', async () => {
    await payload.delete({
      collection: 'templates',
      id: template.id,
    })
    const templates = await payload.find({
      collection: 'templates',
      where: {
        or: [{ id: { equals: template.id } }],
      },
    })
    expect(templates.totalDocs).toEqual(0)
  })

  afterAll(async () => {
    await payload.delete({
      collection: 'tags',
      id: tag.id,
    })
    await payload.delete({
      collection: 'users',
      id: user.id,
    })
  })
})
