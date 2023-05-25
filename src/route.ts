import { Merge } from 'type-fest'

// https://fettblog.eu/typescript-match-the-exact-object-shape/
type ValidateShape<T, Shape> = T extends Shape
  ? Exclude<keyof T, keyof Shape> extends never
    ? T
    : never
  : never

type Route<
  S extends Object,
  T extends string,
  U extends string = ''
> = T extends `/:${infer Head}/${infer Tail}`
  ? Route<S, `/${Tail}`, `${U}/${Head extends keyof S ? Head : `:${Head}`}`>
  : T extends `/${infer Head}/${infer Tail}`
  ? Route<S, `/${Tail}`, `${U}/${Head}`>
  : T extends `/:${infer Head}`
  ? `${U}/${Head extends keyof S ? Head : `:${Head}`}`
  : T extends `/${infer Head}`
  ? `${U}/${Head}`
  : U

export type RouteFn<
  S extends string,
  K extends Record<string, any>,
  T extends string = '',
  U extends Object = {}
> = S extends `/:${infer Head}/${infer Tail}`
  ? RouteFn<
      `/${Tail}`,
      K,
      `${T}/:${Head}`,
      Merge<U, { [str in Head]?: str extends keyof K ? K[str] : string }>
    >
  : S extends `/${infer Head}/${infer Tail}`
  ? RouteFn<`/${Tail}`, K, `${T}/${Head}`, U>
  : S extends `/:${infer Head}`
  ? <
      V extends Merge<
        U,
        { [str in Head]?: str extends keyof K ? K[str] : string }
      >
    >(
      param: ValidateShape<
        V,
        Merge<U, { [str in Head]?: str extends keyof K ? K[str] : string }>
      >
    ) => Route<V, `${T}/:${Head}`>
  : S extends `/${infer Head}`
  ? keyof U extends never
    ? () => `${T}/${Head}`
    : <V extends U>(param: ValidateShape<V, U>) => Route<V, `${T}/${Head}`>
  : keyof U extends never
  ? () => T
  : <V extends U>(param: ValidateShape<V, U>) => Route<V, T>

export class RouteGen<K extends Record<string, any> = {}> {
  route<T extends string>(path: T): RouteFn<T, K> {
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
    }) as RouteFn<T, K>
  }
}
