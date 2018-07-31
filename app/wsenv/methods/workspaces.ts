import * as uuid from 'uuid'
import { send } from 'wsenv'
import { WS_METHODS } from 'wsenv/constants'
import { ICreateWorkspaceResp, IWorkspace } from 'typings/wsenv'
import { environmentKeyConfig } from '../../utils/constants'

export const createWorkspace = ({
  id = uuid.v4(),
  files,
  environmentKey = environmentKeyConfig.java_default_free.id
}: Partial<IWorkspace>) =>
  send<ICreateWorkspaceResp>(WS_METHODS.newWorkspace, {
    id,
    files,
    environmentKey
  })

export const closeWorkspace = (id: string) =>
  send<void>(WS_METHODS.closeWorkspace, {
    id
  })

export const getWorkspace = (id: string) =>
  send<IWorkspace>(WS_METHODS.getWorkspace, {
    id
  })
