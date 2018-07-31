export = client
export as namespace client

declare namespace client {
  // TODO: Deprecated
  interface IEditorNode {
    id: string
    name: string
    contents: string
    isClassFile?: boolean
    isDir?: boolean
    children?: IEditorNodeRoot
    uri?: string
    nameEditable?: boolean
    open?: boolean
  }

  interface IEditorNodeRoot {
    [index: string]: IEditorNode
  }
  interface IFileNode {
    isDir: boolean
    filePath: string
  }

  interface IFileTreeData {
    id: string
    environmentKey: string
    name: string
    isDir: boolean
    children?: IFileTreeData[]
    active?: boolean
    toggled?: boolean
    loading?: boolean
    decorators?: any
    animations?: any
    nameEditable?: boolean
  }

  interface IFileTreeNode {
    id: string
    filePath: string
    contents: string
    isDir?: boolean
    childNodes?: IFileTreeNode[]
    open?: boolean
  }

  interface IWorkspace {
    id: string
    name: string
    environmentKey: string
    canEdit: boolean
    isAdmin: boolean
    isOwner: boolean
    isPublic: boolean
    isStarred: boolean
    starCount: number
    forkCount: number
    forkParent: IForkParent
    useAdvanced?: boolean
    nameEditable?: boolean
  }

  interface IWorkspaceRoot {
    [id: string]: IWorkspace
  }

  interface IForkParent {
    id: string
    name: string
  }

  interface ISettings {
    fontSize?: number
  }
}
