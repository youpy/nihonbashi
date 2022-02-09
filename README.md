# nihonbashi

A type-safe routing utility for Typescript

## install

```
$ yarn add nihonbashi
```

## Usage

```typescript
import { route } from 'nihonbashi'

const r = route('/foo/:param1/bar/:param2')

r({ param1: 'xxx', param2: 'yyy' }) // => '/foo/xxx/bar/yyy'
```
