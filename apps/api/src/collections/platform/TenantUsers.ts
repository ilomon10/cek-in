import type { CollectionConfig } from 'payload'

export const TenantUsers: CollectionConfig = {
  slug: 'tenant-users',
  admin: {
    group: 'Platform',
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
      defaultValue: 'member',
    },

    {
      name: 'meta',
      type: 'json',
    },
  ],
}
