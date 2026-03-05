// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Teams } from './collections/Teams'
import { Plans } from './collections/Plans'
import { Tags } from './collections/Tags'
import { Templates } from './collections/Templates'
import { Invitations } from './collections/Invitations'
import { openapi, scalar } from 'payload-oapi'
import { isDev, isTest } from './utils/helper'
import { Config } from './payload-types'
import ProfilePicture from './components/graphics/profile-picture'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
export default buildConfig({
  telemetry: false,
  admin: {
    avatar: { Component: './components/graphics/profile-picture#ProfilePicture' },
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Teams, Plans, Tags, Templates, Invitations],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
    declare: false,
  },
  db: postgresAdapter({
    push: process.env.NODE_ENV === 'development' && process.env.POSTGRES_PUSH === 'true',
    pool: {
      connectionString: process.env.POSTGRES_URI || '',
    },
  }),
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
})

declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}
