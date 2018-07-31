import styled from 'styled-components'

const HeaderSize = '1.7rem'

export const TabHeader = styled.div`
  font-size: 13px;
  height: ${HeaderSize};
  display: flex;
  justify-content: flex-start;
  background-color: black;
`
interface TabProps {
  active?: boolean
}

export const TabText = styled.a`
  margin-right: 16px;
  margin-left: 16px;
  line-height: ${HeaderSize};
  text-decoration: none !important;
  padding-bottom: 3px;
  color: grey;
  ${(props: TabProps) =>
    props.active &&
    `
    border-bottom: 1px solid grey;
    color: white;

  `};
  &:hover {
    color: white;
  }
`

export const Tab = styled.div`
  cursor: pointer;
  position: relative;
`

export const Content = styled.div`height: calc(100% - ${HeaderSize});`
