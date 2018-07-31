import * as React from 'react'
import '@blueprintjs/core/dist/blueprint.css'
import './styles/globalStyles'
import { getQueryParam, getJsonParam } from 'utils/queryString'

import { FocusStyleManager } from '@blueprintjs/core'
FocusStyleManager.onlyShowFocusOnTabs()

import * as SplitPane from 'react-split-pane'
import Sidebar from 'components/Sidebar'
import EditorPane from 'components/EditorPane'

import { ThemeProvider } from 'styled-components'
import theme from 'styles/theme'
import { provideState, injectState, softUpdate, hardUpdate } from 'freactal'
import { environmentKeyConfig } from 'utils/constants'
import { IFileTreeNode } from 'typings/client'
import {
  getNodeFilePath,
  updateNodeTree,
  removeNode,
  insertNodeInPath
} from 'utils/files'
import MonacoProvider from 'wsenv/monaco'

export interface FreactalEffects {
  setSidebarOpen: (open: boolean) => Promise<any>
}
export interface FreactalState {
  fullView: boolean
  sidebarOpen: boolean
  workspace: {
    // current wsenv workspace
    id: string
    environmentKey: string
  }
  instanceId: string // terminal instanceId
  fileTree: IFileTreeNode[] // internal representation of file tree
  currFileId: string
  provider: MonacoProvider
}
export interface FreactalEffectsProps {
  effects: FreactalEffects
}

class App extends React.Component<FreactalState & FreactalEffectsProps, {}> {
  componentDidMount() {
    if (this.props.sidebarOpen != this.props.fullView) {
      this.props.effects.setSidebarOpen(this.props.fullView)
    }
  }

  componentWillReceiveProps(nextProps: FreactalState) {
    if (this.props.fullView != nextProps.fullView) {
      this.props.effects.setSidebarOpen(nextProps.fullView)
    }
  }

  render() {
    const { fullView, sidebarOpen } = this.props

    return (
      <ThemeProvider theme={theme}>
        <SplitPane
          split="vertical"
          defaultSize={256}
          pane1Style={{
            visibility: sidebarOpen ? 'visible' : 'hidden',
            maxWidth: sidebarOpen ? 'inherit' : 0
          }}
          minSize={160}
          maxSize={700}
        >
          {fullView && <Sidebar />}
          <EditorPane />
        </SplitPane>
      </ThemeProvider>
    )
  }
}

export default provideState<FreactalState, {}>({
  initialState: () => ({
    fullView: !getQueryParam('embedded'),
    sidebarOpen: !!getQueryParam('embedded'),
    disableAction: !!getQueryParam('disableAction'),
    workspace: getJsonParam('workspace') || {
      id: null,
      environmentKey: environmentKeyConfig.java_default_free.id
    },
    instanceId: null,
    fileTree: [],
    currFileId: null,
    provider: null
  }),
  computed: {
    pathSequence: ({ fileTree, currFileId }: FreactalState) => {
      const filePath = getNodeFilePath(currFileId, fileTree)
      return filePath ? filePath.split('/') : null
    }
  },
  effects: {
    setFullView: softUpdate((state, fullView) => ({ fullView })),
    setInstanceId: softUpdate((state, instanceId) => ({ instanceId })),
    clearWorkspace: hardUpdate({
      workspace: {},
      provider: null,
      currFileId: null
    }),
    setWorkspace: softUpdate((state, workspace) => ({
      workspace: Object.assign({}, state.workspace, workspace)
    })),
    setFilePath: softUpdate((state, filePath) => ({
      workspace: Object.assign({}, state.workspace, { filePath: filePath })
    })),
    setEnvironmentKey: softUpdate((state, environmentKey) => ({
      workspace: Object.assign({}, state.workspace, { environmentKey })
    })),
    setTerminal: softUpdate((state, terminal) => ({ terminal })),
    setWorkspaceId: softUpdate((state, workspaceId) => ({
      workspace: Object.assign({}, state.workspace, { id: workspaceId })
    })),
    setSidebarOpen: softUpdate((state, open) => ({ sidebarOpen: open })),
    setFileNodeOpen: softUpdate((state, fileId, open) => ({
      fileTree: updateNodeTree(fileId, state.fileTree, {
        open
      })
    })),
    setCurrFileId: softUpdate((state, fileId) => ({ currFileId: fileId })),
    setFileTree: softUpdate((state, fileTree) => ({ fileTree })),
    removeFileNode: softUpdate((state: FreactalState, fileId) => ({
      fileTree: removeNode(fileId, state.fileTree)
    })),
    setFileNodeName: softUpdate((state, fileId, fileName) => ({
      fileTree: updateNodeTree(fileId, state.fileTree, {
        filePath: fileName
      })
    })),
    addFileNode: softUpdate((state, path, fileNode) => {
      return {
        fileTree: insertNodeInPath(path, state.fileTree, fileNode)
      }
    }),
    setMonacoProvider: softUpdate((state, provider) => ({ provider }))
  }
})(injectState<{}>(App, ['fullView', 'sidebarOpen']))
