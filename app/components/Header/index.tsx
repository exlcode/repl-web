import * as React from 'react'
import {
  ChevronIcon,
  Wrapper,
  Button,
  Section,
  ViewModeButtons,
  ModeButton
} from './styledComponents'
import { Tooltip, Position } from '@blueprintjs/core'
import { injectState } from 'freactal'

interface FreactalProps {
  effects: any
  sidebarOpen: boolean
  editorView: boolean
  terminalView: boolean
}

class Header extends React.Component<FreactalProps, {}> {
  handleChevronClick = () => {
    this.props.effects.setSidebarOpen(!this.props.sidebarOpen)
  }

  render() {
    const {
      sidebarOpen,
      terminalView,
      editorView,
      effects: { setTerminalView, setMixedView, setEditorView }
    } = this.props

    return (
      <Wrapper>
        <Section>
          <Tooltip
            position={Position.BOTTOM_LEFT}
            content={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <ChevronIcon
              onClick={this.handleChevronClick}
              sidebarOpen={sidebarOpen}
              className="pt-icon-chevron-left"
            />
          </Tooltip>
          <Tooltip position={Position.BOTTOM} content="Star">
            <Button className="pt-icon-star pt-button" />
          </Tooltip>
          <Button className="pt-button pt-icon-fork">Fork</Button>
          <Button className="pt-button pt-icon-share">Share</Button>
        </Section>
        <Section>
          <ViewModeButtons className="pt-button-group">
            <ModeButton
              className={`pt-button ${!terminalView &&
                editorView &&
                'pt-active'}`}
              onClick={setEditorView}
            >
              Editor
            </ModeButton>
            <ModeButton
              className={`pt-button ${terminalView &&
                editorView &&
                'pt-active'}`}
              onClick={setMixedView}
            >
              Split
            </ModeButton>
            <ModeButton
              className={`pt-button ${!editorView &&
                terminalView &&
                'pt-active'}`}
              onClick={setTerminalView}
            >
              Terminal
            </ModeButton>
          </ViewModeButtons>
        </Section>
      </Wrapper>
    )
  }
}

export default injectState<{}>(Header, [
  'sidebarOpen',
  'terminalView',
  'editorView'
])
