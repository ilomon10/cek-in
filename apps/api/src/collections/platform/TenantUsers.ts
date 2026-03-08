import type { CollectionConfig } from 'payload'

export const TenantUsers: CollectionConfig = {
  slug: 'tenant-users',
  admin: {
    group: 'Platform',
    useAsTitle: 'email',
    defaultColumns: ['email', 'tenant'],
  },
  fields: [
    // Email added by default
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
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
      name: 'tenantName',
      type: 'text',
      virtual: 'tenant.name',
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
