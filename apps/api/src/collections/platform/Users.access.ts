import { User } from '@/payload-types'
import { Access, FieldAccess } from 'payload'

export const userAccessCreate: Access<Partial<User>> = async ({ data, req }) => {
  return true
}
export const userAccessRead: Access<Partial<User>> = async ({ data, req }) => {
  const user = req.user
  if (!user) {
    return false
  }

  if (user.isPlatformAdmin) {
    return true
  }

  return {
    id: {
      equals: user.id,
    },
  }
}

export const adminFieldAccess: FieldAccess = async ({ req }) => {
  console.log('admin user', req.user)
  return !!req.user?.isPlatformAdmin
}
