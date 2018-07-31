import * as React from 'react'
import {
  ItemHeader,
  Title,
  ExpandIcon,
  ChildContainer
} from './styledComponents'

interface IProps {
  title: string
  children?: React.ReactChild
  disabled?: boolean
  noPadding?: boolean
  defaultOpen?: boolean
}

interface IState {
  open: boolean
}

export default class SidebarTab extends React.Component<IProps, IState> {
  state = {
    open: !!this.props.defaultOpen
  }

  toggleOpen = () => {
    this.setState({
      open: !this.state.open
    })
  }

  render() {
    const { children, title, disabled, noPadding } = this.props
    const { open } = this.state

    return (
      <div>
        <ItemHeader onClick={this.toggleOpen}>
          <Title>
            {title}
          </Title>
          <ExpandIcon className="pt-icon pt-icon-chevron-down" open={open} />
        </ItemHeader>
        <ChildContainer disabled={disabled} open={open} noPadding={noPadding}>
          {children}
        </ChildContainer>
      </div>
    )
  }
}
