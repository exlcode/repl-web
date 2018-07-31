import * as React from 'react'
import { FullSize } from 'styles/styledComponents'
import {
  Tab,
  TabHeader,
  Content,
  TabText
} from 'components/Workbench/styledComponents'
import Terminal from './Terminal'
import Preview from './Preview'
import ServerInfo from './ServerInfo'

const tabs: Tab[] = ['Terminal', 'Preview', 'Server Info']
type Tab = 'Terminal' | 'Preview' | 'Server Info'

interface IProps {}
interface IState {
  tab: Tab
}

export default class Workbench extends React.Component<IProps, IState> {
  state = {
    tab: 'Terminal' as Tab
  }

  handleTabClick = (tab: Tab) => () => {
    this.setState({
      tab
    })
  }

  render() {
    const { tab: currentTab } = this.state

    return (
      <FullSize fadeIn={true}>
        <TabHeader>
          {tabs.map((tab: Tab) =>
            <Tab key={tab} onClick={this.handleTabClick(tab)}>
              <TabText active={currentTab === tab}>
                {tab}
              </TabText>
            </Tab>
          )}
        </TabHeader>
        <Content>
          {currentTab === 'Terminal' && <Terminal />}
          {currentTab === 'Preview' && <Preview />}
          {currentTab === 'Server Info' && <ServerInfo />}
        </Content>
      </FullSize>
    )
  }
}
