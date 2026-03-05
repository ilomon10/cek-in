import type { CollectionConfig } from 'payload'
import { beforeOperationHook } from './Templates.hooks'
import { canReadPage, canUpdatePage } from './Templates.access'

export const Templates: CollectionConfig = {
  slug: 'templates',
  admin: {
    useAsTitle: 'title',
  },
  versions: {
    maxPerDoc: 10,
  },
  access: {
    update: canUpdatePage,
    delete: canReadPage,
    create: canReadPage,
    read: canReadPage,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
    },
    {
      name: 'visibility',
      type: 'select',
      options: ['private', 'public', 'unlisted'],
      defaultValue: 'private',
    },
    {
      name: 'coverAsset',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'thumbnailAsset',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'assets',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      defaultValue: [],
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
