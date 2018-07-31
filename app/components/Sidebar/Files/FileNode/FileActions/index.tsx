import * as React from 'react'
import { ActionsWrapper } from '../styledComponents'
import { Button } from '@blueprintjs/core'

interface IProps {
  onDelete: React.MouseEventHandler<any>
  onRename: React.MouseEventHandler<any>
}

export default ({ onDelete, onRename }: IProps) =>
  <ActionsWrapper className="pt-tree-node-secondary-label">
    <Button
      iconName="edit"
      className="pt-minimal pt-icon-small"
      onClick={onRename}
    />
    <Button
      iconName="trash"
      className="pt-minimal pt-icon-small"
      onClick={onDelete}
    />
  </ActionsWrapper>
