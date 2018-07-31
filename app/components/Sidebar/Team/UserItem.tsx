import * as React from 'react'
import {
  UserItemWrapper,
  CrossIcon,
  Right,
  TitleWrapper
} from './styledComponents'

interface IProps {
  name: string
  disabled?: boolean
}

export default class UserItem extends React.Component<IProps, {}> {
  handleCrossClick = () => {}

  static defaultProps = {
    disabled: false
  }

  render() {
    const { name, disabled } = this.props

    return (
      <UserItemWrapper>
        <TitleWrapper>
          {name}
        </TitleWrapper>
        <Right>
          <div className="pt-select">
            <select disabled={disabled}>
              <option selected={true}>Can edit</option>
              <option value="1">Can view</option>
              <option value="2">Can comment</option>
            </select>
          </div>
          {!disabled &&
            <CrossIcon
              className="pt-icon-cross"
              onClick={this.handleCrossClick}
            />}
        </Right>
      </UserItemWrapper>
    )
  }
}
