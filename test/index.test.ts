import { pipe } from '../src'
import * as assert from 'uvu/assert'
import { test } from 'uvu'

test('sync resolve', async () => {
  const value = 1
  const x = await pipe(value).run()

  assert.equal(x, value)
})

test('async resolve', async () => {
  const value = 1
  const x = await pipe(Promise.resolve(value)).run()

  assert.equal(x, value)
})

test('single value pipe', async () => {
  const value = 1

  const x = await pipe(value)
    .to(x => x * 2)
    .run()

  assert.equal(x, value * 2)
})

test('multi value map', async () => {
  const value = [1, 2]
  const result = [2, 4]

  const x = await pipe(value)
    .map(x => x * 2)
    .run()

  assert.equal(x, result)
})

test('pipe closure sequenced', async () => {
  const basePipe = pipe(1).to(x => x * 2)
  const otherPipe = pipe(basePipe).to(x => x * 3)

  assert.equal(await basePipe.run(), 2)
  assert.equal(await otherPipe.run(), 6)
})

test('pipe closure reverse sequenced', async () => {
  const basePipe = pipe(1).to(x => x * 2)
  const otherPipe = pipe(basePipe).to(x => x * 3)

  assert.equal(await otherPipe.run(), 6)
  assert.equal(await basePipe.run(), 2)
})

test('async and sync mixed data mapper', async () => {
  const dataFetcher = async () => [1, 2, 3, 4]
  const expectedResult = [2, 4, 6, 8]

  const result = await pipe(dataFetcher)
    .to(x => Promise.all(x))
    .map(x => x * 2)
    .run()

  assert.equal(result, expectedResult)
})

test.run()
