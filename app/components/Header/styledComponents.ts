import styled from 'styled-components'

export const Section = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`

export const Wrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  background-color: grey;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  height: 3rem;
  font-weight: 400;
  flex: 0 0 3rem;
  box-sizing: border-box;
  border-bottom: 1px solid black;
`

interface ChevronIconProps {
  sidebarOpen: boolean
}

export const ChevronIcon = styled.div`
  transition: 0.3s ease all;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  z-index: 20;

  cursor: pointer;
  &:hover {
    transform: rotateZ(
      ${(props: ChevronIconProps) => (!props.sidebarOpen ? '135deg' : '45deg')}
    );
    color: white;
  }

  transform: rotateZ(
    ${(props: ChevronIconProps) => (props.sidebarOpen ? '0deg' : '180deg')}
  );
`

export const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  cursor: pointer;
`

export const ViewModeButtons = styled.div`margin-right: 1rem;`
export const ModeButton = styled.div``
