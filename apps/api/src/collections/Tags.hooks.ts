import { Tag } from '@/payload-types'
import { generateId } from '@/utils/generate-id'
import { isNumeric, isString } from '@/utils/helper'
import { BasePayload } from 'payload'
import slugify from 'slugify'

export const createOrUpdateTags = async (payload: BasePayload, data: (Tag | number)[]) => {
  const tags = []
  for (const tag of data) {
    if (isNumeric(tag)) {
      await payload.findByID({
        collection: 'tags',
        id: tag,
      })
      tags.push(tag)
    } else if (isString(tag)) {
      const tagSlugify = slugify(tag)
      const findTags = await payload.find({
        collection: 'tags',
        where: {
          slug: {
            in: [tagSlugify],
          },
        },
      })
      const existTag = findTags.docs[0]
      if (!existTag) {
        const res = await payload.create({
          collection: 'tags',
          data: {
            name: tag,
            slug: tagSlugify,
          },
        })
        tags.push(res.id)
      } else {
        tags.push(existTag.id)
      }
    } else if (typeof tag === 'object' && tag.name) {
      const t = tag as Pick<Tag, 'name' | 'slug'>
      const res = await payload.create({
        collection: 'tags',
        data: {
          name: t.name,
          slug: t.slug
            ? `${t.slug}_${generateId(4)}`
            : slugify(`${t.name} ${generateId(4)}`, { lower: true }),
        },
      })
      tags.push(res.id)
    }
  }
  return tags
}
