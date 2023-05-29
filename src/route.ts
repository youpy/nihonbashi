type Merge<T, U> = Omit<T, keyof U> & U

type Args<T, Shape> = T extends Shape
  ? Exclude<keyof T, keyof Shape> extends never
    ? [T] | []
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
  D = string,
  T extends string = '',
  U extends Object = {}
> = S extends `/:${infer Head}/${infer Tail}`
  ? RouteFn<
      `/${Tail}`,
      K,
      D,
      `${T}/:${Head}`,
      Merge<U, { [str in Head]?: str extends keyof K ? K[str] : D }>
    >
  : S extends `/${infer Head}/${infer Tail}`
  ? RouteFn<`/${Tail}`, K, D, `${T}/${Head}`, U>
  : S extends `/:${infer Head}`
  ? <V extends Merge<U, { [str in Head]?: str extends keyof K ? K[str] : D }>>(
      ...args: Args<
        V,
        Merge<U, { [str in Head]?: str extends keyof K ? K[str] : D }>
      >
    ) => Route<V, `${T}/:${Head}`>
  : S extends `/${infer Head}`
  ? <V extends U>(...args: Args<V, U>) => Route<V, `${T}/${Head}`>
  : keyof U extends never
  ? () => T
  : <V extends U>(...args: Args<V, U>) => Route<V, T>

export class RouteGen<K extends Record<string, any> = {}, D = string> {
  route<T extends `/${string}`>(path: T): RouteFn<T, K, D> {
    const parts = path.split('/')

    if (parts[0] === '') {
      parts.shift()
    }

    return ((params?: Record<string, string>) => {
      const p = params || {}
      let path = ''

      parts.forEach((part) => {
        if (part.startsWith(':')) {
          const param = part.replace(/^:/, '')

          path += '/' + (typeof p[param] !== 'undefined' ? p[param] : part)
        } else {
          path += '/' + part
        }
      })

      return path
    }) as RouteFn<T, K, D>
  }
}
