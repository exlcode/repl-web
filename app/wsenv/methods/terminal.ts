import { WS_METHODS, WS_EVENTS } from 'wsenv/constants'
import { send, sendEvent } from 'wsenv'
import { IInstanceCreateResp } from 'typings/wsenv'

// only send active workspace
export const createTermInstance = (workspaceId: string) =>
  send<IInstanceCreateResp>(WS_METHODS.terminalCreateInstance, {
    workspaces: [{ id: workspaceId }]
  })

export const terminateTermInstance = (instanceId: string) =>
  send<void>(WS_METHODS.terminalTerminateInstance, {
    instanceId
  })

/* Events */
export const sendTTYKeystroke = (instanceId: string, keystroke: string) => {
  sendEvent(WS_EVENTS.instanceTTY, {
    instanceId,
    body: `0${keystroke}`
  })
}

export const sendTTYResize = (
  instanceId: string,
  columns: number,
  rows: number
) => {
  const body = `2${JSON.stringify({ columns, rows })}`
  sendEvent(WS_EVENTS.instanceTTY, {
    instanceId,
    body
  })
}
