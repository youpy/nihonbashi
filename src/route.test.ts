import { route } from './route'

describe('path', () => {
  it('parses a path', () => {
    const p = route('/foo/bar/baz')

    expect(p()).toEqual('/foo/bar/baz')
  })

  it('parses a path with parameters', () => {
    const p = route('/foo/:param1/bar/:param2')

    expect(p({ param1: 'xxx', param2: 'yyy' })).toEqual('/foo/xxx/bar/yyy')
  })
})
