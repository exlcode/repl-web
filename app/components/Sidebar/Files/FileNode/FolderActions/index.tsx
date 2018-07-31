import * as React from 'react'
import { ActionsWrapper } from '../styledComponents'
import { Button } from '@blueprintjs/core'
import { generateFileNode, generateFolderNode } from 'utils/files'
import { IFileTreeNode } from 'typings/client'
import { injectState } from 'freactal'

interface FreactalProps {
  effects: {
    addFileNode: (path: number[], fileNode: IFileTreeNode) => void
  }
}
interface IProps {
  path: number[]
  onAction?: () => void
}

class FolderActions extends React.Component<IProps & FreactalProps, {}> {
  static defaultProps = {
    onAction: () => {}
  }

  addFile = async (e: React.MouseEvent<any>) => {
    e.stopPropagation()
    this.props.onAction()
    const node = generateFileNode()
    this.props.effects.addFileNode(this.props.path, node)
  }

  addFolder = async (e: React.MouseEvent<any>) => {
    e.stopPropagation()
    this.props.onAction()
    const node = generateFolderNode()
    this.props.effects.addFileNode(this.props.path, node)
  }

  render() {
    return (
      <ActionsWrapper className="pt-tree-node-secondary-label">
        <Button
          iconName="document-share"
          className="pt-minimal pt-icon-small"
          onClick={this.addFile}
        />
        <Button
          iconName="folder-shared"
          className="pt-minimal pt-icon-small"
          onClick={this.addFolder}
        />
      </ActionsWrapper>
    )
  }
}

export default injectState<IProps>(FolderActions)
