import { pipe } from '../src'
import * as assert from 'uvu/assert'
import { test } from 'uvu'
import { resolve } from '../src/async'

test('resolve array of promises', async () => {
  const flat = [1, 2]
  const flatValue = await pipe([Promise.resolve(1), Promise.resolve(2)])
    .use(resolve)
    .run()

  assert.equal(flatValue, flat)
})

test.run()
