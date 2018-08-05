import { Button, Classes, MenuItem } from '@blueprintjs/core'
import Settings from 'components/Sidebar/Settings'
import { injectState } from 'freactal'
import * as React from 'react'
import { IFileTreeNode } from 'typings/client'
import { environmentKeyConfig } from 'utils/constants'
import { getNodeFilePath } from 'utils/files'
import { sendTTYKeystroke } from 'wsenv/methods/terminal'

import {
  ActionWrapper,
  DialogBody,
  DialogWrapper,
  FilesWrapper,
  FileTabs,
  FileTabItem,
  HeaderWrapper,
  SubActionWrapper
} from './styledComponents'

interface FreactalProps {
  effects: any
  fullView: boolean
  disableAction: boolean
  terminalView: boolean
  instanceId: string
  currFileId: string
  fileTree: IFileTreeNode[]
  workspace: {
    environmentKey: string
  }
}

interface IProps {
  onFileChange?: (file: IFileTreeNode) => void
}
interface IStates {
  showSettings: boolean
}

class Header extends React.Component<IProps & FreactalProps, IStates> {
  state: IStates = {
    showSettings: false
  }

  toggleSettingsDialog = () => {
    this.setState({ showSettings: !this.state.showSettings })
  }

  handleSettingsClick = () => {
    if (this.props.fullView) {
      this.props.effects.setFullView(false)
    } else {
      this.props.effects.setFullView(true)
    }
  }

  handleTerminalClick = () => {
    if (this.props.terminalView) {
      this.props.effects.setEditorView()
    } else {
      this.props.effects.setMixedView()
    }
  }

  handleRunClick = () => {
    if (this.props.instanceId) {
      if (!this.props.terminalView) {
        this.props.effects.setMixedView()
      }
      sendTTYKeystroke(
        this.props.instanceId,
        environmentKeyConfig[this.props.workspace.environmentKey].execCmd(
          getNodeFilePath(this.props.currFileId, this.props.fileTree)
        )
      )
    }
  }

  handleFileClick = (file: IFileTreeNode) => () => {
    const { currFileId } = this.props
    if (this.props.onFileChange && file.id != currFileId) {
      this.props.onFileChange(file)
    }
  }

  render() {
    const { fileTree, fullView, currFileId, disableAction } = this.props

    return (
      <HeaderWrapper>
        <FilesWrapper>
          {fileTree &&
            <FileTabs>
              {fileTree.map(file =>
                <FileTabItem key={file.id} onClick={this.handleFileClick(file)}>
                  <span className={file.id == currFileId ? 'active' : ''}>
                    {file.filePath}
                  </span>
                </FileTabItem>
              )}
            </FileTabs>}
        </FilesWrapper>
        <ActionWrapper>
          {!fullView &&
            !disableAction &&
            <SubActionWrapper>
              <Button iconName="cog" onClick={this.toggleSettingsDialog} />
              <DialogWrapper
                iconName="inbox"
                isOpen={this.state.showSettings}
                onClose={this.toggleSettingsDialog}
                title="Settings"
              >
                <DialogBody>
                  <Settings />
                </DialogBody>
                {/* <DialogFooter>
                  <DialogFooterActions>
                    <Button onClick={this.toggleSettingsDialog} text="Close" />
                  </DialogFooterActions>
                </DialogFooter> */}
              </DialogWrapper>
              <Button
                iconName="application"
                onClick={this.handleTerminalClick}
              />
            </SubActionWrapper>}
          {!disableAction &&
            <Button text="Run" iconName="code" onClick={this.handleRunClick} />}
        </ActionWrapper>
      </HeaderWrapper>
    )
  }
}

export default injectState<IProps>(Header, [
  'fullView',
  'terminalView',
  'instanceId',
  'workspace',
  'fileTree',
  'currFileId',
  'disableAction'
])
