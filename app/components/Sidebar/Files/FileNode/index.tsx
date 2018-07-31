import * as React from 'react'
import { IFileTreeNode } from 'typings/client'
import { Collapse } from '@blueprintjs/core'
import FolderActions from './FolderActions'
import FileActions from './FileActions'
import * as classNames from 'classnames'
import { injectState } from 'freactal'
import { NameWrapper } from 'components/Sidebar/Files/FileNode/styledComponents'
import { environmentKeyConfig, validFolderRegex } from 'utils/constants'
import { createFile, deleteFile } from 'wsenv/methods'
import {
  addPathComponent,
  getNodeFilePath,
  getBaseName,
  addPathPrefix
} from 'utils/files'
import { moveFile } from 'wsenv/methods/files'
import MonacoProvider from 'wsenv/monaco'

interface IState {
  isRenaming: boolean
  name: string
}

interface FreactalProps {
  state: {
    workspace: {
      environmentKey: string
      id: string
    }
    fileTree: IFileTreeNode[]
    provider: MonacoProvider
  }
  effects: {
    setFileNodeOpen: (fileId: string, open: boolean) => void
    setCurrFileId: (fileID: string) => void
    removeFileNode: (fileId: string) => void
    setFileNodeName: (fileId: string, fileName: string) => void
  }
}
interface IProps extends IFileTreeNode {
  depth: number
  path: number[]
  active?: boolean
  children?: React.ReactNode
}

class FileNode extends React.Component<IProps & FreactalProps, IState> {
  static defaultProps = {
    isRoot: false
  }

  state = {
    isRenaming: !this.props.filePath,
    name: this.props.filePath
  }

  handleRenameConfirm = async (newName: string) => {
    const { workspace: { environmentKey, id: workspaceId } } = this.props.state
    if (
      (!this.props.isDir &&
        environmentKeyConfig[environmentKey].validFileRegex.test(newName)) ||
      (this.props.isDir && validFolderRegex.test(newName))
    ) {
      const { filePath } = this.props
      const oldFilePath = getNodeFilePath(
        this.props.id,
        this.props.state.fileTree
      )
      const newFilePath = addPathComponent(getBaseName(oldFilePath), newName)
      if (!filePath) {
        this.props.state.provider.addFileModel(newFilePath, this.props.contents)

        // Node not initialized in wsenv
        await createFile({
          environmentKey,
          workspaceId,
          contents: this.props.contents,
          filePath: addPathPrefix(newFilePath, environmentKey),
          isDir: this.props.isDir
        })
      } else {
        // Node already initialized
        await this.props.state.provider.moveFile(
          oldFilePath,
          newFilePath,
          this.props.active
        )
      }
      this.props.effects.setFileNodeName(this.props.id, newName)
    } else {
      // console.log(`Invalid file name: ${newName}`)
      newName = this.props.filePath
    }
    this.setState({
      isRenaming: false,
      name: newName
    })
  }

  handleRenameCancel = () => {
    this.setState({
      isRenaming: false
    })
  }

  handleRenameClick = (e: React.MouseEvent<any>) => {
    e.stopPropagation()
    this.setState({
      isRenaming: true
    })
  }

  handleNameChange = (value: string) => {
    this.setState({
      name: value
    })
  }

  open = () => {
    this.props.effects.setFileNodeOpen(this.props.id, true)
  }

  handleClick = () => {
    if (this.props.isDir) {
      this.props.effects.setFileNodeOpen(this.props.id, !this.props.open)
    } else {
      this.props.effects.setCurrFileId(this.props.id)
    }
  }

  handleDelete = async (e: React.MouseEvent<any>) => {
    e.stopPropagation()
    const {
      state: { workspace: { id, environmentKey }, fileTree }
    } = this.props
    const filePath = getNodeFilePath(this.props.id, fileTree)
    await this.props.state.provider.deleteFile(filePath)
    this.props.effects.removeFileNode(this.props.id)
  }

  render() {
    const {
      depth,
      children,
      active,
      path,
      open,
      isDir,
      childNodes
    } = this.props
    const { isRenaming, name } = this.state

    const containerClasses = classNames('pt-tree-node', {
      'pt-tree-node-selected': active,
      'pt-tree-node-expanded': open
    })
    const contentClasses = classNames(
      'pt-tree-node-content',
      `pt-tree-node-content-${depth}`
    )
    const showCaret = childNodes ? childNodes.length > 0 : false
    const caretState = open
      ? 'pt-tree-node-caret-open'
      : 'pt-tree-node-caret-close'
    const caretClasses = classNames(
      showCaret ? 'pt-tree-node-caret' : 'pt-tree-node-caret-none',
      'pt-icon-standard',
      { [caretState]: showCaret }
    )
    const fileIcon = classNames(
      'pt-tree-node-icon',
      'pt-icon-standard',
      isDir ? 'pt-icon-folder' : 'pt-icon-document'
    )

    return (
      <li className={containerClasses}>
        <div className={contentClasses} onClick={this.handleClick}>
          <span className={caretClasses} />
          <span className={fileIcon} />
          <NameWrapper
            placeholder=""
            disabled={!isRenaming}
            isEditing={isRenaming}
            value={name}
            onChange={this.handleNameChange}
            onConfirm={this.handleRenameConfirm}
            onCancel={this.handleRenameCancel}
          />
          <FileActions
            onDelete={this.handleDelete}
            onRename={this.handleRenameClick}
          />
          {isDir && <FolderActions path={path} onAction={this.open} />}
        </div>
        <Collapse isOpen={open}>
          {children}
        </Collapse>
      </li>
    )
  }
}

export default injectState<IProps>(FileNode)
