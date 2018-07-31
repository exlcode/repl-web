import { ENVIRONMENT_KEYS, environmentKeyConfig } from '../utils/constants'
import { m2p, p2m } from 'wsenv/converter'
import * as methods from 'wsenv/methods'
import {
  ICodeActionResp,
  ICompleteResolveResp,
  ICompleteResp,
  IDefinitionResp,
  IFormattingResp,
  IHighlightResp,
  IHoverResp,
  IReferencesResp,
  ISignatureResp,
  ISymbolResp,
  IWorkspace,
  ELSPDiagnosticsNotification
} from 'typings/wsenv'
import FormattingOptions = monaco.languages.FormattingOptions
import CompletionItem = monaco.languages.CompletionItem
import { addPathPrefix, addFileProtocol, stripUriPrefix } from 'utils/files'
import { eventStore } from 'wsenv/store'
import { WS_EVENTS } from 'wsenv/constants'
import { Diagnostic } from 'wsenv/converter/types/vscode-languageserver-types'
import { moveFile } from 'wsenv/methods/files'
import * as is from 'wsenv/converter/is'

export default class MonacoProvider {
  public envKey: string
  public workspaceId: string
  public filePath: string
  public lastValue: string

  private editor: monaco.editor.ICodeEditor
  private monaco: typeof monaco
  private disposables: monaco.IDisposable[]

  constructor(editor: monaco.editor.ICodeEditor, mon: any, envKey: string) {
    this.editor = editor
    this.monaco = mon
    this.disposables = []
    this.envKey = envKey
    this.lastValue = ''
    this.filePath = ''
  }

  public async start(storedWspc: IWorkspace) {
    try {
      const workspace = await methods.createWorkspace(storedWspc)
      this.workspaceId = workspace.id
      this.envKey = workspace.environmentKey
      this.registerListeners()
      return workspace
    } catch (err) {
      return err
    }
  }

  public stop() {
    this.monaco.editor.getModels().forEach((model: monaco.editor.IModel) => {
      model.dispose()
    })
    this.clearProviders()
    this.clearListeners()
  }

  public getFileModel(filePath: string): monaco.editor.IModel {
    return this.monaco.editor.getModel(this.monaco.Uri.parse(filePath))
  }

  public moveFileModel(
    oldFilePath: string,
    newFilePath: string
  ): monaco.editor.IModel {
    const oldModel = this.getFileModel(oldFilePath)
    if (!oldModel) {
      // console.log(`Model not found for filePath: ${oldFilePath}`)
      return null
    }
    if (this.monaco.editor.getModel(this.monaco.Uri.parse(newFilePath))) {
      // console.log(`Model with filePath ${newFilePath} already exists`)
      return null
    }
    const contents = oldModel.getValue()
    oldModel.dispose()
    return this.addFileModel(newFilePath, contents)
  }

  private setFileModel = (model: monaco.editor.IModel) => {
    this.filePath = model.uri.toString()
    this.editor.setModel(model)
    this.registerProviders()
  }

  private removeFileModel = (filePath: string) => {
    const model = this.getFileModel(filePath)
    if (model) {
      model.dispose()
    }
  }

  public addFileModel = (
    filePath: string,
    contents: string
  ): monaco.editor.IModel => {
    return this.monaco.editor.createModel(
      contents,
      environmentKeyConfig[this.envKey].monacoId,
      this.monaco.Uri.parse(filePath)
    )
  }

  public async deleteFile(filePath: string, isDir?: boolean) {
    const model = this.getFileModel(filePath)
    if (model === this.editor.getModel()) {
      await this.closeFile(filePath)
    }
    await methods.deleteFile({
      workspaceId: this.workspaceId,
      environmentKey: this.envKey,
      filePath: addPathPrefix(filePath, this.envKey),
      isDir,
      contents: this.getFileModel(filePath).getValue() || ''
    })
    model && model.dispose()
  }

  public async openFile(filePath: string, contents?: string) {
    try {
      if (this.filePath) {
        await this.closeFile(this.filePath)
      }
      let fileModel = this.getFileModel(filePath)
      if (fileModel) {
        // Always get the content from the file model if exist?
        contents = fileModel.getValue()
      } else {
        // otherwise, use the provided content
        fileModel = this.addFileModel(filePath, contents)
      }

      await methods.openFile({
        ...this.idFields,
        document: {
          uri: addFileProtocol(addPathPrefix(filePath, this.envKey)),
          languageId: environmentKeyConfig.java_default_free.providerId,
          text: contents,
          version: null
        }
      })
      this.lastValue = contents

      this.setFileModel(fileModel)
    } catch (err) {
      // console.log(`Error opening file of path ${filePath}: ${err.message}`)
    }
  }

