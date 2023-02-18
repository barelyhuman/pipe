import { pipe } from '../src'
import { addFlatten } from '../src/array'
import { addResolveAll } from '../src/async'
import * as assert from 'uvu/assert'
import { test } from 'uvu'

test('extended pipe', async () => {
  const data = await pipe([Promise.resolve(1), [Promise.resolve(2)]])
    .plugins([addFlatten, addResolveAll])
    .flatten()
    .resolveAll()
    .run()
  assert.equal(data, [1, 2])
})

test('restricted plugin name', async () => {
  const willThrow = () =>
    pipe(1).plugins([
      {
        name: 'map',
        mapper: false,
        do() {},
      },
    ])
  assert.throws(
    willThrow,
    new Error(
      `map is a reserved name in pipe, please name you plugin something else`
    )
  )
})

test.run()
