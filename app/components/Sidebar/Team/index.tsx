import * as React from 'react'
import { Wrapper } from './styledComponents'
import UserItem from './UserItem'

interface IProps {}

export default class TeamTab extends React.Component<IProps, {}> {
  render() {
    const userItems = [{ name: 'Daniel' }, { name: 'Sasha' }]

    return (
      <Wrapper>
        {userItems.map((item: any, idx: number) =>
          <UserItem key={idx} name={item.name} />
        )}
      </Wrapper>
    )
  }
}
