import { User } from '@/payload-types'
import { Access, Where } from 'payload'

export const userAccessCreate: Access<Partial<User>> = async ({ data, req }) => {
  return true
}