  public async moveFile(
    oldFilePath: string,
    newFilePath: string,
    active?: boolean
  ) {
    const model = this.moveFileModel(oldFilePath, newFilePath)
    if (active) {
      await this.closeFile(oldFilePath)
      this.filePath = ''
    }
    await moveFile({
      workspaceId: this.workspaceId,
      environmentKey: this.envKey,
      newFilePath: addPathPrefix(newFilePath, this.envKey),
      oldFilePath: addPathPrefix(oldFilePath, this.envKey)
    })
    if (active) {
      await methods.openFile({
        ...this.idFields,
        document: {
          uri: addFileProtocol(addPathPrefix(newFilePath, this.envKey)),
          languageId: environmentKeyConfig.java_default_free.providerId,
          text: model.getValue(),
          version: null
        }
      })
      this.setFileModel(model)
    }
  }

  public async closeFile(filePath: string) {
    try {
      await methods.closeFile({
        ...this.idFields,
        document: {
          uri: addFileProtocol(addPathPrefix(filePath, this.envKey))
        }
      })
    } catch (err) {
      // console.log(`Error closing file path of ${filePath}: ${err.message}`)
    }
  }

  public setEnvironmentKey(envKey: ENVIRONMENT_KEYS) {
    this.envKey = envKey
    this.registerProviders()
  }

  // Overriden in Editor/index.tsx
  public onModelChange(newFilePath: string) {}

  private get idFields() {
    return {
      workspaceId: this.workspaceId,
      providerId: environmentKeyConfig[this.envKey].providerId
    }
  }

  public clearListeners() {
    eventStore.remove(WS_EVENTS.fileDiagnostics, this.diagnosticsListener)
  }

  public clearProviders() {
    this.disposables.forEach(disposable => disposable.dispose())
    this.disposables = []
  }

  registerListeners() {
    eventStore.add(WS_EVENTS.fileDiagnostics, this.diagnosticsListener)
  }

  registerProviders() {
    this.clearProviders()
    this.disposables.push(
      this.registerCompletionProvider(),
      this.registerDefinitionProvider(),
      this.registerFormattingProvider(),
      this.registerHighlightProvider(),
      this.registerHoverProvider(),
      this.registerSignatureProvider(),
      this.registerSymbolProvider(),
      this.registerReferenceProvider(),
      this.registerCodeActionProvider()
    )
  }

  // Listeners
  diagnosticsListener = (err: Error, data: ELSPDiagnosticsNotification) => {
    if (data.workspaceId === this.workspaceId) {
      // diagnostics belong to editor instance
      monaco.editor.setModelMarkers(
        this.editor.getModel(),
        '',
        data.diagnostics.map((diagnostic: Diagnostic) => ({
          code: diagnostic.code as any,
          message: diagnostic.message,
          severity: p2m.asSeverity(diagnostic.severity),
          source: diagnostic.source,
          ...p2m.asRange(diagnostic.range)
        }))
      )
    }
  }

  // Register providers
  registerCompletionProvider() {
    return monaco.languages.registerCompletionItemProvider(
      environmentKeyConfig[this.envKey].monacoId,
      this.createCompletionProvider()
    )
  }

  registerDefinitionProvider() {
    return monaco.languages.registerDefinitionProvider(
      environmentKeyConfig[this.envKey].monacoId,
      this.createDefinitionProvider()
    )
  }

  registerFormattingProvider() {
    return monaco.languages.registerDocumentFormattingEditProvider(
      environmentKeyConfig[this.envKey].monacoId,
      this.createFormattingProvider()
    )
  }

  registerHighlightProvider() {
    return monaco.languages.registerDocumentHighlightProvider(
      environmentKeyConfig[this.envKey].monacoId,
      this.createHighlightProvider()
    )
  }

  registerHoverProvider() {
    return monaco.languages.registerHoverProvider(
      environmentKeyConfig[this.envKey].monacoId,
      this.createHoverProvider()
    )
  }

  registerSignatureProvider() {
    return monaco.languages.registerSignatureHelpProvider(
      environmentKeyConfig[this.envKey].monacoId,
      this.createSignatureProvider()
    )
  }

  registerSymbolProvider() {
    return monaco.languages.registerDocumentSymbolProvider(
      environmentKeyConfig[this.envKey].monacoId,
      this.createSymbolProvider()
    )
  }

  registerReferenceProvider() {
    return monaco.languages.registerReferenceProvider(
      environmentKeyConfig[this.envKey].monacoId,
      this.createReferenceProvider()
    )
  }

  registerCodeActionProvider() {
    return monaco.languages.registerCodeActionProvider(
      environmentKeyConfig[this.envKey].monacoId,
      this.createCodeActionProvider()
    )
  }

