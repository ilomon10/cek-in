import { Tag } from '@/payload-types'
import { checkRBAC } from '@/utils/check-rbac'
import { parseQueryString } from '@/utils/query-string-parser'
import { Access, PayloadRequest } from 'payload'

type AccessAdminPage = ({ req }: { req: PayloadRequest }) => boolean | Promise<boolean>

export const canAccessAdminPage: AccessAdminPage = ({ req }) => {
  const user = req.user
  if (!user) return false

  if (checkRBAC(user.roles || [], ['admin'])) {
    return true
  }
  return true
}

export const canReadPage: Access<Tag> = (props) => {
  const id = props.id
  const user = props.req.user

  if (!user) return false

  if (checkRBAC(user.roles || [], ['admin'])) {
    return true
  }

  if (id) {
    return true
  }

  const searchParams = parseQueryString(props.req.searchParams.toString())
  if (searchParams.where) {
    return true
  }
  return {
    or: [
      {
        name: {
          not_like: '%thumbnail%',
        },
      },
    ],
  }
  return true
}
