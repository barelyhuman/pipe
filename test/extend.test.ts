import { pipe } from '../src'
import * as assert from 'uvu/assert'
import { test } from 'uvu'
import { addFlatten } from '../src/array'

test('level 1 flatten', async () => {
  const flat = [1, 2]
  const flatValue = await pipe([1, [2]])
    .plugin(addFlatten)
    .flatten()
    .run()

  assert.equal(flatValue, flat)
})

test('level 3 flatten', async () => {
  const flat = [1, 2, 3, 4]
  const flatValue = await pipe([1, [2, [3, [4]]]])
    .plugin(addFlatten)
    .flatten()
    .run()

  assert.equal(flatValue, flat)
})

test.run()