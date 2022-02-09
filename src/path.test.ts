import { parsePath } from './path'

describe('parsePath', () => {
  it('parses a path', () => {
    const p = parsePath('/foo/bar/baz')

    expect(p.foo().toString()).toEqual('/foo')
    expect(p.foo().bar().toString()).toEqual('/foo/bar')
    expect(p.foo().bar().baz().toString()).toEqual('/foo/bar/baz')
  })

  it('parses a path with parameters', () => {
    const p = parsePath('/foo/:param1/bar/:param2')

    expect(p.foo().toString()).toEqual('/foo')
    expect(p.foo().param1().bar().toString()).toEqual('/foo/:param1/bar')
    expect(p.foo().param1('xxxx').bar().toString()).toEqual('/foo/xxxx/bar')
    expect(p.foo().param1('xxxx').bar().param2().toString()).toEqual(
      '/foo/xxxx/bar/:param2'
    )
    expect(p.foo().param1('xxxx').bar().param2('yyyy').toString()).toEqual(
      '/foo/xxxx/bar/yyyy'
    )
  })
})
