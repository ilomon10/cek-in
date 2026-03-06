import type { CollectionConfig } from 'payload'

export const EventSeats: CollectionConfig = {
  slug: 'event-seats',
  admin: {
    group: 'Event Seat Management',
  },
  fields: [
    {
      name: 'tentant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
    },

    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },

    {
      name: 'seatCode',
      type: 'text',
    },
    {
      name: 'section',
      type: 'text',
    },

    {
      name: 'status',
      type: 'radio',
      options: ['available', 'reserved', 'sold'],
      required: true,
      defaultValue: 'active',
    },

    {
      name: 'note',
      type: 'text',
    },

    {
      name: 'meta',
      type: 'json',
    },
  ],
}
