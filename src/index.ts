export type EventType = string | number | symbol
export type EventsMap = Record<EventType, any[]>
export type Unsubscribe = () => void
export type Handler<T extends any[] = any[]> = (...event: T) => void

export const createEmitter = <Events extends EventsMap = EventsMap>() => {
  const listens = new Map<keyof Events, Set<Handler>>()

  const off = <K extends keyof Events>(type: K, handler?: Handler<Events[K]>): void => {
    const handlers = listens.get(type)

    if (handlers) {
      handler
        ? handlers.delete(handler)
        : handlers.clear()
    }
  }

  const on = <K extends keyof Events>(type: K, handler: Handler<Events[K]>): Unsubscribe => {
    const handlers = listens.get(type)
    handlers ? handlers.add(handler) : listens.set(type, new Set([handler]))
    return () => off(type, handler)
  }

  const emit = <K extends keyof Events>(type: K, ...event: Events[K]): void => {
    const handlers = listens.get(type)
    if (handlers) {
      handlers.forEach(handler => handler(...event))
    }
  }

  return {
    on,
    emit,
    off,
    listens: listens as Map<keyof Events, Set<Handler<Events[keyof Events]>>>,
  }
}
