// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/platform/Users'
import { Media } from './collections/platform/Media'
import { openapi, scalar } from 'payload-oapi'
import { isDev, isTest } from './utils/helper'
import { Config } from './payload-types'
import { Orders } from './collections/tenant/Orders'
import { OrderItems } from './collections/tenant/OrderItems'
import { Tenants } from './collections/platform/Tenants'
import { Products } from './collections/tenant/Products'
import { TentantSubscriptions } from './collections/platform/TenantSubcriptions'
import { Payments } from './collections/tenant/Payments'
import { Customers } from './collections/tenant/Customers'
import { CheckInLogs } from './collections/tenant/CheckInLogs'
import { Entitlements } from './collections/tenant/Entitlements'
import { Subscriptions } from './collections/tenant/Subscriptions'
import { EventSeats } from './collections/event-seat-management/EventSeats'
import { SeatReservations } from './collections/event-seat-management/SeatReservations'
import { Devices } from './collections/platform/Devices'
import { Plans } from './collections/platform/Plans'
import { TenantUsers } from './collections/platform/TenantUsers'
import CreateMembershipHandler from './endpoints/create-membership'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const dbAdapter = () => {
  if (process.env.DATABASE_TYPE === 'sqlite') {
    return sqliteAdapter({
      push: process.env.NODE_ENV === 'development' && process.env.SQLITE_PUSH === 'true',
      client: {
        url: process.env.SQLITE_URI || '',
      },
    })
  }
  return postgresAdapter({
    push: process.env.NODE_ENV === 'development' && process.env.POSTGRES_PUSH === 'true',
    pool: {
      connectionString: process.env.POSTGRES_URI || '',
    },
  })
}

export default buildConfig({
  telemetry: false,
  admin: {
    avatar: { Component: './components/graphics/profile-picture#ProfilePicture' },
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Plans,
    TentantSubscriptions,
    Tenants,
    TenantUsers,

    Users,
    Customers,

    Media,

    Devices,
    Products,
    Orders,
    OrderItems,
    Entitlements,
    CheckInLogs,
    Payments,
    Subscriptions,

    // EventSeatManagement
    EventSeats,
    SeatReservations,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
    declare: false,
  },
  db: dbAdapter(),
  sharp: sharp as any,
  plugins: [
    // storage-adapter-placeholder
    openapi({
      enabled: isDev || !isTest,
      openapiVersion: '3.0',
      metadata: { title: 'Dev API', version: '0.0.1' },
    }),
    scalar({ enabled: isDev || !isTest }),
  ],
  cors: '*',
  endpoints: [CreateMembershipHandler],
})

declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}
