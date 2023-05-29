# nihonbashi

A type-safe routing utility for Typescript

## install

```
$ yarn add nihonbashi
```

## Usage

```typescript
import { RouteGen } from 'nihonbashi'

type Param = string & { readonly __opaque__: 'param' }

const gen = new RouteGen<{ param1: Param }>()
const r = gen.route('/foo/:param1/bar/:param2')

r({ param1: 'xxx' as Param, param2: 'yyy' }) // => '/foo/xxx/bar/yyy'
r({ param1: 'xxx' as Param }) // => '/foo/xxx/bar/:param2'
r({ param1: 'xxx' }) // => error: Type 'string' is not assignable to type 'Param'.

// currying
gen.route(r({ param1: 'xxx' as Param }))({ param2: 'yyy' }) // => '/foo/xxx/bar/yyy'
```
