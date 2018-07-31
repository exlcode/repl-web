import * as React from 'react'
import { IFileTreeNode } from 'typings/client'
import FileNode from './FileNode'
import { injectState } from 'freactal'
import RootNode from 'components/Sidebar/Files/FileNode/Root'

interface FreactalProps {
  currFileId: string
  fileTree: IFileTreeNode[]
}
interface IProps {}

class FileTree extends React.Component<IProps & FreactalProps, {}> {
  private renderNodes(
    treeNodes: IFileTreeNode[],
    currentPath?: number[]
  ): React.ReactNode {
    if (!treeNodes || !treeNodes.length) {
      return null
    }

    return treeNodes.map((node, i) => {
      const elementPath = currentPath.concat(i)
      return (
        <ul key={node.id} className="pt-tree-root pt-tree-node-list">
          <FileNode
            {...node}
            active={node.id === this.props.currFileId}
            depth={elementPath.length}
            path={elementPath}
          >
            {this.renderNodes(node.childNodes, elementPath)}
          </FileNode>
        </ul>
      )
    })
  }

  render() {
    // console.log(this.props.fileTree)
    return (
      <div className="pt-tree">
        <ul className="pt-tree-root pt-tree-node-list">
          <RootNode>
            {this.renderNodes(this.props.fileTree, [])}
          </RootNode>
        </ul>
      </div>
    )
  }
}

export default injectState<IProps>(FileTree, ['fileTree', 'currFileId'])
