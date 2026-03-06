import type { CollectionConfig } from 'payload'

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
      type: 'group',
      label: 'Product Configuration',
      fields: [
        /*
        ======================
        MEMBERSHIP CONFIG
        ======================
        */
        {
          name: 'duration_days',
          type: 'number',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'membership',
          },
        },
        {
          name: 'visit_limit',
          type: 'number',
          admin: {
            condition: (_, siblingData) =>
              siblingData?.type === 'membership' || siblingData?.type === 'package',
          },
        },
        {
          name: 'recurring',
          type: 'checkbox',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'membership',
          },
        },
        {
          name: 'grace_period_days',
          type: 'number',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'membership',
          },
        },

        /*
        ======================
        EVENT CONFIG
        ======================
        */
        {
          name: 'event_start',
          type: 'date',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'event',
          },
        },
        {
          name: 'event_end',
          type: 'date',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'event',
          },
        },
        {
          name: 'venue',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'event',
          },
        },
        {
          name: 'seat_required',
          type: 'checkbox',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'event',
          },
        },

        /*
        ======================
        PACKAGE CONFIG
        ======================
        */
        {
          name: 'expiry_days',
          type: 'number',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'package',
          },
        },
      ],
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
