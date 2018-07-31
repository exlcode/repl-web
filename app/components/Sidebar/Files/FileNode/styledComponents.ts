import styled from 'styled-components'
import { EditableText } from '@blueprintjs/core'

export const NameWrapper = styled(EditableText).attrs({
  className: 'pt-tree-node-label'
})`
  .pt-editable-input {
    color: black;
  }
`

export const ActionsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 0;
  padding: 0;
`
