import { route } from './route'

describe('route', () => {
  it('parses a route with no parameters', () => {
    const r = route('/foo/bar/baz')

    expect(r()).toEqual('/foo/bar/baz')
  })

  it('parses a route with parameters', () => {
    const r = route('/foo/:param1/bar')

    expect(r({ param1: 'xxx' })).toEqual('/foo/xxx/bar')
    expect(r({})).toEqual('/foo/:param1/bar')
  })

  it('parses a route with parameters in the end', () => {
    const r = route('/foo/:param1/bar/:param2')

    expect(r({ param1: 'xxx', param2: 'yyy' })).toEqual('/foo/xxx/bar/yyy')
    expect(r({ param1: 'xxx' })).toEqual('/foo/xxx/bar/:param2')
    expect(r({ param2: 'yyy' })).toEqual('/foo/:param1/bar/yyy')
  })

  it('supports currying', () => {
    const r = route(route('/foo/:param1/bar/:param2')({ param1: 'xxx' }))

    expect(r({ param2: 'yyy' })).toEqual('/foo/xxx/bar/yyy')
    expect(r({})).toEqual('/foo/xxx/bar/:param2')

    const s = route(r({ param2: 'yyy' }))

    expect(s()).toEqual('/foo/xxx/bar/yyy')
  })
})
