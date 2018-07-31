import styled from 'styled-components'

interface IconProps {
  iconName: string
  large?: boolean
  link?: boolean
}
export const Icon = styled.span.attrs<IconProps>({
  className: (props: IconProps) =>
    `pt-icon${props.large ? '-large' : ''} pt-icon-${props.iconName
      ? props.iconName
      : 'asterisk'}`
})`
  ${props => props.link && 'cursor: pointer;'}
`
