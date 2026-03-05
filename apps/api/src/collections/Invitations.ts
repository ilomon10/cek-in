import type { CollectionConfig } from 'payload'
import { beforeOperationHook } from './Invitations.hooks'
import { canReadPage } from './Invitations.access'

export const Invitations: CollectionConfig = {
  slug: 'invitations',
  admin: {
    useAsTitle: 'title',
  },
  versions: {
    maxPerDoc: 10,
    drafts: true,
  },
  access: {
    read: canReadPage,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
    },
    {
      name: 'assets',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      defaultValue: [],
    },
    {
      name: 'thumbnailAsset',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'data',
      type: 'json',
      defaultValue: {},
    },
    {
      name: 'meta',
      type: 'json',
      defaultValue: {},
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      defaultValue: (props) => {
        const { user, req } = props
        return req.user?.id || user?.id
      },
    },
  ],
  hooks: {
    beforeOperation: [beforeOperationHook],
  },
}
