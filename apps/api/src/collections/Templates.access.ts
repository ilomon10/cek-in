import { Template } from '@/payload-types'
import { checkRBAC } from '@/utils/check-rbac'
import { Access } from 'payload'

export const canReadPage: Access<Template> = (props) => {
  const user = props.req.user
  if (!user) return false
  if (checkRBAC(user.roles || [], ['admin'])) {
    return true
  }

  if (checkRBAC(user.roles || [], ['user', 'designer'])) {
    return {
      or: [
        {
          owner: { equals: user.id },
        } as any,
        {
          visibility: { equals: 'public' },
        } as any,
      ],
    }
  }

  return false
}
export const canUpdatePage: Access<Template> = (props) => {
  const user = props.req.user
  const id = props.id
  const data = props.data
  if (!user) return false
  if (checkRBAC(user.roles || [], ['admin'])) {
    return true
  }

  if (checkRBAC(user.roles || [], ['user', 'designer'])) {
    if (id && data) {
      // Patch
      return true
    }
    return { or: [{ owner: { equals: user.id } }] }
  }

  return false
}

export const accessStrictByRole: Access = (props) => {
  const user = props.req.user
  const id = props.id
  const data = props.data
  if (!user) return false

  if (checkRBAC(user.roles || [], ['admin'])) {
    return true
  }
  if (checkRBAC(user.roles || [], ['user', 'designer'])) {
    if (id && data) {
      // Patch
      return true
    }
    // Read
    return {
      owner: {
        equals: user.id,
      },
    }
  }
  return false
}
