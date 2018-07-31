import { injectGlobal } from 'styled-components'

injectGlobal`

  .pt-tree-node {
    cursor: pointer;
  }

  body {
    margin: 0;
  }
  
  .terminal {
    height: 100%;
  }
  
  ::-webkit-scrollbar {
    width: 12px;
    height: 8px;
    cursor: pointer;
  }
  
  ::-webkit-scrollbar-track {
    border-left: solid rgb(120, 120, 120) 1px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0);
  }
  
  ::-webkit-scrollbar-thumb {
    background-color: rgba(120, 120, 120, 0.4);
  }
  
  .Resizer {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background: #000;
    opacity: .4;
    z-index: 30;
    -moz-background-clip: padding;
    -webkit-background-clip: padding;
    background-clip: padding-box;
  }
  
  .Resizer:hover {
      -webkit-transition: all 0.3s ease;
      transition: all 0.3s ease;
  }
  
  .Resizer.horizontal {
      height: 11px;
      margin: -5px 0;
      border-top: 5px solid rgba(0, 0, 0, 0);
      border-bottom: 5px solid rgba(0, 0, 0, 0);
      cursor: row-resize;
      width: 100%;
  }
  
  .Resizer.horizontal:hover {
      border-top: 5px solid rgba(0, 0, 0, 0.5);
      border-bottom: 5px solid rgba(0, 0, 0, 0.5);
  }
  
  .Resizer.vertical {
      width: 11px;
      margin: 0 -5px;
      border-left: 5px solid rgba(0, 0, 0, 0);
      border-right: 5px solid rgba(0, 0, 0, 0);
      cursor: col-resize;
  }
  
  .Resizer.vertical:hover {
      border-left: 5px solid rgba(0, 0, 0, 0.5);
      border-right: 5px solid rgba(0, 0, 0, 0.5);
  }

`
