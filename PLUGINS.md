# Plugins

There's basic support of being able to extend the pipe to add in functionality
that you might be repeating again and again. These could be array/object
operations that you've been adding again and again.

If you wish to write you own, [read how to](#write-your-own-plugins)

## Array Plugins

### `flatten`

```js
import { pipe } from '@barelyhuman/pipe'
import { addFlatten } from '@barelyhuman/pipe/array'

const value = await pipe([1, 2, [3, [4]]])
  .plugins([addFlatten])
  .flatten()
  .run()
```

## Async Plugins

### `resolveAll`

```js
import { pipe } from '@barelyhuman/pipe'
import { addResolveAll } from '@barelyhuman/pipe/async'
import { addFlatten } from '@barelyhuman/pipe/array'

const value = await pipe([Promise.resolve(1), [Promise.resolve(2)]])
  .plugins([addFlatten, addResolveAll])
  .flatten()
  .resolveAll()
  .run()
```

## Write your own plugins

> To be done

To write your own plugins, the current API is very tiny and you can figure it
out by hacking through the existing ones.
