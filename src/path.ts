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
  const re = new RegExp('^:')
  const pp = (path: string, base: string, parts: string[]): unknown => {
    // clone parts
    parts = parts.concat()

    const p = parts.shift()
    const b = base + '/' + path

    if (typeof p === 'undefined') {
      if (re.test(path)) {
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

      if (re.test(path)) {
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

export type Path2<
  S extends string,
  T extends string = '',
  U extends Object = {}
> = S extends `/:${infer Head}/${infer Tail}`
  ? Path2<`/${Tail}`, `${T}/${Head}`, Merge<U, { [str in Head]: string }>>
  : S extends `/${infer Head}/${infer Tail}`
  ? Path2<`/${Tail}`, `${T}/${Head}`, U>
  : S extends `/:${infer Head}`
  ? (param?: Merge<U, { [str in Head]: string }>) => string
  : (param?: U) => string

export const parsePath2 = <T extends string>(path: T): Path2<T> => {
  const parts = path.split('/')

  if (parts[0] === '') {
    parts.shift()
  }

  return ((params: Record<string, string>) => {
    let path = ''

    parts.forEach((part) => {
      if (part.startsWith(':')) {
        const param = part.replace(/^:/, '')

        if (typeof params[param] === 'undefined') {
          throw new Error(`Missing parameter ${param}`)
        }

        path += '/' + params[param]
      } else {
        path += '/' + part
      }
    })

    return path
  }) as Path2<T>
}
