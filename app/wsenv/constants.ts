export const WS_TIMEOUT = 10000 // ms to wait before cancelling WSENV request
export enum WS_EVENTS {
  fileDiagnostics = 'textDocument/publishDiagnostics' as any,
  instanceStatus = 'instance.status' as any,
  instanceTTY = 'instance.tty' as any
}
export enum WS_METHODS {
  newWorkspace = 'wspc.new' as any,
  closeWorkspace = 'wspc.close' as any,
  getWorkspace = 'wspc.get' as any,
  newFile = 'file.new' as any,
  deleteFile = 'file.delete' as any,
  moveFile = 'file.move' as any,
  patchFile = 'file.patch' as any,
  execute = 'exec.run' as any,
  // LSP
  fileLSPOpen = 'file.lsp.opened' as any,
  fileLSPClose = 'file.lsp.closed' as any,
  fileCompletion = 'file.lsp.completion' as any,
  fileCompletionResolve = 'file.lsp.completionResolve' as any,
  fileHover = 'file.lsp.hover' as any,
  fileSigHelp = 'file.lsp.sigHelp' as any,
  fileDefinition = 'file.lsp.definition' as any,
  fileFormatting = 'file.lsp.formatting' as any,
  fileDiagnostics = 'file.lsp.diagnostics' as any,
  fileHighlight = 'file.lsp.highlight' as any,
  fileReferences = 'file.lsp.references' as any,
  fileSymbols = 'file.lsp.symbols' as any,
  fileCodeAction = 'file.lsp.codeAction' as any,
  fileCodeLens = 'file.lsp.codeLens' as any,
  fileCodeLensResolve = 'file.lsp.codeLensResolve' as any,
  fileClassContents = 'file.lsp.classFileContents' as any,
  workspaceSymbols = 'wspc.lsp.symbols' as any,
  terminalCreateInstance = 'instance.create' as any,
  terminalTerminateInstance = 'instance.terminate' as any
}
export enum MESSAGE_TYPES {
  error = 'error' as any,
  request = 'req' as any,
  response = 'resp' as any,
  notif = 'notif' as any
}
export enum DIAGNOSTIC_SEVERITY {
  error = 1,
  warning,
  information,
  hint
}
