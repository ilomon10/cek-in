import { User } from '@/payload-types'
import { checkRBAC } from '@/utils/check-rbac'
import { Access, Where } from 'payload'

export const canReadPage: Access = (props) => {
  const user = props.req.user
  const id = props.id
  if (!user) return false
  if (user.id === id) return true
  if (checkRBAC(user.roles || [], ['system-admin'])) {
    return true
  }

  let response: Where = {
    or: [
      {
        roles: { not_in: ['system-admin'] },
      },
    ],
  }

  if (checkRBAC(user.roles || [], ['user', 'designer'])) {
    response = {
      or: [{ roles: { not_in: ['system-admin', 'admin'] } }],
    }
  }

  return response
}

export const canCreatePage: Access = (props) => {
  const user = props.req.user
  const id = props.id
  if (!user) {
    const new_user = props.data as User | undefined
    if (!new_user) {
      return false
    }
    if (!checkRBAC(new_user.roles || [], ['system-admin', 'admin'])) {
      return true
    }
    return false
  }

  if (user.id === id) return true
  if (checkRBAC(user.roles || [], ['system-admin'])) {
    return true
  }

  let response: Where = {
    or: [
      {
        roles: { not_in: ['system-admin'] },
      },
    ],
  }

  if (checkRBAC(user.roles || [], ['user', 'designer'])) {
    response = {
      or: [{ roles: { not_in: ['system-admin', 'admin'] } }],
    }
  }

  return response
}
