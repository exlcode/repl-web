import { environmentKeyConfig } from 'utils/constants'
import * as React from 'react'
import { endsWith } from 'lodash'
import * as uuid from 'uuid'
import { WorkspaceFile, WorkspaceFileRoot } from 'typings/wsenv'
import { IFileTreeNode } from 'typings/client'
import { update } from 'lodash'

const _stripFrontSlash = (uri: string): string => {
  if (uri) {
    return uri[0] === '/' ? uri.slice(1) : uri
  }
  return uri
}
export const removeNameExtension = (name: string) =>
  name.split('.').slice(0, -1).join('.')

export const addNameExtension = (name: string, environmentKey: string) => {
  const extension = environmentKeyConfig[environmentKey].extension
  if (!endsWith(name, extension)) {
    return `${name}${extension}`
  }
  return name
}

export const stripUriPrefix = (uri: string, envKey: string) => {
  const breakIndex = uri.indexOf(environmentKeyConfig[envKey].pathPrefix)
  if (breakIndex !== -1) {
    return uri.slice(
      breakIndex + environmentKeyConfig[envKey].pathPrefix.length
    )
  } else {
    // console.log(`Path prefix not found in uri: ${uri}`)
  }
  return uri
}

export const addPathPrefix = (name: string, envKey: string) =>
  `${environmentKeyConfig[envKey].pathPrefix}${_stripFrontSlash(name)}`

export const addFileProtocol = (name: string) =>
  `file://${_stripFrontSlash(name)}`

export const generateFile = (
  name: string,
  contents: string,
  path = ''
): any => ({
  id: uuid.v4(),
  name: path ? `${path}/${name}` : name,
  contents: contents,
  isClassFile: false,
  nameEditable: false,
  open: true,
  isDir: false,
  childNodes: null
})

export const generateFileNode = (): IFileTreeNode => ({
  id: uuid.v4(),
  filePath: '',
  contents: '',
  isDir: false,
  childNodes: null,
  open: false
})

export const generateFolderNode = () => ({
  ...generateFileNode(),
  isDir: true
})

export const toFileTreeNodes = (files: WorkspaceFileRoot): IFileTreeNode[] => {
  if (!files || !Object.keys(files).length) {
    return []
  }
  return Object.keys(files).map((fileKey, idx): IFileTreeNode => {
    const file = files[fileKey]
    return {
      id: uuid.v4(),
      isDir: file.isDir,
      filePath: file.name,
      contents: file.contents,
      childNodes: file.children ? toFileTreeNodes(file.children) : null,
      open: false
    }
  })
}

export const insertNodeInPath = (
  path: number[],
  treeNodes: IFileTreeNode[],
  newNode: IFileTreeNode
): IFileTreeNode[] => {
  if (path.length >= 1) {
    let objPath = path[0].toString()
    if (path.length >= 1) {
      objPath = path.join('.childNodes.')
    }
    return update<
      IFileTreeNode[]
    >(treeNodes, objPath, (node: IFileTreeNode) => ({
      ...node,
      childNodes: node.childNodes ? node.childNodes.concat(newNode) : [newNode]
    }))
  }
  return treeNodes.concat(newNode)
}

export const updateNodeTree = (
  nodeId: string,
  treeNodes: IFileTreeNode[],
  updater: ((node: IFileTreeNode) => IFileTreeNode) | Partial<IFileTreeNode>
): IFileTreeNode[] => {
  if (!treeNodes) {
    return null
  }
  let found = false
  return treeNodes.map(node => {
    if (node.id === nodeId) {
      found = true
      if (typeof updater === 'object') {
        return Object.assign({}, node, updater)
      }
      return updater(node)
    } else if (!found) {
      return {
        ...node,
        childNodes: updateNodeTree(nodeId, node.childNodes, updater)
      }
    }
    return node
  })
}

export const removeNode = (
  nodeId: string,
  treeNodes: IFileTreeNode[]
): IFileTreeNode[] => {
  if (!treeNodes) {
    return null
  }
  let found = false
  let nodes = treeNodes.map(node => {
    if (node.id === nodeId) {
      found = true
      return null
    } else if (!found) {
      return { ...node, childNodes: removeNode(nodeId, node.childNodes) }
    }
    return node
  })
  if (found) {
    nodes = nodes.filter(Boolean)
  }
  return nodes
}

export const getNodeWithFileId = (
  fileId: string,
  treeNodes: IFileTreeNode[]
): IFileTreeNode => {
  return getNode(treeNodes, node => node.id === fileId)
}

export const getNodeWithFilePath = (
  filePath: string,
  treeNodes: IFileTreeNode[]
): IFileTreeNode => {
  return getNode(treeNodes, node => node.filePath === filePath)
}

export const getNode = (
  treeNodes: IFileTreeNode[],
  checker: (args: IFileTreeNode) => boolean
): IFileTreeNode => {
  for (const node of treeNodes) {
    if (checker(node)) {
      return node
    } else if (node.childNodes && node.childNodes.length) {
      return getNode(node.childNodes, checker)
    }
  }
  return null
}

export const getNodeFilePath = (
  nodeId: string,
  treeNodes: IFileTreeNode[],
  path = [] as string[]
): string => {
  for (const node of treeNodes) {
    const newPath = path.concat(node.filePath)
    if (node.id === nodeId) {
      return newPath.join('/')
    } else if (node.childNodes) {
      return getNodeFilePath(nodeId, node.childNodes, newPath)
    }
  }
  return null
}

export const getFirstFileNode = (
  fileNodes: IFileTreeNode[],
  idx = 0
): IFileTreeNode => {
  const firstFile = fileNodes[idx]
  if (!firstFile) {
    return null
  }
  if (firstFile.isDir) {
    if (firstFile.childNodes && firstFile.childNodes.length) {
      return getFirstFileNode(firstFile.childNodes)
    }
    return getFirstFileNode(fileNodes, idx + 1)
  }
  return firstFile
}

export const getBaseName = (fileName: string) => {
  return fileName.split('/').slice(0, -1).filter(Boolean).join('/')
}

export const addPathComponent = (basePath: string, newPath: string) => {
  return basePath ? basePath.concat(`/${newPath}`) : newPath
}
