import { pipe } from '../src'
import { flatten } from '../src/array'
import { resolve } from '../src/async'
import * as assert from 'uvu/assert'
import { test } from 'uvu'

test('extended pipe', async () => {
  const data = await pipe([Promise.resolve(1), [Promise.resolve(2)]])
    .use(flatten)
    .use(resolve)
    .run()
  assert.equal(data, [1, 2])
})

test.run()
