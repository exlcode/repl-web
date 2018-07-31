import * as _ from 'lodash'
import { environmentKeyConfig } from 'utils/constants'
import { IWorkspace, WorkspaceFile, WorkspaceFileRoot } from '../typings/wsenv'
import { generateFile } from './files'
import IFile = client.IEditorNode
import IFiles = client.IEditorNodeRoot

export const toLSWorkspaceFiles = (
  fileArray: IFile[]
): { [key: string]: WorkspaceFile } =>
  fileArray.reduce(
    (acc, file) =>
      _.merge({}, acc, {
        [file.name]: toLSWorkspaceFile(file)
      }),
    {}
  )

export const toLSWorkspace = (
  id: string,
  name: string,
  files: IFile[],
  environmentKey: string
): any => ({
  id,
  name,
  files: toLSWorkspaceFiles(files),
  environmentKey
})

export const toLSWorkspaceFile = (fileObj: IFile): WorkspaceFile => ({
  isDir: false,
  isHidden: false,
  isImmutable: false,
  isTmplFile: false,
  contents: fileObj.contents,
  name: fileObj.name
})

export const generateDefaultLSWorkspaceFiles = (
  environmentKey: string
): WorkspaceFileRoot => {
  if (!(environmentKey in environmentKeyConfig)) {
    throw new Error(`Environment key not found: ${environmentKey}`)
  }
  const envKey = environmentKeyConfig[environmentKey]
  const name = envKey.defaultFileName()
  return {
    [name]: toLSWorkspaceFile(
      generateFile(name, envKey.defaultFileContents(name))
    )
  }
}

export const generateDefaultLSWorkspace = (
  environmentKey: string,
  files: WorkspaceFileRoot = null
): IWorkspace => {
  switch (environmentKey) {
    case environmentKeyConfig.java_default_free.id: {
      const envKey = environmentKeyConfig[environmentKey]
      const name = envKey.defaultFileName()
      return {
        files: files
          ? insertJavaObjectPath(files)
          : insertJavaObjectPath(
              generateDefaultLSWorkspaceFiles(environmentKey)
            ),
        name: '',
        environmentKey
      }
    }
    case environmentKeyConfig.python_2_7_free.id: {
      const envKey = environmentKeyConfig[environmentKey]
      const name = envKey.defaultFileName()
      return {
        files: files || {
          [name]: toLSWorkspaceFile(
            generateFile(name, envKey.defaultFileContents(name))
          )
        },
        name: '',
        environmentKey
      }
    }
    default:
      throw new Error(`Environment key not found: ${environmentKey}`)
      break
  }
}

export const insertJavaObjectPath = (
  files: WorkspaceFileRoot
): WorkspaceFileRoot => ({
  src: {
    name: 'src',
    isDir: true,
    children: {
      main: {
        name: 'main',
        isDir: true,
        children: {
          java: {
            name: 'java',
            isDir: true,
            children: {
              exlcode: {
                name: 'exlcode',
                isDir: true,
                children: files
              }
            }
          }
        }
      }
    }
  }
})

const _extractJavaFiles = (files: WorkspaceFileRoot): WorkspaceFileRoot =>
  _.get(files, 'src.children.main.children.java.children.exlcode.children', {})

export const extractWSENVFiles = (
  files: WorkspaceFileRoot,
  environmentKey: string
) => {
  if (!files) {
    return null
  }
  switch (environmentKey) {
    case environmentKeyConfig.java_default_free.id:
      return _extractJavaFiles(files)
    default:
      return files
  }
}

export const toWSENVFiles = (
  files: WorkspaceFileRoot,
  environmentKey: string
): WorkspaceFileRoot => {
  switch (environmentKey) {
    case environmentKeyConfig.java_default_free.id:
      return insertJavaObjectPath(files)
    default:
      return files
  }
}
