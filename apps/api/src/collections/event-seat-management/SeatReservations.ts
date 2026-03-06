import type { CollectionConfig } from 'payload'

export const SeatReservations: CollectionConfig = {
  slug: 'seat-reservations',
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
      name: 'seat',
      type: 'relationship',
      relationTo: 'event-seats',
      required: true,
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
    },

    {
      name: 'status',
      type: 'text',
    },

    {
      name: 'meta',
      type: 'json',
    },
  ],
}
