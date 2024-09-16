export type EventType = string | number | symbol
export type EventsMap = Record<EventType, any[]>

export interface Unsubscribe {
  (): void
}

export type Handler<T extends any[] = any[]> = (...event: T) => void

export const createEmitter = <
  Events extends EventsMap = EventsMap,
  K extends keyof Events = keyof Events,
  H extends Handler = Handler<Events[K]>,
>() => {
  const listens = new Map<K, Set<H>>()

  const off = (type: K, handler?: H): void => {
    const handlers = listens.get(type)

    if (handlers) {
      handler
        ? handlers.delete(handler)
        : handlers.clear()
    }
  }

  const on = (type: K, handler: H): Unsubscribe => {
    const handlers = listens.get(type)
    handlers ? handlers.add(handler) : listens.set(type, new Set([handler]))
    return () => off(type, handler)
  }

  const emit = (type: K, ...event: Events[K]): void => {
    const handlers = listens.get(type)
    if (handlers) {
      handlers.forEach(handler => handler(...event))
    }
  }

  return {
    on,
    emit,
    off,
    listens,
  }
}
