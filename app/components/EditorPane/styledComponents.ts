import styled from 'styled-components'
import fadeIn from 'styles/animations/fadeIn'
import * as UnstyledSplitPane from 'react-split-pane'

interface SplitPaneProps {
  hasHeader?: boolean
}
export const SplitPane = styled(UnstyledSplitPane)`
  top: ${(props: SplitPaneProps) =>
    props.hasHeader ? '3rem !important' : '0'};
  ${fadeIn(0)};
`
