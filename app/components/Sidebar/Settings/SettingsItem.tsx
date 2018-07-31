import * as React from 'react'
import { SettingsItemWrapper } from './styledComponents'

interface IProps {
  title: string
  input: React.ReactElement<any>
}

export default ({ title, input }: IProps): React.ReactElement<any> =>
  <SettingsItemWrapper>
    <div style={{ marginRight: '0.4rem' }}>
      {title}
    </div>
    {input}
  </SettingsItemWrapper>
