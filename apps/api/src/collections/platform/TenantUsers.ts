import type { CollectionConfig } from 'payload'

export const TenantUsers: CollectionConfig = {
  slug: 'tenant-users',
  admin: {
    group: 'Platform',
    useAsTitle: 'email',
  },
  fields: [
    // Email added by default
    {
      saveToJWT: true,
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
    },
    {
      saveToJWT: true,
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },

    {
      name: 'name',
      type: 'text',
      virtual: 'user.name',
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'email',
      type: 'text',
      virtual: 'user.email',
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'avatarAsset',
      label: 'Avatar Asset',
      type: 'upload',
      relationTo: 'media',
    },

    {
      saveToJWT: true,
      name: 'role',
      type: 'radio',
      options: [
        { label: 'Owner', value: 'owner' },
        { label: 'Admin', value: 'admin' },
        { label: 'Staff', value: 'staff' },
        { label: 'Cashier', value: 'cashier' },
      ],
      required: true,
      defaultValue: 'staff',
    },

    {
      name: 'meta',
      type: 'json',
    },
  ],
}
