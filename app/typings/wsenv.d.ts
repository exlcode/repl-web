import {
  TextDocumentIdentifier,
  CompletionItem,
  FormattingOptions,
  TextDocumentItem,
  CodeActionContext,
  ReferenceContext,
  Position,
  Location,
  TextEdit,
  DocumentHighlight,
  Hover,
  SignatureHelp,
  SymbolInformation,
  Range,
  Command
} from 'wsenv/converter/types'
import { Diagnostic } from 'wsenv/converter/types/vscode-languageserver-types'

export = wsenv
export as namespace wsenv

declare namespace wsenv {
  // File Requests
  interface IGenericFileReq {
    workspaceId: string
    filePath: string
    isDir: boolean
    environmentKey: string
    contents: string
  }

  interface IDefinitionResp {
    locations: Location[]
  }

  interface IHighlightResp {
    highlights: DocumentHighlight[]
  }

  interface IHoverResp extends Hover {}

  interface ISignatureResp extends SignatureHelp {}

  interface ISymbolResp {
    symbols: SymbolInformation[]
  }

  interface IClassContentsReq {
    workspaceId: string
    providerId: string
    document: TextDocumentIdentifier
  }

  interface IClassContentsResp {
    contents: string
  }

  interface IMoveFileReq {
    workspaceId: string
    oldFilePath: string
    newFilePath: string
    environmentKey: string
  }

  interface IPatchFileReq {
    workspaceId: string
    environmentKey: string
    filePath: string
    isDir: boolean
    patch: string
  }

  // LSP Requests
  interface IGenericLSPReq {
    workspaceId: string
    providerId: string
    document: TextDocumentIdentifier
    position?: Position
  }

  interface ICompleteResp {
    isIncomplete: boolean
    items: CompletionItem[]
  }

  interface ICompleteResolveReq {
    workspaceId: string
    providerId: string
    completionItem: CompletionItem
  }

  interface ICompleteResolveResp extends CompletionItem {}

  interface IFileLSPCloseReq {
    workspaceId: string
    providerId: string
    document: TextDocumentIdentifier
  }

  interface IFileLSPOpenReq {
    workspaceId: string
    providerId: string
    document: TextDocumentItem
  }

  interface IFormattingReq {
    workspaceId: string
    providerId: string
    document: TextDocumentIdentifier
    options: FormattingOptions
  }

  interface IFormattingResp {
    edits: TextEdit[]
  }

  interface ICodeActionReq {
    workspaceId: string
    providerId: string
    document: TextDocumentIdentifier
    range: Range
    context: CodeActionContext
  }

  interface ICodeActionResp {
    commands: Command[]
  }

  interface IReferencesReq {
    workspaceId: string
    providerId: string
    document: TextDocumentIdentifier
    position: Position
    context: ReferenceContext
  }

  interface IReferencesResp {
    locations: Location[]
  }

  // Workspaces
  interface ICreateWorkspaceResp {
    id: string
    environmentKey: string
    versionId: string
  }

  // Events
  interface ITTYEventResp {
    instanceId: string
    body: string
  }

  interface ELSPDiagnosticsNotification {
    workspaceId: string
    providerId: string
    uri: string
    diagnostics: Diagnostic[]
  }

  // Terminal
  interface IInstanceCreateResp {
    instanceId: string
    workspacePaths: { [key: string]: string }
    workspacesRootPath: string // deprecated
  }

  // Other
  interface IWorkspace {
    id?: string
    configExtras?: { [key: string]: string }
    name: string
    environmentKey: string
    files: WorkspaceFileRoot
  }
  interface WorkspaceFileRoot {
    [key: string]: IWorkspaceFile
  }
  type WorkspaceFile = IWorkspaceFile
  interface IWorkspaceFile {
    name: string
    isDir?: boolean
    isTmplFile?: boolean
    isImmutable?: boolean
    isHidden?: false
    contents?: string
    children?: WorkspaceFileRoot
  }
}
