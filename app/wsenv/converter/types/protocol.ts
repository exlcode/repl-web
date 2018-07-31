import {
  TextDocumentContentChangeEvent,
  Position,
  Range,
  Location,
  Diagnostic,
  Command,
  TextEdit,
  WorkspaceEdit,
  WorkspaceSymbolParams,
  TextDocumentIdentifier,
  VersionedTextDocumentIdentifier,
  TextDocumentItem,
  TextDocumentSaveReason,
  CompletionItem,
  CompletionList,
  Hover,
  SignatureHelp,
  Definition,
  ReferenceContext,
  DocumentHighlight,
  DocumentSymbolParams,
  SymbolInformation,
  CodeLens,
  CodeActionContext,
  FormattingOptions,
  DocumentLink
} from './vscode-languageserver-types'
/**
 * A document filter denotes a document by different properties like
 * the [language](#TextDocument.languageId), the [scheme](#Uri.scheme) of
 * its resource, or a glob-pattern that is applied to the [path](#TextDocument.fileName).
 *
 * @sample A language filter that applies to typescript files on disk: `{ language: 'typescript', scheme: 'file' }`
 * @sample A language filter that applies to all package.json paths: `{ language: 'json', pattern: '**package.json' }`
 */
export declare type DocumentFilter =
  | {
      /** A language id, like `typescript`. */
      language: string
      /** A Uri [scheme](#Uri.scheme), like `file` or `untitled`. */
      scheme?: string
      /** A glob pattern, like `*.{ts,js}`. */
      pattern?: string
    }
  | {
      /** A language id, like `typescript`. */
      language?: string
      /** A Uri [scheme](#Uri.scheme), like `file` or `untitled`. */
      scheme: string
      /** A glob pattern, like `*.{ts,js}`. */
      pattern?: string
    }
  | {
      /** A language id, like `typescript`. */
      language?: string
      /** A Uri [scheme](#Uri.scheme), like `file` or `untitled`. */
      scheme?: string
      /** A glob pattern, like `*.{ts,js}`. */
      pattern: string
    }
export declare namespace DocumentFilter {
  function is(value: any): value is DocumentFilter
}
/**
 * A document selector is the combination of one or many document filters.
 *
 * @sample `let sel:DocumentSelector = [{ language: 'typescript' }, { language: 'json', pattern: '**∕tsconfig.json' }]`;
 */
export declare type DocumentSelector = (string | DocumentFilter)[]
/**
 * General paramters to to regsiter for an notification or to register a provider.
 */
export interface Registration {
  /**
   * The id used to register the request. The id can be used to deregister
   * the request again.
   */
  id: string
  /**
   * The method to register for.
   */
  method: string
  /**
   * Options necessary for the registration.
   */
  registerOptions?: any
}
/**
 * A parameter literal used in requests to pass a text document and a position inside that
 * document.
 */
export interface TextDocumentPositionParams {
  /**
   * The text document.
   */
  textDocument: TextDocumentIdentifier
  /**
   * The position inside the text document.
   */
  position: Position
}
/**
 * Workspace specific client capabilities.
 */
