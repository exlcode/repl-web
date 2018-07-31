import * as ShareDB from 'sharedb/lib/client'
import * as otText from 'ot-text'
import { SHAREDB_URL } from '../utils/constants'
ShareDB.types.map['json0'].registerSubtype(otText.type)

const socket = new WebSocket(SHAREDB_URL)
const connection = new ShareDB.Connection(socket)

export default connection
