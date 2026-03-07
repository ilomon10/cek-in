import { User } from '@/payload-types'
import type { CollectionConfig } from 'payload'
import { userAccessCreate } from './Users.access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Platform',
    useAsTitle: 'email',
    defaultColumns: ['email', 'username', 'avatarAsset', 'roles'],
  },
  auth: {
    useAPIKey: true,
    loginWithUsername: {
      allowEmailLogin: true,
      requireEmail: true,
    },
  },
  access: {
    create: userAccessCreate,
  },
  fields: [
    // Email added by default
    {
      saveToJWT: true,
      name: 'username',
      type: 'text',
      unique: true,
      required: true,
      minLength: 3,
    },
    {
      saveToJWT: true,
      name: 'name',
      type: 'text',
    },
    {
      name: 'avatarAsset',
      label: 'Avatar Asset',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'isPlatformAdmin',
      type: 'checkbox',
      defaultValue: false,
      hooks: {
        beforeChange: [
          ({ value, req }) => {
            if (!req.user?.isPlatformAdmin) return false
            return value
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'radio',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
      ],
      defaultValue: 'active',
    },

    {
      name: 'meta',
      type: 'json',
    },
    {
      name: 'isDeleted',
      type: 'checkbox',
    },
    {
      name: 'deletedAt',
      type: 'date',
    },

    {
      name: 'tenantUsers',
      type: 'join',
      collection: 'tenant-users',
      on: 'user',
      admin: {
        defaultColumns: ['tenant', 'email'],
      },
    },
  ],
}
