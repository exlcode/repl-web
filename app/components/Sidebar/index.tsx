import * as React from 'react'
import { Wrapper } from './styledComponents'
import SidebarTab from './SidebarTab'
import Workspace from 'components/Sidebar/Workspace/index'
import Files from 'components/Sidebar/Files'
import Team from 'components/Sidebar/Team'
import Settings from 'components/Sidebar/Settings'

interface IProps {}

export default class Sidebar extends React.Component<IProps, {}> {
  render() {
    return (
      <Wrapper>
        <SidebarTab defaultOpen={true} title="Workspace">
          <Workspace />
        </SidebarTab>
        <SidebarTab title="Files" noPadding={true}>
          <Files />
        </SidebarTab>
        <SidebarTab title="Team">
          <Team />
        </SidebarTab>
        <SidebarTab title="Settings">
          <Settings />
        </SidebarTab>
        <SidebarTab title="Chat" />
      </Wrapper>
    )
  }
}