export interface WorkspaceClientCapabilites {
  /**
   * The client supports applying batch edits
   * to the workspace by supporting the request
   * 'workspace/applyEdit'
   */
  applyEdit?: boolean
  /**
   * Capabilities specific to `WorkspaceEdit`s
   */
  workspaceEdit?: {
    /**
     * The client supports versioned document changes in `WorkspaceEdit`s
     */
    documentChanges?: boolean
  }
  /**
   * Capabilities specific to the `workspace/didChangeConfiguration` notification.
   */
  didChangeConfiguration?: {
    /**
     * Did change configuration notification supports dynamic registration.
     */
    dynamicRegistration?: boolean
  }
  /**
   * Capabilities specific to the `workspace/didChangeWatchedFiles` notification.
   */
  didChangeWatchedFiles?: {
    /**
     * Did change watched files notification supports dynamic registration.
     */
    dynamicRegistration?: boolean
  }
  /**
   * Capabilities specific to the `workspace/symbol` request.
   */
  symbol?: {
    /**
     * Symbol request supports dynamic registration.
     */
    dynamicRegistration?: boolean
  }
  /**
   * Capabilities specific to the `workspace/executeCommand` request.
   */
  executeCommand?: {
    /**
     * Execute command supports dynamic registration.
     */
    dynamicRegistration?: boolean
  }
}
export interface SynchronizationClientCapabilities {
  /**
   * Whether text document synchronization supports dynamic registration.
   */
  dynamicRegistration?: boolean
  /**
   * The client supports sending will save notifications.
   */
  willSave?: boolean
  /**
   * The client supports sending a will save request and
   * waits for a response providing text edits which will
   * be applied to the document before it is saved.
   */
  willSaveWaitUntil?: boolean
  /**
   * The client supports did save notifications.
   */
  didSave?: boolean
}
export interface CompletionClientCapabilities {
  /**
   * Whether completion supports dynamic registration.
   */
  dynamicRegistration?: boolean
  /**
   * The client supports the following `CompletionItem` specific
   * capabilities.
   */
  completionItem?: {
    /**
     * Client supports snippets as insert text.
     *
     * A snippet can define tab stops and placeholders with `$1`, `$2`
     * and `${3:foo}`. `$0` defines the final tab stop, it defaults to
     * the end of the snippet. Placeholders with equal identifiers are linked,
     * that is typing in one will update others too.
     */
    snippetSupport?: boolean
  }
}
/**
 * Text document specific client capabilities.
 */
export interface TextDocumentClientCapabilities {
  /**
   * Defines which synchronization capabilities the client supports.
   */
  synchronization?: SynchronizationClientCapabilities
  /**
   * Capabilities specific to the `textDocument/completion`
   */
  completion?: CompletionClientCapabilities
  /**
   * Capabilities specific to the `textDocument/hover`
   */
  hover?: {
    /**
     * Whether hover supports dynamic registration.
     */
    dynamicRegistration?: boolean
  }
  /**
   * Capabilities specific to the `textDocument/signatureHelp`
   */
  signatureHelp?: {
    /**
     * Whether signature help supports dynamic registration.
     */
    dynamicRegistration?: boolean
  }
  /**
   * Capabilities specific to the `textDocument/references`
   */
  references?: {
    /**
     * Whether references supports dynamic registration.
     */
    dynamicRegistration?: boolean
  }
  /**
   * Capabilities specific to the `textDocument/documentHighlight`
   */
  documentHighlight?: {
    /**
     * Whether document highlight supports dynamic registration.
     */
    dynamicRegistration?: boolean
  }
  /**
   * Capabilities specific to the `textDocument/documentSymbol`
   */
  documentSymbol?: {
    /**
     * Whether document symbol supports dynamic registration.
     */
    dynamicRegistration?: boolean
  }
  /**
   * Capabilities specific to the `textDocument/formatting`
   */
  formatting?: {
    /**
     * Whether formatting supports dynamic registration.
     */
    dynamicRegistration?: boolean
  }
  /**
   * Capabilities specific to the `textDocument/rangeFormatting`
   */
  rangeFormatting?: {
    /**
     * Whether range formatting supports dynamic registration.
     */
    dynamicRegistration?: boolean
  }
  /**
   * Capabilities specific to the `textDocument/onTypeFormatting`
   */
  onTypeFormatting?: {
    /**
     * Whether on type formatting supports dynamic registration.
     */
    dynamicRegistration?: boolean
  }
  /**
   * Capabilities specific to the `textDocument/definition`
   */
  definition?: {
    /**
     * Whether definition supports dynamic registration.
     */
    dynamicRegistration?: boolean
  }
  /**
   * Capabilities specific to the `textDocument/codeAction`
   */
  codeAction?: {
    /**
     * Whether code action supports dynamic registration.
     */
    dynamicRegistration?: boolean
  }
  /**
   * Capabilities specific to the `textDocument/codeLens`
   */
  codeLens?: {
    /**
     * Whether code lens supports dynamic registration.
     */
    dynamicRegistration?: boolean
  }
  /**
   * Capabilities specific to the `textDocument/documentLink`
   */
  documentLink?: {
    /**
     * Whether document link supports dynamic registration.
     */
    dynamicRegistration?: boolean
  }
  /**
   * Capabilities specific to the `textDocument/rename`
   */
  rename?: {
    /**
     * Whether rename supports dynamic registration.
     */
    dynamicRegistration?: boolean
  }
}
/**
 * Defines the capabilities provided by the client.
 */
