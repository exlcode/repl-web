import * as React from 'react'
import { Wrapper } from 'components/Sidebar/Workspace/styledComponents'

interface IProps {}

export default class WorkspaceTab extends React.Component<IProps, {}> {
  render() {
    return (
      <Wrapper>
        <label className="pt-label .modifier">
          Name
          <input
            className="pt-input"
            style={{ width: 200 }}
            type="text"
            placeholder="Workspace name..."
            dir="auto"
          />
        </label>
      </Wrapper>
    )
  }
}
