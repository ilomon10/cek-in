import type { CollectionConfig } from 'payload'
import { productConfigsJSONSchema } from './ProductConfigs.schema'

export const Products: CollectionConfig = {
  slug: 'products',
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      minLength: 3,
    },
    {
      name: 'descriptions',
      type: 'text',
    },
    {
      name: 'productType',
      type: 'radio',
      options: [
        { label: 'Membership', value: 'membership' },
        { label: 'Event', value: 'event' },
        { label: 'Package', value: 'package' },
      ],
    },
    {
      name: 'price',
      type: 'text',
    },
    {
      name: 'currency',
      type: 'text',
    },
    {
      name: 'isActive',
      type: 'checkbox',
    },

    {
      name: 'config',
      type: 'json',
      jsonSchema: productConfigsJSONSchema,
    },

    {
      name: 'thumbnailAsset',
      label: 'Thumbnail Asset',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'meta',
      type: 'json',
    },
  ],
}
