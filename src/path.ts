import { Merge } from 'type-fest'

type stringifyObj = { toString: () => string }

export type Path<
  S extends string,
  T extends string = ''
> = S extends `/:${infer Head}/${infer Tail}`
  ? {
      [str in Head]: (
        param?: string
      ) => Merge<Path<`/${Tail}`, `${T}/${Head}`>, stringifyObj>
    }
  : S extends `/${infer Head}/${infer Tail}`
  ? {
      [str in Head]: () => Merge<Path<`/${Tail}`, `${T}/${Head}`>, stringifyObj>
    }
  : S extends `/:${infer Head}`
  ? { [str in Head]: (param?: string) => stringifyObj }
  : S extends `/${infer Head}`
  ? { [str in Head]: () => stringifyObj }
  : { [str in S]: () => stringifyObj }

export const parsePath = <T extends string>(path: T): Path<T> => {
  const pp = (path: string, base: string, parts: string[]): unknown => {
    // clone parts
    parts = parts.concat()

    const p = parts.shift()
    const b = base + '/' + path

    if (typeof p === 'undefined') {
      if (new RegExp('^:').test(path)) {
        return (param: string) => {
          const b = base + '/' + (param || path)

          return {
            toString: () => b
          }
        }
      } else {
        return () => ({
          toString: () => b
        })
      }
    } else {
      const fn = p.replace(/^:/, '')

      if (new RegExp('^:').test(path)) {
        return (param?: string) => {
          const b = base + '/' + (param || path)

          return {
            [fn]: pp(p, b, parts),
            toString: () => b
          }
        }
      } else {
        return () => ({
          [fn]: pp(p, b, parts),
          toString: () => b
        })
      }
    }
  }

  const parts = path.split('/')

  if (parts[0] === '') {
    parts.shift()
  }

  const x = parts.shift() || 'xxx'

  return {
    [x]: pp(x, '', parts)
  } as Path<T>
}
