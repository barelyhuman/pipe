import { pipe } from '../src'
import * as assert from 'uvu/assert'
import { test } from 'uvu'
import { flatten, groupBy } from '../src/array'

test('level 1 flatten', async () => {
  const flat = [1, 2]
  const flatValue = await pipe([1, [2]])
    .use(flatten)
    .run()

  assert.equal(flatValue, flat)
})

test('level 3 flatten', async () => {
  const flat = [1, 2, 3, 4]
  const flatValue = await pipe([1, [2, [3, [4]]]])
    .use(flatten)
    .run()

  assert.equal(flatValue, flat)
})

test('flatten with nested arrays inside object', async () => {
  const flat = [1, 2, 3, { item: [4] }]
  const flatValue = await pipe([1, [2, [3, { item: [4] }]]])
    .use(flatten)
    .run()

  assert.equal(flatValue, flat)
})

test('simple groupBy', async () => {
  const items = [1, 2, 1]
  const expected = { 1: [1, 1], 2: [2] }
  const groupedBy = await pipe(items).use(groupBy()).run()
  assert.equal(groupedBy, expected)
})

test('groupBy key', async () => {
  const items = [{ id: 1 }, { id: 2 }, { id: 1 }]
  const expected = { 1: [{ id: 1 }, { id: 1 }], 2: [{ id: 2 }] }
  const groupedBy = await pipe(items)
    .use(groupBy(x => x.id))
    .run()
  assert.equal(groupedBy, expected)
})

test('flatten then group By', async () => {
  const items = [{ id: 1 }, { id: 2 }, [{ id: 1 }]]
  const expected = { 1: [{ id: 1 }, { id: 1 }], 2: [{ id: 2 }] }
  const groupedBy = await pipe(items)
    .use(flatten)
    .use(groupBy(x => x.id))
    .run()
  assert.equal(groupedBy, expected)
})

test('groupBy just return value if not array', async () => {
  const items = { id: 1 }
  const expected = { id: 1 }
  const groupedBy = await pipe(items)
    .use(groupBy(x => x.id))
    .run()
  assert.equal(groupedBy, expected)
})

test('groupBy just return value if null', async () => {
  const items = null
  const expected = null
  const groupedBy = await pipe(items)
    .use(groupBy(x => x.id))
    .run()
  assert.equal(groupedBy, expected)
})

test.run()
