import * as React from 'react'
import * as Xterm from 'xterm'
import 'xterm/dist/xterm.css'
import { FullSize } from 'styles/styledComponents'
import { injectState } from 'freactal'
import { Simulate } from 'react-dom/test-utils'
import drag = Simulate.drag
import { eventStore } from 'wsenv/store'
import { WS_EVENTS } from 'wsenv/constants'
import { ITTYEventResp } from 'typings/wsenv'
;(Xterm as any).loadAddon('fit')
import {
  createTermInstance,
  terminateTermInstance,
  sendTTYKeystroke,
  sendTTYResize
} from 'wsenv/methods/terminal'

interface FreactalProps {
  effects: {
    setInstanceId: (instanceId: string) => void
  }
  state: {
    dragging: boolean
    terminalView: boolean
    editorView: boolean
    workspace: {
      id: string
    }
    instanceId: string
  }
}
interface IProps {}

class Terminal extends React.Component<IProps & FreactalProps, {}> {
  terminal: Xterm
  instanceId: string

  componentWillReceiveProps(nextProps: IProps & FreactalProps) {
    const { state: { dragging, terminalView } } = nextProps
    if (
      (this.props.state.dragging !== dragging && !dragging) ||
      (terminalView &&
        (!this.props.state.editorView || !this.props.state.terminalView))
    ) {
      this.terminal.fit()
    }
  }

  componentDidUpdate(prevProps: IProps & FreactalProps) {
    if (prevProps.state.workspace.id !== this.props.state.workspace.id) {
      this.initTerminal()
    }

    if (this.props.state.terminalView && !prevProps.state.terminalView) {
      window.requestAnimationFrame(() => {
        this.terminal.fit()
      })
    }
  }

  componentWillUnmount() {
    if (this.instanceId) {
      terminateTermInstance(this.instanceId)
      this.unregisterHandlers()
    }
    this.terminal.destroy()
  }

  unregisterHandlers() {
    this.terminal.off('resize', this.termResizeHandler)
    this.terminal.off('key', this.termKeyHandler)
    this.terminal.off('paste', this.termKeyHandler)
    eventStore.remove(WS_EVENTS.instanceTTY, this.ttyListener)
    this.props.effects.setInstanceId(null)
  }

  registerHandlers() {
    this.terminal.on('resize', this.termResizeHandler)
    this.terminal.on('key', this.termKeyHandler)
    this.terminal.on('paste', this.termKeyHandler)
    eventStore.add(WS_EVENTS.instanceTTY, this.ttyListener)
  }

  termResizeHandler = (size: { cols: number; rows: number }) => {
    sendTTYResize(this.instanceId, size.cols, size.rows)
  }

  termKeyHandler = (key: string) => {
    sendTTYKeystroke(this.instanceId, key)
  }

  ttyListener = (err: Error, data: ITTYEventResp) => {
    if (data.instanceId === this.instanceId && data.body[0] === '0') {
      this.terminal.write(window.atob(data.body.slice(1)))
    }
  }

  async initTerminal() {
    try {
      this.registerHandlers()
      // console.log('CALLED')
      const { instanceId } = await createTermInstance(
        this.props.state.workspace.id
      )
      this.instanceId = instanceId
      this.props.effects.setInstanceId(instanceId)
      this.terminal.fit()
    } catch (err) {
      // console.log(`Error instantiating new terminal: ${err}`)
    }
  }

  async componentDidMount() {
    this.terminal = new Xterm({
      cursorBlink: true
    })
    this.terminal.open(document.getElementById('terminal-container'), false)
    if (this.props.state.workspace.id) {
      this.initTerminal()
    }
  }

  render() {
    return <FullSize id="terminal-container" />
  }
}

export default injectState<IProps>(Terminal)
