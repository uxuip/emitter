# @uxuip/emitter

> Simple event emitter/pubsub library.

* Only 300~ bytes (minified).
* The `on` method returns `unbind` function. You don’t need to save
  callback to variable for `removeListener`.
* TypeScript and ES modules support.
* Implementation using Map and Set

```js
import { createEmitter } from '@uxuip/emitter'

const emitter = createEmitter()
const result = []

const unbind = emitter.on('tick', (value1, value2) => {
  result.push(value1 + value2)
})

emitter.emit('tick', 2, 4)
unbind()
emitter.emit('tick', 2, 4)

console.log(result) // [6]
```
* [Install](#install)
* [TypeScript](#typescript)
* [Add Listener](#add-listener)
* [Remove Listener](#remove-listener)
* [Execute Listeners](#execute-listeners)
* [Events List](#events-list)
* [Once](#once)
* [Remove All Listeners](#remove-all-listeners)

## Install

```sh
npm install @uxuip/emitter
```

## TypeScript

accepts interface with event name
to listener argument types mapping.

```ts
import { createEmitter, EventsMap } from '@uxuip/emitter'

interface Events extends EventsMap {
  set: [name: string, count: number]
  plus: [number, number]
  push: [...number[]]
  call: []
}
// or
// type Events = {}

const emitter = createEmitter<Events>()

// Correct calls:
emitter.emit('set', 'prop', 1)
emitter.emit('plus', 2, 2)
emitter.emit('push', 1, 2, 3, 4)
emitter.emit('call')

// Compilation errors:
emitter.emit('set', 'prop', '1')
emitter.emit('plus', '2', 2)
emitter.emit('push', '1', 2, 3, 4)
emitter.emit('call', '1')
```

## Add Listener

Use `on` method to add listener for specific event:

```js
emitter.on('tick', (number) => {
  console.log(number)
})

emitter.emit('tick', 1)
// Prints 1
emitter.emit('tick', 5)
// Prints 5
```

## Remove Listener

Methods `on` returns `unbind` function. Call it and this listener
will be removed from event.

```js
const unbind = emitter.on('tick', (number) => {
  console.log(`on ${number}`)
})

emitter.emit('tick', 1)
// Prints "on 1"

unbind()
emitter.emit('tick', 2)
// Prints nothing
```

## Execute Listeners

Method `emit` will execute all listeners. First argument is event name, others
will be passed to listeners.

```js
emitter.on('tick', (a, b) => {
  console.log(a, b)
})
emitter.emit('tick', 1, 'one')
// Prints 1, 'one'
```

## Events List

You can get used events list by `events` property.

```js
const unbind = emitter.on('tick', () => { })
console.log(emitter.listens)
// Map
```

## Once

If you need add event listener only for first event dispatch,
you can use this snippet:

```js
const unbind = emitter.on('tick', (...args) => {
  unbind()
  console.log(...args)
})
emitter.emit('tick', 1, 2)
// 1 2
```

## Remove All Listeners

```js
emitter.on('event1', () => {})
emitter.on('event2', () => {})

emitter.listens.clear()
```
