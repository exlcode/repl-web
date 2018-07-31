import { send } from 'wsenv'
import { WS_METHODS } from 'wsenv/constants'
import {
  IFileLSPCloseReq,
  IFileLSPOpenReq,
  IGenericFileReq,
  IMoveFileReq,
  IPatchFileReq
} from 'typings/wsenv'

export const genericFileMethod = <T>(method: WS_METHODS) => (
  args: IGenericFileReq
) => {
  const { workspaceId, filePath, isDir, contents, environmentKey } = args
  return send<T>(method, {
    workspaceId,
    filePath,
    isDir,
    contents
  })
}

export const createFile = genericFileMethod<void>(WS_METHODS.newFile)
export const deleteFile = genericFileMethod<void>(WS_METHODS.deleteFile)
export const moveFile = (args: IMoveFileReq) => {
  const { workspaceId, oldFilePath, newFilePath, environmentKey } = args
  return send<void>(WS_METHODS.moveFile, {
    workspaceId,
    oldFilePath,
    newFilePath
  })
}
export const patchFile = (args: IPatchFileReq) => {
  const { workspaceId, filePath, isDir, patch, environmentKey } = args
  return send<void>(WS_METHODS.patchFile, {
    workspaceId,
    filePath,
    isDir,
    patch
  })
}

// File LSP methods
export const closeFile = (args: IFileLSPCloseReq) => {
  const { workspaceId, providerId, document } = args
  return send<void>(WS_METHODS.fileLSPClose, {
    workspaceId,
    providerId,
    document
  })
}
export const openFile = (args: IFileLSPOpenReq) => {
  const { workspaceId, providerId, document } = args
  return send<void>(WS_METHODS.fileLSPOpen, {
    workspaceId,
    providerId,
    document // TextDocumentItem
  })
}