  // Provider creators
  // Generic position provider
  createPositionProvider(method: any, resolver: Function) {
    return (
      model: monaco.editor.IReadOnlyModel,
      pos: monaco.Position
    ): Promise<any> => {
      const {
        textDocument: document,
        position
      } = m2p.asTextDocumentPositionParams(model, pos, this.envKey)
      return method({
        ...this.idFields,
        position,
        document
      }).then(resolver)
    }
  }

  createCompletionProvider(): monaco.languages.CompletionItemProvider {
    return {
      provideCompletionItems: this.createPositionProvider(
        methods.fileComplete,
        (data: ICompleteResp) => {
          return p2m.asCompletionResult(data)
        }
      ),
      resolveCompletionItem: (item: CompletionItem) => {
        return methods
          .fileCompleteResolve({
            ...this.idFields,
            completionItem: m2p.asCompletionItem(item)
          })
          .then((item: ICompleteResolveResp) => p2m.asCompletionItem(item))
      }
    }
  }

  createDefinitionProvider(): monaco.languages.DefinitionProvider {
    return {
      provideDefinition: this.createPositionProvider(
        methods.fileDefinition,
        ({ locations }: IDefinitionResp) => {
          const results = p2m.asDefinitionResult(locations)
          if (is.array(results)) {
            // if arr length is 1 and model is not currently open
            if (
              results.length === 1 &&
              results[0].uri !== this.editor.getModel().uri
            ) {
              const filePath = stripUriPrefix(
                results[0].uri.toString(),
                this.envKey
              )
              this.onModelChange(filePath)
              this.openFile(filePath)
            }
            return results.map(loc => ({
              ...loc,
              uri: this.monaco.Uri.parse(
                stripUriPrefix(loc.uri.toString(), this.envKey)
              )
            }))
          } else {
            // console.log(
            //   "Invalid object passed to definition provider, argument 'locations' must be an array"
            // )
          }
        }
      )
    }
  }

  createFormattingProvider(): monaco.languages.DocumentFormattingEditProvider {
    return {
      provideDocumentFormattingEdits: (
        model: monaco.editor.IReadOnlyModel,
        options: FormattingOptions
      ) =>
        methods
          .fileFormatting({
            ...this.idFields,
            document: m2p.asTextDocumentIdentifier(model, this.envKey),
            options: m2p.asFormattingOptions(options)
          })
          .then(({ edits }: IFormattingResp) => p2m.asTextEdits(edits))
    }
  }

  createHighlightProvider(): monaco.languages.DocumentHighlightProvider {
    return {
      provideDocumentHighlights: this.createPositionProvider(
        methods.fileHighlight,
        ({ highlights }: IHighlightResp) => p2m.asDocumentHighlights(highlights)
      )
    }
  }

  createHoverProvider(): monaco.languages.HoverProvider {
    return {
      provideHover: this.createPositionProvider(
        methods.fileHover,
        (hover: IHoverResp) => p2m.asHover(hover)
      )
    }
  }

  createSignatureProvider(): monaco.languages.SignatureHelpProvider {
    return {
      provideSignatureHelp: this.createPositionProvider(
        methods.fileSignature,
        (sig: ISignatureResp) => p2m.asSignatureHelp(sig)
      ),
      signatureHelpTriggerCharacters: [] // TODO: what does this affect?
    }
  }

  createSymbolProvider(): monaco.languages.DocumentSymbolProvider {
    return {
      provideDocumentSymbols: (model: monaco.editor.IReadOnlyModel) =>
        methods
          .fileSymbols({
            ...this.idFields,
            document: m2p.asTextDocumentIdentifier(model, this.envKey)
          })
          .then(({ symbols }: ISymbolResp) => p2m.asSymbolInformations(symbols))
    }
  }

  createReferenceProvider(): monaco.languages.ReferenceProvider {
    return {
      provideReferences: (
        model: monaco.editor.IReadOnlyModel,
        pos: monaco.Position,
        ctx: monaco.languages.ReferenceContext
      ) => {
        const {
          textDocument: document,
          position
        } = m2p.asTextDocumentPositionParams(model, pos, this.envKey)
        return methods
          .fileReferences({
            ...this.idFields,
            document,
            position,
            context: ctx
          })
          .then(({ locations }: IReferencesResp) => p2m.asReferences(locations))
      }
    }
  }

  createCodeActionProvider(): monaco.languages.CodeActionProvider {
    return {
      provideCodeActions: (
        model: monaco.editor.IReadOnlyModel,
        r: monaco.Range,
        ctx: monaco.languages.CodeActionContext
      ) =>
        methods
          .fileCodeAction({
            ...this.idFields,
            document: m2p.asTextDocumentIdentifier(model, this.envKey),
            range: m2p.asRange(r),
            context: m2p.asCodeActionContext(ctx)
          })
          .then(({ commands }: ICodeActionResp) => p2m.asCommands(commands))
    }
  }
}
