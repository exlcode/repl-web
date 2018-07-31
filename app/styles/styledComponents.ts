import styled from 'styled-components'
import fadeIn from 'styles/animations/fadeIn'

interface FullSizeProps {
  fadeIn?: boolean
}

export const FullSize = styled.div`
  height: 100%;
  width: 100%;
  ${(props: FullSizeProps) => props.fadeIn && fadeIn(0)};
`
