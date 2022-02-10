import { route } from './route'

describe('route', () => {
  it('parses a route', () => {
    const r = route('/foo/bar/baz')

    expect(r({})).toEqual('/foo/bar/baz')
  })

  it('parses a route with parameters', () => {
    const r = route('/foo/:param1/bar/:param2')

    expect(r({ param1: 'xxx', param2: 'yyy' })).toEqual('/foo/xxx/bar/yyy')
    expect(r({ param1: 'xxx' })).toEqual('/foo/xxx/bar/:param2')
    expect(r({ param2: 'yyy' })).toEqual('/foo/:param1/bar/yyy')
  })
})
