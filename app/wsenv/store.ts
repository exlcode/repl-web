import { WS_EVENTS, WS_METHODS } from 'wsenv/constants'
interface IStoredRequest {
  method: WS_METHODS
  callback: Callback
}

class RequestStore {
  store: Map<string, IStoredRequest>

  constructor() {
    this.store = new Map()
  }

  add(id: string, method: WS_METHODS, callback: Callback) {
    this.store.set(id, {
      method,
      callback
    })
  }

  remove(id: string, error?: string) {
    if (this.store.has(id)) {
      this.store.get(id).callback(new Error(error || 'Handler removed'), null)
      this.store.delete(id)
    }
  }

  get(id: string): IStoredRequest {
    return this.store.get(id) || null
  }

  clear() {
    this.store.forEach(request => {
      request.callback(new Error('Request store cleared'), null)
    })
  }
}

class EventStore {
  store: Map<WS_EVENTS, Callback[]>

  constructor() {
    this.store = new Map()
  }

  add(eventName: WS_EVENTS, handler: Callback) {
    if (this.store.has(eventName)) {
      this.store.set(eventName, this.store.get(eventName).concat(handler))
    } else {
      this.store.set(eventName, [handler])
    }
  }

  remove(eventName: WS_EVENTS, handler?: Callback) {
    if (!handler) {
      this.store.delete(eventName)
    } else {
      this.store.set(eventName, this.get(eventName).filter(h => h !== handler))
    }
  }

  get(eventName: WS_EVENTS) {
    return this.store.get(eventName) || []
  }
}

export const requestStore = new RequestStore()
export const eventStore = new EventStore()