export interface ClientCapabilities {
  /**
   * Workspace specific client capabilities.
   */
  workspace?: WorkspaceClientCapabilites
  /**
   * Text document specific client capabilities.
   */
  textDocument?: TextDocumentClientCapabilities
  /**
   * Experimental client capabilities.
   */
  experimental?: any
}
/**
 * Defines how the host (editor) should sync
 * document changes to the language server.
 */
export declare namespace TextDocumentSyncKind {
  /**
   * Documents should not be synced at all.
   */
  const None = 0
  /**
   * Documents are synced by always sending the full content
   * of the document.
   */
  const Full = 1
  /**
   * Documents are synced by sending the full content on open.
   * After that only incremental updates to the document are
   * send.
   */
  const Incremental = 2
}
export declare type TextDocumentSyncKind = 0 | 1 | 2
/**
 * General text document registration options.
 */
export interface TextDocumentRegistrationOptions {
  /**
   * A document selector to identify the scope of the registration. If set to null
   * the document selector provided on the client side will be used.
   */
  documentSelector: DocumentSelector | null
}
/**
 * Completion options.
 */
export interface CompletionOptions {
  /**
   * The server provides support to resolve additional
   * information for a completion item.
   */
  resolveProvider?: boolean
  /**
   * The characters that trigger completion automatically.
   */
  triggerCharacters?: string[]
}
/**
 * Signature help options.
 */
export interface SignatureHelpOptions {
  /**
   * The characters that trigger signature help
   * automatically.
   */
  triggerCharacters?: string[]
}
/**
 * Code Lens options.
 */
export interface CodeLensOptions {
  /**
   * Code lens has a resolve provider as well.
   */
  resolveProvider?: boolean
}
/**
 * Format document on type options
 */
export interface DocumentOnTypeFormattingOptions {
  /**
   * A character on which formatting should be triggered, like `}`.
   */
  firstTriggerCharacter: string
  /**
   * More trigger characters.
   */
  moreTriggerCharacter?: string[]
}
/**
 * Document link options
 */
export interface DocumentLinkOptions {
  /**
   * Document links have a resolve provider as well.
   */
  resolveProvider?: boolean
}
/**
 * Execute command options.
 */
export interface ExecuteCommandOptions {
  /**
   * The commands to be executed on the server
   */
  commands: string[]
}
/**
 * Save options.
 */
export interface SaveOptions {
  /**
   * The client is supposed to include the content on save.
   */
  includeText?: boolean
}
export interface TextDocumentSyncOptions {
  /**
   * Open and close notifications are sent to the server.
   */
  openClose?: boolean
  /**
   * Change notificatins are sent to the server. See TextDocumentSyncKind.None, TextDocumentSyncKind.Full
   * and TextDocumentSyncKindIncremental.
   */
  change?: TextDocumentSyncKind
  /**
   * Will save notifications are sent to the server.
   */
  willSave?: boolean
  /**
   * Will save wait until requests are sent to the server.
   */
  willSaveWaitUntil?: boolean
  /**
   * Save notifications are sent to the server.
   */
  save?: SaveOptions
}
/**
 * Defines the capabilities provided by a language
 * server.
 */
export interface ServerCapabilities {
  /**
   * Defines how text documents are synced. Is either a detailed structure defining each notification or
   * for backwards compatibility the TextDocumentSyncKind number.
   */
  textDocumentSync?: TextDocumentSyncOptions | TextDocumentSyncKind
  /**
   * The server provides hover support.
   */
  hoverProvider?: boolean
  /**
   * The server provides completion support.
   */
  completionProvider?: CompletionOptions
  /**
   * The server provides signature help support.
   */
  signatureHelpProvider?: SignatureHelpOptions
  /**
   * The server provides goto definition support.
   */
  definitionProvider?: boolean
  /**
   * The server provides find references support.
   */
  referencesProvider?: boolean
  /**
   * The server provides document highlight support.
   */
  documentHighlightProvider?: boolean
  /**
   * The server provides document symbol support.
   */
  documentSymbolProvider?: boolean
  /**
   * The server provides workspace symbol support.
   */
  workspaceSymbolProvider?: boolean
  /**
   * The server provides code actions.
   */
  codeActionProvider?: boolean
  /**
   * The server provides code lens.
   */
  codeLensProvider?: CodeLensOptions
  /**
   * The server provides document formatting.
   */
  documentFormattingProvider?: boolean
  /**
   * The server provides document range formatting.
   */
  documentRangeFormattingProvider?: boolean
  /**
   * The server provides document formatting on typing.
   */
  documentOnTypeFormattingProvider?: {
    /**
     * A character on which formatting should be triggered, like `}`.
     */
    firstTriggerCharacter: string
    /**
     * More trigger characters.
     */
    moreTriggerCharacter?: string[]
  }
  /**
   * The server provides rename support.
   */
  renameProvider?: boolean
  /**
   * The server provides document link support.
   */
  documentLinkProvider?: DocumentLinkOptions
  /**
   * The server provides execute command support.
   */
  executeCommandProvider?: ExecuteCommandOptions
  /**
   * Experimental server capabilities.
   */
  experimental?: any
}
/**
 * The initialize parameters
 */
