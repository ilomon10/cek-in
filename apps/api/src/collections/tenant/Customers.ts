import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
    },
    {
      name: 'memberId',
      type: 'text',
      unique: true,
      required: true,
      minLength: 4,
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
      required: true,
    },
    {
      name: 'gender',
      type: 'radio',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
    },
    {
      name: 'birthDate',
      type: 'date',
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
      name: 'entitlements',
      type: 'join',
      collection: 'entitlements',
      on: 'customer',
    },

    {
      name: 'orders',
      type: 'join',
      collection: 'orders',
      on: 'customer',
      admin: {
        defaultColumns: ['invoiceNumber', 'status', 'items', 'totalAmount'],
      },
    },
  ],
}
