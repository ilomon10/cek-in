export const isDev = process.env.NODE_ENV === 'development'
export const isTest = process.env.NODE_ENV === 'test'

// eslint-disable @typescript-eslint/no-explicit-any
export const isObject = (value: unknown): value is Record<any, any> =>
  value !== null && typeof value === 'object'

// eslint-disable @typescript-eslint/no-explicit-any
export const isFunction = (value: unknown): value is (...args: any) => any =>
  typeof value === 'function'

export const isString = (value: unknown): value is string => typeof value === 'string'
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'
export const isNumber = (value: unknown): value is number => typeof value === 'number'
export const isUndef = (value: unknown): value is undefined => typeof value === 'undefined'
export function isTrueNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

// eslint-disable @typescript-eslint/no-explicit-any
export function isNumeric(value: unknown): value is number {
  return !isNaN(parseFloat(value as any)) && isFinite(Number(value))
}
