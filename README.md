# nihonbashi

A type-safe routing library for Typescript

## Usage

```typescript
const r = route('/foo/:param1/bar/:param2')

r({ param1: 'xxx', param2: 'yyy' }) // => '/foo/xxx/bar/yyy'
```
