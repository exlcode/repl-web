import * as React from 'react'
import { FullSize } from 'styles/styledComponents'
import Header from 'components/Header/index'
import Editor from 'components/Editor/index'
import Workbench from 'components/Workbench/index'
import { injectState, provideState, softUpdate, hardUpdate } from 'freactal'
import { SplitPane } from './styledComponents'

interface IProps {}
interface IState {
  height: number
}
interface FreactalProps {
  effects: any
  state: FreactalState & ParentFreactalState
}
interface FreactalState {
  dragging: boolean
  terminalView: boolean
  editorView: boolean
}
interface ParentFreactalState {
  fullView: boolean
}

class EditorPane extends React.Component<FreactalProps, IState> {
  state = {
    height: window.innerHeight
  }

  componentDidMount() {
    if (!this.props.state.fullView) {
      this.props.effects.setEditorView()
    }
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    this.setState({
      height: window.innerHeight
    })
  }

  isDragging = (dragging: boolean) => () => {
    this.props.effects.setDragging(dragging)
  }

  render() {
    const { state: { terminalView, editorView, fullView } } = this.props
    const allowResize = terminalView && editorView

    return (
      <FullSize>
        {fullView && <Header />}
        <SplitPane
          hasHeader={fullView}
          split="horizontal"
          defaultSize="75%"
          minSize={300}
          maxSize={this.state.height - 150}
          onDragFinished={this.isDragging(false)}
          onDragStarted={this.isDragging(true)}
          allowResize={allowResize}
          resizerStyle={{
            visibility: allowResize ? 'visible' : 'hidden'
          }}
          pane1Style={{
            minHeight: !terminalView && editorView ? '100%' : 0,
            maxHeight: !editorView && 0
          }}
          pane2Style={{
            display: terminalView ? 'block' : 'none',
            minHeight: 100,
            height: !editorView && terminalView ? '100%' : 'inherit'
          }}
        >
          <Editor />
          <Workbench />
        </SplitPane>
      </FullSize>
    )
  }
}

export default provideState<FreactalState, IProps>({
  initialState: () => ({
    dragging: false,
    terminalView: true,
    editorView: true
  }),
  effects: {
    setDragging: softUpdate((state, dragging) => ({ dragging })),
    setMixedView: hardUpdate({ terminalView: true, editorView: true }),
    setTerminalView: hardUpdate({ terminalView: true, editorView: false }),
    setEditorView: hardUpdate({ editorView: true, terminalView: false })
  }
})(injectState<{}>(EditorPane))
