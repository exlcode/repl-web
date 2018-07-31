import { eventStore, requestStore } from 'wsenv/store'
import client from './client'
import {
  MESSAGE_TYPES,
  WS_EVENTS,
  WS_METHODS,
  WS_TIMEOUT
} from 'wsenv/constants'
import * as uuid from 'uuid'

export const send = <T>(method: WS_METHODS, data: any): Promise<T> => {
  const requestId = uuid.v4()
  const res = client.sendEvent(MESSAGE_TYPES.request, {
    method,
    id: requestId,
    data
  })

  // Add handler to store
  return new Promise((resolve, reject) => {
    requestStore.add(requestId, method, (err: Error, payload: any) => {
      clearTimeout(wsTimeout)
      if (err) {
        reject(err)
      } else {
        resolve(payload)
      }
    })
    const wsTimeout = setTimeout(() => {
      requestStore.remove(requestId, 'Request has timed out')
    }, WS_TIMEOUT)
  })
}

export const sendEvent = (event: WS_EVENTS, data: any) => {
  client.sendEvent(MESSAGE_TYPES.notif, {
    event: event,
    data
  })
}

export const registerEventHandler = (
  eventName: WS_EVENTS,
  handler: (data: any) => void
): monaco.IDisposable => {
  if (!eventName || typeof handler !== 'function') {
    throw new Error('Please provide valid arguments to #registerEventHandler')
  }
  eventStore.add(eventName, handler)
  return {
    dispose: () => {
      eventStore.remove(eventName, handler)
    }
  }
}
