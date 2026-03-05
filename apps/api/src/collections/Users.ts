import type { CollectionConfig } from 'payload'
import { canCreatePage, canReadPage } from './Users.access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
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
    read: canReadPage,
    create: canCreatePage,
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
      name: 'meta',
      type: 'json',
    },
    {
      name: 'isDeleted',
      type: 'checkbox',
    },
    {
      saveToJWT: true,
      name: 'roles',
      type: 'select',
      options: [
        { label: 'SysAdmin', value: 'system-admin' },
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Designer', value: 'designer' },
      ],
      hasMany: true,
      defaultValue: ['user'],
    },
    {
      name: 'deletedAt',
      type: 'date',
    },
  ],
}
