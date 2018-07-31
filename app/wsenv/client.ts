import { SIGNAL_API_URL, WS_URL } from '../utils/constants'
import { requestStore, eventStore } from './store'
import { MESSAGE_TYPES } from 'wsenv/constants'
import axios from 'axios'
const ReconnectingWebSocket = require('reconnecting-websocket')

let client = null as any

const setupClient = () => {
  client.sendEvent = (type: MESSAGE_TYPES, payload: { [k: string]: any }) => {
    waitForConnection(() => {
      return client.send(
        JSON.stringify({
          type: type,
          payload: payload
        })
      )
    })
  }

  client.onmessage = (ev: MessageEvent) => {
    const { payload, type } = JSON.parse(ev.data)
    switch (type) {
      case MESSAGE_TYPES.response:
        const { reqId } = payload
        const { method, callback } = requestStore.get(reqId)
        if (payload.error) {
          const message = `[${method}] WS Response error: ${payload.error}`
          console.error(message)
          callback(new Error(message), null)
        } else {
          callback(null, payload ? payload.data : null)
        }
        requestStore.remove(reqId)
        break
      case MESSAGE_TYPES.error:
        console.error(payload.error)
        break
      case MESSAGE_TYPES.notif:
        const eventName = payload.event
        // console.log(`[${eventName}] Event received: ${payload.data}`)
        eventStore.get(eventName).forEach(callback => {
          callback(payload.error, payload.data)
        })
        break
      default:
        // console.error(`Invalid message type provided: ${type}`)
        break
    }
  }

  client.onerror = (ev: ErrorEvent) => {
    console.error(ev.message)
  }

  client.onclose = (ev: CloseEvent) => {
    // console.log(`CLOSED WEBSOCKETS CONNECTION: ${ev.reason}`)
    // display message to user indicating that a page refresh is needed
  }
}

if (WS_URL) {
  client = new ReconnectingWebSocket(WS_URL)
  setupClient()
} else {
  axios
    .get(SIGNAL_API_URL)
    .then(resp => {
      client = new ReconnectingWebSocket(resp.data.ws_endpoint)
      setupClient()
    })
    .catch(error => {
      console.error(
        'An error occurred fetching from the WSENV signalling server: ',
        error
      )
    })
}

const waitForConnection = (callback: () => void, interval: number = 500) => {
  if (client && client.readyState === 1) {
    callback()
  } else {
    // optional: implement backoff for interval here
    setTimeout(() => {
      waitForConnection(callback, interval)
    }, interval)
  }
}

export default client