export interface InitializeParams {
  /**
   * The process Id of the parent process that started
   * the server.
   */
  processId: number
  /**
   * The rootPath of the workspace. Is null
   * if no folder is open.
   *
   * @deprecated in favour of rootUri.
   */
  rootPath?: string | null
  /**
   * The rootUri of the workspace. Is null if no
   * folder is open. If both `rootPath` and `rootUri` are set
   * `rootUri` wins.
   */
  rootUri: string | null
  /**
   * The capabilities provided by the client (editor or tool)
   */
  capabilities: ClientCapabilities
  /**
   * User provided initialization options.
   */
  initializationOptions?: any
  /**
   * The initial trace setting. If omitted trace is disabled ('off').
   */
  trace?: 'off' | 'messages' | 'verbose'
}
/**
 * The result returned from an initilize request.
 */
export interface InitializeResult {
  /**
   * The capabilities the language server provides.
   */
  capabilities: ServerCapabilities
}
/**
 * Known error codes for an `InitializeError`;
 */
export declare namespace InitializeError {
  /**
   * If the protocol version provided by the client can't be handled by the server.
   * @deprecated This initialize error got replaced by client capabilities. There is
   * no version handshake in version 3.0x
   */
  const unknownProtocolVersion: number
}
/**
 * The data type of the ResponseError if the
 * initialize request fails.
 */
export interface InitializeError {
  /**
   * Indicates whether the client should retry to send the
   * initialize request after showing the message provided
   * in the {@link ResponseError}
   */
  retry: boolean
}
/**
 * The message type
 */
export declare namespace MessageType {
  /**
   * An error message.
   */
  const Error = 1
  /**
   * A warning message.
   */
  const Warning = 2
  /**
   * An information message.
   */
  const Info = 3
  /**
   * A log message.
   */
  const Log = 4
}
export declare type MessageType = 1 | 2 | 3 | 4
/**
 * The parameters of a notification message.
 */
export interface ShowMessageParams {
  /**
   * The message type. See {@link MessageType}
   */
  type: MessageType
  /**
   * The actual message
   */
  message: string
}
/**
 * The parameters send in a open text document notification
 */
export interface DidOpenTextDocumentParams {
  /**
   * The document that was opened.
   */
  textDocument: TextDocumentItem
}
/**
 * The change text document notification's parameters.
 */
export interface DidChangeTextDocumentParams {
  /**
   * The document that did change. The version number points
   * to the version after all provided content changes have
   * been applied.
   */
  textDocument: VersionedTextDocumentIdentifier
  /**
   * The actual content changes.
   */
  contentChanges: TextDocumentContentChangeEvent[]
}
/**
 * Descibe options to be used when registered for text document change events.
 */
export interface TextDocumentChangeRegistrationOptions
  extends TextDocumentRegistrationOptions {
  /**
   * How documents are synced to the server.
   */
  syncKind: TextDocumentSyncKind
}
/**
 * The document change notification is sent from the client to the server to signal
 * changes to a text document.
 */
export interface DidCloseTextDocumentParams {
  /**
   * The document that was closed.
   */
  textDocument: TextDocumentIdentifier
}
export interface DidSaveTextDocumentParams {
  /**
   * The document that was closed.
   */
  textDocument: VersionedTextDocumentIdentifier
  /**
   * Optional the content when saved. Depends on the includeText value
   * when the save notifcation was requested.
   */
  text?: string
}
/**
 * Save registration options.
 */
