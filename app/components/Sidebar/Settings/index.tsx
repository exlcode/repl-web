import * as React from 'react'
import { Wrapper } from './styledComponents'
import SettingsItem from './SettingsItem'
import { Switch } from '@blueprintjs/core'

interface IProps {}

export default class SettingsTab extends React.Component<IProps, {}> {
  render() {
    return (
      <Wrapper>
        <SettingsItem
          title="Language"
          input={
            <div className="pt-select">
              <select>
                <option selected={true}>Java</option>
                <option value="1">Python 2.7</option>
              </select>
            </div>
          }
        />
        <SettingsItem
          title="Public"
          input={<Switch className="pt-large" style={{ margin: 0 }} />}
        />
      </Wrapper>
    )
  }
}
