import type { CollectionConfig } from 'payload'
import { productConfigsJSONSchema } from './ProductConfigs.schema'

export const Products: CollectionConfig = {
  slug: 'products',
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
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
      defaultValue: 'membership',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'currency',
      type: 'text',
      required: true,
      defaultValue: 'IDR',
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
