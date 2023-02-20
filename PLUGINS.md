# Plugins

There's basic support of being able to extend the pipe to add in functionality
that you might be repeating again and again. These could be array/object
operations that you've been adding again and again.

If you wish to write you own, [read how to](#write-your-own-plugins)

## Array Plugins

### `flatten`

```js
import { pipe } from '@barelyhuman/pipe'
import { flatten } from '@barelyhuman/pipe/array'

const value = await pipe([1, 2, [3, [4]]])
  .use(flatten)
  .run()
```

### `groupBy`

```js
import { pipe } from '@barelyhuman/pipe'
import { groupBy } from '@barelyhuman/pipe/array'

const items = [1, 2, 1]
const expected = { 1: [1, 1], 2: [2] }

// without a key function, the grouping
// uses the item itself. In this case the numbers
const groupedBy = await pipe(items).use(groupBy()).run()
assert.equal(groupedBy, expected)
```

```js
const items = [{ id: 1 }, { id: 2 }, { id: 1 }]
const expected = { 1: [{ id: 1 }, { id: 1 }], 2: [{ id: 2 }] }

// with a key function, it groups based on the value
// returned by the keygen function
const groupedBy = await pipe(items)
  .use(groupBy(x => x.id))
  .run()

assert.equal(groupedBy, expected)
```

## Async Plugins

### `resolve`

```js
import { pipe } from '@barelyhuman/pipe'
import { resolve } from '@barelyhuman/pipe/async'
import { flatten } from '@barelyhuman/pipe/array'

const value = await pipe([Promise.resolve(1), [Promise.resolve(2)]])
  .use(flatten)
  .use(resolve)
  .run()
```

## Write your own plugins

> To be done

To write your own plugins, the current API is very tiny and you can figure it
out by hacking through the existing ones.
