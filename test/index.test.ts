import { assert, expect, expectTypeOf, it } from 'vitest'
import { createEmitter } from '../src/index'

it('initialize', () => {
  const emitter = createEmitter()
  expectTypeOf(emitter.on).toBeFunction()
  expectTypeOf(emitter.emit).toBeFunction()
  expectTypeOf(emitter.off).toBeFunction()
  expect(emitter.listens).toBeInstanceOf(Map)
})

it('adds listeners', () => {
  const emitter = createEmitter()
  emitter.on('one', () => true)
  emitter.on('two', () => true)
  emitter.on('two', () => true)
  expect(emitter.listens.get('one')?.size).eq(1)
  expect(emitter.listens.get('two')?.size).eq(2)
})

it('call listener', () => {
  const emitter = createEmitter()
  const result: number[] = []

  const unbind = emitter.on('tick', (value1, value2) => {
    result.push(value1 + value2)
  })

  emitter.emit('tick', 2, 4)
  unbind()
  emitter.emit('tick', 2, 4)

  expect(result).toEqual([6])
})

it('calls listeners', () => {
  const emitter = createEmitter<{
    push: [number, number, ...number[]]
  }>()
  const result: number[][] = []

  emitter.on('push', (...args) => {
    result.push(args)
  })

  emitter.emit('push', 1, 1)
  emitter.emit('push', 2, 2)
  emitter.emit('push', 3, 3, 3)

  expect(result).toEqual([[1, 1], [2, 2], [3, 3, 3]])
})

it('unbinds listener', () => {
  const emitter = createEmitter<{
    push: [number]
  }>()
  const result1: number[] = []
  const result2: number[] = []

  const unbind = emitter.on('push', (value) => {
    result1.push(value)
  })
  emitter.on('push', (value) => {
    result2.push(value)
  })

  emitter.emit('push', 1)
  unbind()
  emitter.emit('push', 2)

  expect(result1).toEqual([1])
  expect(result2).toEqual([1, 2])
})

it('off listener', () => {
  const emitter = createEmitter()
  const result: number[] = []

  function calc(value1, value2) {
    result.push(value1 + value2)
  }
  emitter.on('tick', calc)

  emitter.emit('tick', 2, 4)
  emitter.off('tick', calc)
  emitter.emit('tick', 2, 4)

  expect(result).toEqual([6])
})

it('off listeners', () => {
  const emitter = createEmitter()
  const result: number[] = []

  function calc1(value1, value2) {
    result.push(value1 + value2)
  }
  function calc2(value1, value2) {
    result.push(value1 + value2)
  }

  emitter.on('calc', calc1)
  emitter.on('calc', calc2)

  emitter.emit('calc', 2, 4)
  emitter.off('calc')
  emitter.emit('calc', 2, 4)

  expect(result).toEqual([6, 6])
})

it('calls unbind after cleaning events', () => {
  const emitter = createEmitter()
  const unbind = emitter.on('event', () => undefined)
  emitter.listens.clear()
  assert.doesNotThrow(() => {
    unbind()
  })
})

it('removes event on no listeners', () => {
  const emitter = createEmitter()
  const unbind1 = emitter.on('one', () => {})
  const unbind2 = emitter.on('one', () => {})

  unbind1()
  expect(emitter.listens.get('one')?.size).eq(1)

  unbind1()
  expect(emitter.listens.get('one')?.size).eq(1)

  unbind2()
  expect(emitter.listens.get('one')?.size).eq(0)

  unbind2()
  expect(emitter.listens.get('one')?.size).eq(0)
})

it('removes listener during event', () => {
  const ee = createEmitter()

  const calls: number[] = []
  const unbind1 = ee.on('event', () => {
    unbind1()
    calls.push(1)
  })
  ee.on('event', () => {
    calls.push(2)
  })

  ee.emit('event')
  expect(calls).toEqual([1, 2])
})
