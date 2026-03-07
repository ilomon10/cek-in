import { TenantCreateHandler } from '@/endpoints/tenant-create'
import { generateId } from '@/utils/generate-id'
import { generateSimpleHash } from '@/utils/generate-simple-hash'
import type { CollectionConfig } from 'payload'
import { slugify } from 'payload/shared'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    group: 'Platform',
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      hooks: {
        beforeChange: [
          async ({ siblingData, value }) => {
            let slug: string = value as string
            const rawId = siblingData.id || generateId()
            if (!value) {
              const id = generateSimpleHash(`${rawId}`, true)
              slug = slugify(`${siblingData.name} ${id}`) as string
            }
            return slug
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'radio',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
        { label: 'Trial', value: 'trial' },
      ],
    },
    {
      name: 'plan',
      type: 'relationship',
      relationTo: 'plans',
    },
    {
      name: 'logoAsset',
      label: 'Logo Asset',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'meta',
      type: 'json',
    },
    {
      name: 'isDeleted',
      type: 'checkbox',
    },
    {
      name: 'deletedAt',
      type: 'date',
    },

    {
      name: 'subscriptionPlan',
      type: 'text',
      virtual: 'plan.name',
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'members',
      type: 'join',
      collection: 'tenant-users',
      on: 'tenant',
      admin: {
        defaultColumns: ['email', 'role'],
      },
    },
  ],
  endpoints: [
    {
      path: '/create',
      method: 'post',
      handler: TenantCreateHandler,
    },
  ],
}
