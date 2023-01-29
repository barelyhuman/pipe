# @barelyhuman/pipe

A tiny pipe utility

![npm](https://img.shields.io/npm/v/@barelyhuman/pipe?colorA=black&colorB=black&logoColor=black)

## Why?

Tired of copying it around

## Highlights

- Tiny API
- Clonable
- Lazy Execution

## Usage

The util was built to abstract async manipulation from the actual flow and make
it look cleaner when working with arrays

This is primarily for dealing with nested function calls and hiding the async
logic

Eg:

```js
const value = await Promise.all(something.map(id => fetchById(id)))

// Could be written as
const value = await pipe(something)
  .map(id => fetchById(id))
  .to(x => Promise.all(x))
  .run()

// or if you don't like magic then, but at this point
// there's no difference between this and the original
// statement
const value = await pipe(something)
  .to(previous => previous.map(id => fetchById(id)))
  .to(x => Promise.all(x))
  .run()
```

### Clonable

The pipes are clonable and each have their own scope

A very simple example would be

Eg:

```js
const basePipe = pipe(1).to(x => x * 2)
const nextPipe = pipe(basePipe).to(x => x * 3)

const valTwo = await nextPipe.run() // 6
const valOne = await basePipe.run() // 2
```

### Lazy Execution

As shown in the examples the actual execution of the given data isn't started
unless `.run` is triggered. This makes it easier to transfer context around if
needed and in a defined sequence, also makes it easier to extend.
