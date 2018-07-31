import * as React from 'react'
import * as classNames from 'classnames'
import { Collapse } from '@blueprintjs/core'
import FolderActions from './FolderActions'

interface IState {
  open: boolean
}

interface IProps {
  children?: React.ReactNode
}

export default class RootNode extends React.Component<IProps, IState> {
  state = {
    open: false
  }

  handleClick = () => {
    this.setState({
      open: !this.state.open
    })
  }

  handleOpen = () => {
    this.setState({
      open: true
    })
  }

  render() {
    const { open } = this.state
    const { children } = this.props

    const containerClasses = classNames('pt-tree-node', {
      'pt-tree-node-expanded': open
    })
    const contentClasses = classNames(
      'pt-tree-node-content',
      `pt-tree-node-content-0`
    )
    const caretState = open
      ? 'pt-tree-node-caret-open'
      : 'pt-tree-node-caret-close'
    const caretClasses = classNames(
      'pt-tree-node-caret',
      'pt-icon-standard',
      caretState
    )
    const fileIcon = classNames('pt-tree-node-icon', 'pt-icon-standard')

    return (
      <li className={containerClasses}>
        <div className={contentClasses} onClick={this.handleClick}>
          <span className={caretClasses} />
          <span className={fileIcon} />
          <span className="pt-tree-node-label">Project</span>
          <FolderActions path={[]} onAction={this.handleOpen} />
        </div>
        <Collapse isOpen={open}>
          {children}
        </Collapse>
      </li>
    )
  }
}
