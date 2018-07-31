import {
  ICodeActionReq,
  IFormattingReq,
  IReferencesReq,
  IGenericLSPReq,
  ICompleteResolveReq,
  ICompleteResp,
  IHoverResp,
  IDefinitionResp,
  IHighlightResp,
  ISignatureResp,
  ISymbolResp,
  IClassContentsResp,
  ICompleteResolveResp,
  IFormattingResp,
  ICodeActionResp,
  IReferencesResp
} from 'typings/wsenv'
import { send } from 'wsenv'
import { WS_METHODS } from 'wsenv/constants'

const genericLSPMethod = <T>(method: WS_METHODS) => (args: IGenericLSPReq) => {
  const { workspaceId, providerId, document, position } = args
  if (!workspaceId) {
    return Promise.reject(new Error(`Workspace id not found: ${workspaceId}`))
  }
  return send<T>(method, {
    workspaceId,
    providerId,
    document,
    position
  })
}

export const fileComplete = genericLSPMethod<ICompleteResp>(
  WS_METHODS.fileCompletion
)
export const fileHover = genericLSPMethod<IHoverResp>(WS_METHODS.fileHover)
export const fileDefinition = genericLSPMethod<IDefinitionResp>(
  WS_METHODS.fileDefinition
)
export const fileHighlight = genericLSPMethod<IHighlightResp>(
  WS_METHODS.fileHighlight
)
export const fileSignature = genericLSPMethod<ISignatureResp>(
  WS_METHODS.fileSigHelp
)
export const fileSymbols = genericLSPMethod<ISymbolResp>(WS_METHODS.fileSymbols)
export const fileClassContents = genericLSPMethod<IClassContentsResp>(
  WS_METHODS.fileClassContents
)
export const fileCompleteResolve = (args: ICompleteResolveReq) => {
  const { workspaceId, providerId, completionItem } = args
  return send<ICompleteResolveResp>(WS_METHODS.fileCompletionResolve, {
    workspaceId,
    providerId,
    completionItem
  })
}

export const fileFormatting = (args: IFormattingReq) => {
  const { workspaceId, providerId, document, options } = args
  return send<IFormattingResp>(WS_METHODS.fileFormatting, {
    workspaceId,
    providerId,
    document,
    options
  })
}
export const fileCodeAction = (args: ICodeActionReq) => {
  const { workspaceId, providerId, document, range, context } = args
  return send<ICodeActionResp>(WS_METHODS.fileCodeAction, {
    workspaceId,
    providerId,
    document,
    range,
    context
  })
}
export const fileReferences = (args: IReferencesReq) => {
  const { workspaceId, providerId, document, position, context } = args
  return send<IReferencesResp>(WS_METHODS.fileReferences, {
    workspaceId,
    providerId,
    document,
    position,
    context
  })
}
