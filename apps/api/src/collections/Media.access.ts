import { Media } from '@/payload-types'
import { checkRBAC } from '@/utils/check-rbac'
import { Access, AccessResult } from 'payload'

export const canReadPage: Access<Media> = (props): AccessResult => {
  const pathname = props.req.pathname
  const user = props.req.user
  const filename = props.data?.filename
  if (filename) return true
  if (!user) return false
  if (pathname.indexOf('media') === -1) {
    return true
  }

  if (checkRBAC(user.roles || [], ['system-admin'])) {
    return true
  }
  const routeParams = props.req.routeParams
  const collection = routeParams?.collection

  if (checkRBAC(user.roles || [], ['admin'])) {
    // Read
    return { or: [{ 'owner.roles': { not_in: ['system-admin'] } }] }
  }

  if (checkRBAC(user.roles || [], ['user', 'designer'])) {
    // Read
    const query: AccessResult = {
      or: [
        { 'owner.roles': { not_in: ['system-admin'] } },
        { 'owner.roles': { not_in: ['admin'] } },
        // { 'tags.name': { equals: 'thumbnail' } },
      ],
    }
    if (collection === 'media') {
      query['owner.id'] = {
        in: [user.id],
      }
    }

    return query
  }

  return false
}
