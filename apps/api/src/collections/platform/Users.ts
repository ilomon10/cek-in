import { User } from '@/payload-types'
import type { CollectionConfig } from 'payload'

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
    },
    {
      name: 'status',
      type: 'radio',
      options: ['active', 'suspended'],
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
      name: 'tenantUser',
      type: 'json',
      virtual: true,
      hooks: {
        afterRead: [
          async ({ siblingData, req }) => {
            if (!siblingData.tenantUsers.docs) return null
            if (!siblingData.tenantUsers.docs[0]) return null
            const res = await req.payload.find({
              collection: 'tenant-users',
              where: {
                id: {
                  equals: siblingData.tenantUsers.docs[0].id,
                },
              },
              depth: 0,
            })
            if (!res.docs[0]) return null
            console.log('GET', res.docs[0])
            return res.docs
          },
        ],
      },
    },

    {
      name: 'tenantUsers',
      type: 'join',
      collection: 'tenant-users',
      on: 'user',
      hidden: true as any,
    },
  ],
}
