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
  ],
}