export interface TextDocumentSaveRegistrationOptions
  extends TextDocumentRegistrationOptions,
    SaveOptions {}
/**
 * The parameters send in a will save text document notification.
 */
export interface WillSaveTextDocumentParams {
  /**
   * The document that will be saved.
   */
  textDocument: TextDocumentIdentifier
  /**
   * The 'TextDocumentSaveReason'.
   */
  reason: TextDocumentSaveReason
}
/**
 * The watched files change notification's parameters.
 */
export interface DidChangeWatchedFilesParams {
  /**
   * The actual file events.
   */
  changes: FileEvent[]
}
/**
 * The file event type
 */
export declare namespace FileChangeType {
  /**
   * The file got created.
   */
  const Created = 1
  /**
   * The file got changed.
   */
  const Changed = 2
  /**
   * The file got deleted.
   */
  const Deleted = 3
}
export declare type FileChangeType = 1 | 2 | 3
/**
 * An event describing a file change.
 */
export interface FileEvent {
  /**
   * The file's uri.
   */
  uri: string
  /**
   * The change type.
   */
  type: FileChangeType
}
/**
 * The publish diagnostic notification's parameters.
 */
export interface PublishDiagnosticsParams {
  /**
   * The URI for which diagnostic information is reported.
   */
  uri: string
  /**
   * An array of diagnostic information items.
   */
  diagnostics: Diagnostic[]
}
/**
 * Completion registration options.
 */
export interface CompletionRegistrationOptions
  extends TextDocumentRegistrationOptions,
    CompletionOptions {}
/**
 * Parameters for a [ReferencesRequest](#ReferencesRequest).
 */
export interface ReferenceParams extends TextDocumentPositionParams {
  context: ReferenceContext
}
/**
 * Params for the CodeActionRequest
 */
export interface CodeActionParams {
  /**
   * The document in which the command was invoked.
   */
  textDocument: TextDocumentIdentifier
  /**
   * The range for which the command was invoked.
   */
  range: Range
  /**
   * Context carrying additional information.
   */
  context: CodeActionContext
}
/**
 * Params for the Code Lens request.
 */
export interface CodeLensParams {
  /**
   * The document to request code lens for.
   */
  textDocument: TextDocumentIdentifier
}
/**
 * Code Lens registration options.
 */
export interface CodeLensRegistrationOptions
  extends TextDocumentRegistrationOptions,
    CodeLensOptions {}

export interface DocumentFormattingParams {
  /**
   * The document to format.
   */
  textDocument: TextDocumentIdentifier
  /**
   * The format options
   */
  options: FormattingOptions
}
export interface DocumentRangeFormattingParams {
  /**
   * The document to format.
   */
  textDocument: TextDocumentIdentifier
  /**
   * The range to format
   */
  range: Range
  /**
   * The format options
   */
  options: FormattingOptions
}

export interface DocumentOnTypeFormattingParams {
  /**
   * The document to format.
   */
  textDocument: TextDocumentIdentifier
  /**
   * The position at which this request was send.
   */
  position: Position
  /**
   * The character that has been typed.
   */
  ch: string
  /**
   * The format options.
   */
  options: FormattingOptions
}
/**
 * Format document on type options
 */
export interface DocumentOnTypeFormattingRegistrationOptions
  extends TextDocumentRegistrationOptions,
    DocumentOnTypeFormattingOptions {}
export interface RenameParams {
  /**
   * The document to format.
   */
  textDocument: TextDocumentIdentifier
  /**
   * The position at which this request was send.
   */
  position: Position
  /**
   * The new name of the symbol. If the given name is not valid the
   * request must return a [ResponseError](#ResponseError) with an
   * appropriate message set.
   */
  newName: string
}
export interface DocumentLinkParams {
  /**
   * The document to provide document links for.
   */
  textDocument: TextDocumentIdentifier
}
/**
 * Document link registration options
 */
export interface DocumentLinkRegistrationOptions
  extends TextDocumentRegistrationOptions,
    DocumentLinkOptions {}
export interface ExecuteCommandParams {
  /**
   * The identifier of the actual command handler.
   */
  command: string
  /**
   * Arguments that the command should be invoked with.
   */
  arguments?: any[]
}
