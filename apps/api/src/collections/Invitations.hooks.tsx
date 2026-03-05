import slugify from 'slugify'
import { generateId } from '@/utils/generate-id'
import { CollectionBeforeOperationHook } from 'payload'
import { Invitation } from '@/payload-types'
import { createOrUpdateTags } from './Tags.hooks'

export const beforeOperationHook: CollectionBeforeOperationHook = async (props) => {
  const { operation, req } = props
  const data = req.data as Partial<Invitation>
  if (['create'].indexOf(operation) > -1) {
    if (data && !data.slug) {
      data.slug = slugify(`${data.title} ${generateId(4)}`, { lower: true })
    }
  }
  if (['create', 'update'].indexOf(operation) > -1) {
    if (data.tags) {
      data.tags = await createOrUpdateTags(props.req.payload, data.tags)
    }
  }
}
