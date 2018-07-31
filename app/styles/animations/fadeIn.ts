import { keyframes } from 'styled-components'

const animation = keyframes`
  0%   { opacity: 0; }
  100% { opacity: 1; }
`

// Interpolate this function into your styled-components string literals
export default (delay: number) =>
  `
    animation: ${animation} 0.3s;
    animation-delay: ${delay}s;
    animation-fill-mode: forwards;
    opacity: 0
  `
