import { JSONField } from 'payload'

export const productConfigsJSONSchema: JSONField['jsonSchema'] = {
  uri: 'a://b/foo.json', //dummy
  fileMatch: ['a://b/foo.json'], //dummy
  schema: {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: 'Product Config',
    type: 'object',
    oneOf: [
      { $ref: '#/$defs/membershipConfig' },
      { $ref: '#/$defs/eventConfig' },
      { $ref: '#/$defs/packageConfig' },
    ],
    $defs: {
      membershipConfig: {
        type: 'object',
        required: ['duration_days', 'recurring'],
        properties: {
          duration_days: {
            type: 'integer',
            minimum: 1,
          },
          visit_limit: {
            type: ['integer', 'null'],
            minimum: 1,
          },
          recurring: {
            type: 'boolean',
          },
          grace_period_days: {
            type: 'integer',
            minimum: 0,
            default: 0,
          },
        },
        additionalProperties: false,
      },

      eventConfig: {
        type: 'object',
        required: ['event_start', 'event_end', 'venue', 'seat_required'],
        properties: {
          event_start: {
            type: 'string',
            format: 'date-time',
          },
          event_end: {
            type: 'string',
            format: 'date-time',
          },
          venue: {
            type: 'string',
            minLength: 1,
          },
          seat_required: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },

      packageConfig: {
        type: 'object',
        required: ['visit_limit', 'expiry_days'],
        properties: {
          visit_limit: {
            type: 'integer',
            minimum: 1,
          },
          expiry_days: {
            type: 'integer',
            minimum: 1,
          },
        },
        additionalProperties: false,
      },
    },
  },
}
