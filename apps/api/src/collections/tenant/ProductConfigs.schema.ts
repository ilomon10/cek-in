import { JSONField } from 'payload'

export const productConfigsJSONSchema: JSONField['jsonSchema'] = {
  uri: 'a://b/foo.json', //dummy
  fileMatch: ['a://b/foo.json'], //dummy
  schema: {
    type: 'object',
    oneOf: [
      {
        title: 'Membership Config',
        properties: {
          type: {
            const: 'membership',
          },
          duration_days: {
            type: 'integer',
            minimum: 1,
          },
          visit_limit: {
            type: ['integer', 'null'],
            minimum: -1,
          },
          recurring: {
            type: 'boolean',
          },
          grace_period_days: {
            type: 'integer',
            minimum: 0,
          },
        },
        required: ['type', 'duration_days'],
      },
      {
        title: 'Event Config',
        properties: {
          type: {
            const: 'event',
          },
          event_start: {
            type: 'string',
            // format: 'date-time',
          },
          event_end: {
            type: 'string',
            // format: 'date-time',
          },
          venue: {
            type: 'string',
          },
          max_capacity: {
            type: 'integer',
            minimum: 1,
          },
          allow_multiple_entry: {
            type: 'boolean',
          },
        },
        required: ['type', 'event_start', 'event_end'],
      },
      {
        title: 'Package Config',
        properties: {
          type: {
            const: 'package',
          },
          visit_quota: {
            type: 'integer',
            minimum: 1,
          },
          expiry_days: {
            type: 'integer',
            minimum: 1,
          },
        },
        required: ['type', 'visit_quota'],
      },
    ],
  },
}
