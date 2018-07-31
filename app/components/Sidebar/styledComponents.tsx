import styled from 'styled-components'
import fadeIn from 'styles/animations/fadeIn'

export const Wrapper = styled.div`
  background: ${props => props.theme.primaryDark || 'white'};
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: auto;
  overflow-y: overlay;
  ${fadeIn(0)};
`

interface ChildContainerProps {
  noPadding?: boolean
  open?: boolean
  disabled: boolean
}

export const ChildContainer = styled.div`
  position: relative;
  margin: 0;
  ${(props: ChildContainerProps) =>
    !props.noPadding && 'padding: 0 1em;'} border-bottom: 1px solid ${props =>
      props.theme.primaryDark};
  overflow: ${props => (props.open ? 'inherit' : 'hidden')};
  height: ${props => (props.open ? '100%' : 0)};
  ${({ disabled }) =>
    disabled &&
    `
    pointer-events: none;
    &:after {
      content: "${disabled || ''}";
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.4);
    }
  `};
`

export const ItemHeader = styled.div`
  cursor: pointer;
  display: flex;

  align-items: center;
  position: relative;
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  vertical-align: middle;
  height: calc(3rem - 1px);
  margin: 0;
  color: ${props => props.theme.primaryText};
`

export const Title = styled.h3`
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
`

interface ExpandIconProps {
  open: boolean
}

export const ExpandIcon = styled.span`
  transition: 0.3s ease all;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  width: 3rem;
  z-index: 20;
  position: absolute;
  right: 0;
  transform: rotateZ(${(props: ExpandIconProps) => (props.open ? 0 : 90)}deg);
`
