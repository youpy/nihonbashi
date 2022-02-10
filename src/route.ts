import { Merge } from 'type-fest'

export type Route<
  S extends string,
  T extends string = '',
  U extends Object = {}
> = S extends `/:${infer Head}/${infer Tail}`
  ? Route<`/${Tail}`, `${T}/:${Head}`, Merge<U, { [str in Head]?: string }>>
  : S extends `/${infer Head}/${infer Tail}`
  ? Route<`/${Tail}`, `${T}/${Head}`, U>
  : S extends `/:${infer Head}`
  ? (param: Merge<U, { [str in Head]?: string }>) => `${T}/:${Head}`
  : S extends `/${infer Head}`
  ? (param: U) => `${T}/${Head}`
  : (param: U) => T

export const route = <T extends string>(path: T): Route<T> => {
  const parts = path.split('/')

  if (parts[0] === '') {
    parts.shift()
  }

  return ((params: Record<string, string>) => {
    let path = ''

    parts.forEach((part) => {
      if (part.startsWith(':')) {
        const param = part.replace(/^:/, '')

        path +=
          '/' + (typeof params[param] !== 'undefined' ? params[param] : part)
      } else {
        path += '/' + part
      }
    })

    return path
  }) as Route<T>
}
