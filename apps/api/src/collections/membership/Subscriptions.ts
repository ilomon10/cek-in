import type { CollectionConfig } from 'payload'

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',

  fields: [
    {
      name: 'tentant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
    },

    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
    },

    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },

    {
      name: 'nextBillingDate',
      type: 'date',
    },

    {
      name: 'status',
      type: 'radio',
      options: ['active', 'paused', 'cancelled'],
      required: true,
      defaultValue: 'active',
    },

    {
      name: 'paymentMethod',
      type: 'text',
    },

    {
      name: 'meta',
      type: 'json',
    },
  ],
}
