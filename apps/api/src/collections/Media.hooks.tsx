import { Media } from '@/payload-types'
import { CollectionBeforeOperationHook } from 'payload'
import { createOrUpdateTags } from './Tags.hooks'

export const beforeOperationHook: CollectionBeforeOperationHook = async (props) => {
  const { operation, req } = props
  if (['create', 'update'].indexOf(operation) > -1) {
    const data = req.data as Partial<Media>
    if (data.tags) {
      data.tags = await createOrUpdateTags(props.req.payload, data.tags)
    }
  }
}
