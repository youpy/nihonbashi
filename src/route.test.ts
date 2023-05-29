import { RouteGen } from './route'

type Param1 = string & { readonly __opaque__: 'param1' }
type Param2 = string & { readonly __opaque__: 'param2' }

describe('route', () => {
  it('does not accept a route without a leading slash', () => {
    // @ts-expect-error
    new RouteGen().route('')

    // @ts-expect-error
    new RouteGen().route('foo')
  })

  it('parses a route with only a slash', () => {
    const r = new RouteGen().route('/')

    expect(r({})).toEqual('/')
    expect(r()).toEqual('/')

    // @ts-expect-error
    expect(r({ aaa: 'bbb' })).toEqual('/')
  })

  it('parses a route with no subpath', () => {
    const r = new RouteGen().route('/foo')

    expect(r({})).toEqual('/foo')
    expect(r()).toEqual('/foo')

    // @ts-expect-error
    expect(r({ aaa: 'bbb' })).toEqual('/foo')
  })

  it('parses a route with no subpath and a parameter', () => {
    const r = new RouteGen().route('/:foo')

    expect(r({ foo: 'xxx' })).toEqual('/xxx')
    expect(r()).toEqual('/:foo')

    // @ts-expect-error
    expect(r({ aaa: 'bbb' })).toEqual('/:foo')
  })

  it('parses a route with no parameters', () => {
    const r = new RouteGen().route('/foo/bar/baz')

    expect(r({})).toEqual('/foo/bar/baz')
    expect(r()).toEqual('/foo/bar/baz')
  })

  it('parses a route with parameters', () => {
    const r = new RouteGen().route('/foo/:param1/bar')

    expect(r({ param1: 'xxx' })).toEqual('/foo/xxx/bar')
    expect(r({})).toEqual('/foo/:param1/bar')
    expect(r()).toEqual('/foo/:param1/bar')

    // @ts-expect-error
    expect(r({ aaa: 'bbb' })).toEqual('/foo/:param1/bar')
  })

  it('parses a route with parameters in the end', () => {
    const gen = new RouteGen()
    const r = gen.route('/foo/:param1/bar/:param2')

    expect(r({ param1: 'xxx', param2: 'yyy' })).toEqual('/foo/xxx/bar/yyy')
    expect(r({ param1: 'xxx' })).toEqual('/foo/xxx/bar/:param2')
    expect(r({ param2: 'yyy' })).toEqual('/foo/:param1/bar/yyy')
  })

  it('parses a route with custom type parameters', () => {
    const gen = new RouteGen<{ param1: Param1; param2: Param2 }>()
    const r = gen.route('/foo/:param1/bar/:param2')

    // @ts-expect-error
    r({ param1: 'xxx' })

    // @ts-expect-error
    r({ param2: 'yyy' })

    // @ts-expect-error
    r({ param1: 'xxx' as Param1, param2: 'yyy' })

    // @ts-expect-error
    r({ param1: 'xxx', param2: 'yyy' as Param2 })

    // @ts-expect-error
    r({ param1: 'xxx' as Param2, param2: 'yyy' as Param2 })

    // @ts-expect-error
    r({ param1: 'xxx' as Param1, param2: 'yyy' as Param1 })

    // @ts-expect-error
    r({ param1: 'xxx' as Param1, param2: 'yyy' as Param2, zzz: 'abc' })

    expect(r({ param1: 'xxx' as Param1, param2: 'yyy' as Param2 })).toEqual(
      '/foo/xxx/bar/yyy'
    )
    expect(r({})).toEqual('/foo/:param1/bar/:param2')
    expect(r()).toEqual('/foo/:param1/bar/:param2')
  })

  it('parses a route with default parameter type', () => {
    const gen = new RouteGen<{}, number>()
    const r = gen.route('/foo/:param1')

    // @ts-expect-error
    r({ param1: 'xxx' })

    expect(r({ param1: 123 })).toEqual('/foo/123')
    expect(r({})).toEqual('/foo/:param1')
    expect(r()).toEqual('/foo/:param1')
  })

  it('custom type parameter overwrites default parameter type', () => {
    const gen = new RouteGen<{ param1: string }, number>()
    const r = gen.route('/foo/:param1')

    // @ts-expect-error
    r({ param1: 123 })

    expect(r({ param1: 'xxx' })).toEqual('/foo/xxx')
    expect(r({})).toEqual('/foo/:param1')
    expect(r()).toEqual('/foo/:param1')
  })

  it('supports currying', () => {
    const gen = new RouteGen()
    const r = gen.route(
      gen.route('/foo/:param1/bar/:param2')({ param1: 'xxx' })
    )

    expect(r({ param2: 'yyy' })).toEqual('/foo/xxx/bar/yyy')
    expect(r({})).toEqual('/foo/xxx/bar/:param2')
    expect(r()).toEqual('/foo/xxx/bar/:param2')

    const s = gen.route(r({ param2: 'yyy' }))

    expect(s()).toEqual('/foo/xxx/bar/yyy')
  })
})
