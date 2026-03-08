import { TenantCreateHandler } from '@/endpoints/tenant-create'
import { TenantUser } from '@/payload-types'
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
      name: 'logoUrl',
      label: 'Logo Url',
      type: 'text',
      virtual: true,
      admin: {
        readOnly: true,
      },
      hooks: {
        afterRead: [
          async ({ siblingData, req }) => {
            if (!siblingData.logoAsset) return undefined
            const res = await req.payload.findByID({
              collection: 'media',
              id: siblingData.logoAsset,
            })

            return res.thumbnailURL
          },
        ],
      },
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
  hooks: {
    beforeDelete: [
      async ({ id, req }) => {
        const res = await req.payload.findByID({
          collection: 'tenants',
          id: id,
        })

        // Remove Tenant Users before delete Tenant
        for (const member of res.members?.docs as TenantUser[]) {
          await req.payload.delete({
            collection: 'tenant-users',
            id: member.id,
          })
        }
      },
    ],
  },
  endpoints: [
    {
      path: '/create',
      method: 'post',
      handler: TenantCreateHandler,
    },
  ],
}
