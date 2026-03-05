import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect, afterAll } from 'vitest'
import { Tag, Team, User } from '@/payload-types'

let payload: Payload

describe('Teams Service', () => {
  let team: Team
  let tag: Tag
  let user: User
  let user2: User
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
    user = await payload.create({
      collection: 'users',
      data: {
        email: 'test.team.user@example.com',
        username: 'test.team.user',
        password: 'changeme',
        roles: ['user', 'designer'],
      },
    })
    user2 = await payload.create({
      collection: 'users',
      data: {
        email: 'test.team.user2.team@example.com',
        username: 'test.team.user2',
        password: 'changeme',
        roles: ['user', 'designer'],
      },
    })
  })

  it('create team', async () => {
    team = await payload.create({
      collection: 'teams',
      data: {
        name: 'Test Team',
        members: [
          {
            member: user.id,
            role: ['owner'],
          },
        ],
      },
    })
    team = await payload.update({
      collection: 'teams',
      id: team.id,
      data: {
        members: [
          {
            member: user.id,
          },
          {
            member: user2.id,
          },
        ],
      },
    })
    expect(team).toBeDefined()
    expect(team.name).toEqual('Test Team')
    const users = team.members?.map((member) => member.member) as User[]
    expect((users.find(({ id }) => id === user?.id) as User).username).toEqual('test.team.user')
  })

  it('fetches teams', async () => {
    const teams = await payload.find({
      collection: 'teams',
      where: {
        or: [{ id: { equals: team.id } }],
      },
    })
    expect(teams).toBeDefined()
    expect(teams.docs[0]).toBeDefined()
  })

  it('get team by id', async () => {
    const teams = await payload.findByID({
      collection: 'teams',
      id: team.id,
    })
    expect(teams).toBeDefined()
  })

  it('delete team', async () => {
    await payload.delete({
      collection: 'teams',
      id: team.id,
    })
    const teams = await payload.find({
      collection: 'teams',
      where: {
        or: [{ id: { equals: team.id } }],
      },
    })
    expect(teams.totalDocs).toEqual(0)
  })

  afterAll(async function () {
    await payload.delete({
      collection: 'users',
      id: user.id,
    })
    await payload.delete({
      collection: 'users',
      id: user2.id,
    })
  })
})
