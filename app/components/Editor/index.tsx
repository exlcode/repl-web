import * as React from 'react'
import MonacoEditor from 'react-monaco-editor'
import { Wrapper } from './styledComponents'
import Header from './Header'
// import connection from 'sharedb'
// import { attachToMonaco, default as ShareDBMonaco } from 'sharedb/shareMonaco'
import MonacoProvider from 'wsenv/monaco'
import { debounce } from 'lodash'
import * as DiffMatchPatch from 'diff-match-patch'
import * as methods from 'wsenv/methods'

import {
  addPathPrefix,
  getFirstFileNode,
  getNodeFilePath,
  toFileTreeNodes,
  getNodeWithFileId,
  getNodeWithFilePath,
  stripUriPrefix,
  toWorkspaceFileRoot
} from 'utils/files'
import { injectState } from 'freactal'
import {
  extractWSENVFiles,
  generateDefaultLSWorkspace,
  insertJavaObjectPath
} from 'utils/workspaces'
import { IFileTreeNode } from 'typings/client'
import IDisposable = monaco.IDisposable

const dmp = new DiffMatchPatch()

interface FreactalProps {
  effects: {
    setWorkspace: (args: { id: string; environmentKey: string }) => void
    clearWorkspace: () => void
    setFileTree: (fileTree: IFileTreeNode[]) => void
    setCurrFileId: (fileId: string) => void
    setFileNodeOpen: (fileId: string, open: boolean) => void
    setMonacoProvider: (provider: MonacoProvider) => void
    setCurrFileContents: (contents: string) => void
  }
  workspace: {
    id: string
    documentId: string // TODO: workaround to create new sharedb document for difference code block
    environmentKey: string
    name: string
    files: any
  }
  currFileId: string
  fileTree: IFileTreeNode[]
}

interface IProps {
  isNewWorkspace?: boolean
}

interface IState {}

const editorOptions: monaco.editor.IEditorOptions = {
  automaticLayout: true,
  autoClosingBrackets: false,
  readOnly: false,
  glyphMargin: true
}

const requireConfig = {
  url: '/repl/require.js',
  paths: {
    vs: '/repl/vs'
  }
}

class Editor extends React.Component<IProps & FreactalProps, IState> {
  static defaultProps = {
    isNewWorkspace: true // TODO: Remove when GraphQL API is hooked up
  }

  editor: monaco.editor.ICodeEditor
  provider: MonacoProvider
  // sharedbMonaco: ShareDBMonaco
  listeners: IDisposable[]

  handleMount = async (editor: monaco.editor.ICodeEditor, monaco: any) => {
    this.editor = editor
    this.provider = new MonacoProvider(
      editor,
      monaco,
      this.props.workspace.environmentKey
    )
    this.provider.onModelChange = (newFilePath: string) => {
      const node = getNodeWithFilePath(newFilePath, this.props.fileTree)
      if (node) {
        this.props.effects.setCurrFileId(node.id)
      } else {
        // console.log(`Node with filePath ${newFilePath} not found`)
      }
    }
    this.props.effects.setMonacoProvider(this.provider)
    try {
      let workspace = null
      // INSERT GRAPHQL PULLED WSPC HERE
      if (this.props.isNewWorkspace && !this.props.workspace.files) {
        workspace = generateDefaultLSWorkspace(
          this.props.workspace.environmentKey
        )
      } else {
        workspace = this.props.workspace
      }
      await this.provider.start(workspace)

      // enable editor after workspace has been created
      this.editor.updateOptions(editorOptions)

      // Freactal effects
      this.props.effects.setWorkspace({
        id: this.provider.workspaceId,
        environmentKey: this.props.workspace.environmentKey
      })

      // convert to @blueprintjs/core treeNodes
      const fileTreeNodes = toFileTreeNodes(
        extractWSENVFiles(workspace.files, this.props.workspace.environmentKey)
      )
      const fileNode = getFirstFileNode(fileTreeNodes)
      this.props.effects.setCurrFileId(fileNode.id)
      await this.provider.openFile(
        getNodeFilePath(fileNode.id, fileTreeNodes),
        fileNode.contents
      )
      this.props.effects.setFileTree(fileTreeNodes)
      // console.log(`Workspace created: ${this.provider.workspaceId}`)
    } catch (err) {
      // console.error(`Error creating workspace: ${err.message}`)
    }

    // ShareDB
    // const editorDoc = connection.get(
    //   'editor',
    //   this.props.workspace.documentId || this.editor.getModel().uri.toString()
    // )
    // this.sharedbMonaco = attachToMonaco(editorDoc, editor, {
    //   value: this.editor.getValue()
    // })
  }

  componentWillReceiveProps(nextProps: IProps & FreactalProps) {
    if (
      this.props.currFileId &&
      nextProps.currFileId &&
      this.props.currFileId !== nextProps.currFileId
    ) {
      const fileNode = getNodeWithFileId(
        nextProps.currFileId,
        nextProps.fileTree
      )
      if (fileNode) {
        this.handleChange.flush()
        this.provider.openFile(
          getNodeFilePath(nextProps.currFileId, nextProps.fileTree)
        )
      } else {
        // console.log(`File with id ${nextProps.currFileId} not found`)
      }
    }
  }

  handleFileChange = async (file: IFileTreeNode) => {
    // replace the below line with getNodeWithFileId, only considers the root level of the list
    this.handleChange.flush()
    await this.provider.openFile(
      getNodeFilePath(file.id, this.props.fileTree),
      file.contents
    )
    this.props.effects.setCurrFileId(file.id)
    this.props.effects.setFileNodeOpen(file.id, true)
  }

  componentWillUnmount() {
    // this.sharedbMonaco.stop()
    this.provider.stop()
    this.props.effects.clearWorkspace()
  }

  handleChange = debounce((value: string = '') => {
    if (this.provider.lastValue !== value) {
      const workspaceId = this.provider.workspaceId
      const patches = dmp.patch_make(this.provider.lastValue, value)
      const patchString = dmp.patch_toText(patches)
      this.provider.lastValue = value
      methods.patchFile({
        workspaceId,
        isDir: false,
        patch: patchString,
        environmentKey: this.provider.envKey,
        filePath: addPathPrefix(this.provider.filePath, this.provider.envKey)
      })
      if (window.parent) {
        // TODO support more than just the Java workspace path wrapper
        window.parent.postMessage(
          JSON.stringify({
            event: 'workspace.changed',
            workspaceId: workspaceId,
            payload: insertJavaObjectPath(
              toWorkspaceFileRoot(this.props.fileTree)
            )
          }),
          '*'
        )
      }
    }
  }, 100)

  render() {
    return (
      <Wrapper>
        <Header onFileChange={this.handleFileChange} />
        <MonacoEditor
          height="calc(100% - 3rem)"
          language="javascript"
          requireConfig={requireConfig}
          options={{ ...editorOptions, readOnly: true }}
          onChange={this.handleChange}
          editorDidMount={this.handleMount}
          theme="vs-dark"
        />
      </Wrapper>
    )
  }
}

export default injectState<IProps>(Editor, [
  'workspace',
  'currFileId',
  'fileTree'
])
