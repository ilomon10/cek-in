import { PayloadRequest } from 'payload'

export type BaseServiceResult<
  TEntity = unknown,
  TMeta extends Record<string, any> = Record<string, any>,
> = {
  entity: TEntity
} & TMeta

export type BaseService<TInput, TEntity, TMeta extends Record<string, any> = {}> = (
  request: PayloadRequest,
  data: TInput,
) => Promise<BaseServiceResult<TEntity, TMeta>>
