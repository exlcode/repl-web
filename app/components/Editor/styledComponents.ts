import { Dialog, CollapseFrom, CollapsibleList } from '@blueprintjs/core'
import styled from 'styled-components'
import fadeIn from 'styles/animations/fadeIn'

export const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  background-color: #1e1e1e;
  ${fadeIn(0)};
`

export const HeaderWrapper = styled.div`
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  box-sizing: border-box;
  padding-right: 1rem;
`

export const FilesWrapper = styled.div`display: flex;`

// export const FileTabs = styled(CollapsibleList).attrs({
//   collapseFrom: CollapseFrom.END
// })`
export const FileTabs = styled.ul`
  display: inline-block;
  margin: 0;
  cursor: default;
  padding: 0;
  list-style: none;
  vertical-align: top;
  line-height: 30px;
  & > li {
    float: left;
    a,
    a:hover,
    a:focus,
    a:active {
      text-decoration: none;
      color: inherit;
    }

    & > span {
      display: block;
      padding: 0 5px;
      line-height: 3rem;
      cursor: pointer;
      &:hover {
        background-color: rgba(150, 150, 150, 0.2);
      }
      &.active {
        background-color: rgba(150, 150, 150, 0.5);
      }
    }
  }
`

export const FileTabItem = styled.li``

export const ActionWrapper = styled.div``
export const SubActionWrapper = styled.div`
  display: inline-block;
  .pt-button {
    margin-right: 5px;
  }
`

export const DialogWrapper = styled(Dialog)`
  width: 300px;
`
export const DialogBody = styled.div.attrs({
  className: 'pt-dialog-body'
})``
export const DialogFooter = styled.div.attrs({
  className: 'pt-dialog-footer'
})``
export const DialogFooterActions = styled.div.attrs({
  className: 'pt-dialog-footer-actions'
})``

export const PathList = styled.ul`margin-left: 1rem;`
