import { Template } from '@/payload-types'
import { checkRBAC } from '@/utils/check-rbac'
import { Access } from 'payload'

export const canReadPage: Access<Template> = (props) => {
  const user = props.req.user
  if (!user) return false

  if (checkRBAC(user.roles || [], ['admin'])) {
    return true
  }

  // if (checkRBAC(user.roles || [], ['user', 'designer'])) {
  //   return { or: [{ owner: { equals: user.id } }] }
  // }

  return false
}
