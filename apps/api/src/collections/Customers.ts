import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
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
      name: 'email',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'gender',
      type: 'text',
    },
    {
      name: 'birth_date',
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
  ],
}
