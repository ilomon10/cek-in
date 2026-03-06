import type { CollectionConfig } from 'payload'
import { productConfigsJSONSchema } from './ProductConfigs.schema'

export const ProductsConfig: CollectionConfig = {
  slug: 'product-configs',
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      minLength: 3,
    },
    {
      name: 'config',
      type: 'json',
      jsonSchema: productConfigsJSONSchema,
    },
  ],
}
