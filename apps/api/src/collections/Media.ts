import type { CollectionConfig } from 'payload'
import { canReadPage } from './Media.access'
import { beforeOperationHook } from './Media.hooks'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: canReadPage,
  },
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      defaultValue: (props) => {
        const { user, req } = props
        return req.user?.id || user?.id
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
  ],
  hooks: {
    beforeOperation: [beforeOperationHook],
  },
}
