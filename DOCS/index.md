# Table of Contents

- [Tooling](#tooling)
- [File structure overview](#file-structure-overview)
- [State management](#state-management)
- [wsenv](#wsenv)

## Tooling

- React
- Typescript
- [monaco-editor](https://github.com/Microsoft/monaco-editor)
- [freactal](https://github.com/FormidableLabs/freactal)
- [styled-components](https://github.com/styled-components/styled-components)

## File structure overview

- app/
  - main.tsx (App entry point)
  - App.tsx (Root component)
  - sharedb/
    - index.ts (exports sharedb connection object)
    - shareMonaco.ts (exports custom monaco v9.x.x sharedb provider)
  - wsenv/
    - converter/ (fork of converter from typefox's [monaco-languageclient](https://github.com/TypeFox/monaco-languageclient/blob/master/src/converter.ts))
    - methods/ (exports of methods that send wsenv messages over socket connection)
    - client.ts (exports WebSockets client)
    - store.ts (internal store that maps pending message ids to their handlers)
    - monaco.ts (wsenv/monaco-editor custom adaptor. Used in [`app/components/Editor/index.tsx`](/app/components/Editor/index.tsx))
- assets/ (static files served by the development server)
- .envdefault (template file for environment variables. Create your own `.env` file to customize env variables)

### State management

State management in this project is largely handled using the freactal library. State and effects concerned with the editor logic can be found in [`app/App.tsx`](/app/App.tsx).

Note that the freactal library does not come with typescript definitions and is not entirely type-safe so it is encouraged for you to add type annotations wherever possible. The current freactal type definitions were generated in-house and can be found [here](/app/typings/freactal)

## wsenv

wsenv is a data layer protocol that is used for performing editor and terminal operations. All code that interacts with server using the wsenv protocol can be found in [`app/wsenv`](/app/wsenv)

A typical wsenv request contains a message type, message method, and a `data` field for storing message payloads. Below is a list of existing message types and their behaviours:

- `error`
  - Sent as a response from the server when an error occurs
- `req`
  - A request/response message type that is sent from the client. The client can expect a response message of type `resp` or `error`.
- `resp`
  - Response message type sent by the server
- `notif` (events)
  - One way message that can be dispatched by both client and server. Normally used for operations with undetermined time cost or push events from the server. (i.e. terminal operations and errors)

### Method Types

Below is an outline of the existing wsenv method types:

#### Workspace

- `wspc.new`
- `wspc.close`
- `wspc.get` (retrieves an existing workspace using `workspaceId`)

All file messages operate on a workspace instance, with a required `workspaceId` data field. This means that a workspace must be created or already exist before any file messages can be sent.

`wspc.close` should be sent whenever a user changes workspaces or closes the editor.

#### Terminal

- `instance.create` (new instance)
- `instance.terminate` (closes instance)

Creating a new terminal instance

#### File

- `file.new`
- `file.delete`
- `file.move`
- `file.patch` (send a file content "patch", akin to updating file contents)

These messages are relatively self-explanatory. Make sure that `file.patch` messages are dispatched before key file operations (i.e. `file.move`) otherwise the state in the patch message may be invalidated. In the future, the `file.patch` message may be deprecated in favour of updating file contents through sharedb.

#### LSP (language server protocol)

- `file.lsp.opened` ("opens" file)
- `file.lsp.closed` ("closes" file)

Before any additional file messages can be sent, the file must first be opened with `file.lsp.opened`.

- `file.lsp.completion`
- `file.lsp.completionResolve`
- `file.lsp.hover`
- `file.lsp.sigHelp`
- `file.lsp.definition`
- `file.lsp.formatting`
- ...

The remainder of the LSP method types are used and dispatched internally by the [monaco-editor/wsenv](/app/wsenv/monaco.ts) provider. You should never have to interact with these directly.

### Event types

Below is a list of wsenv event types and their uses:

- `instance.status`
  - Terminal status information
- `instance.tty`
  - Bidirectional message for sending terminal tty information
- `textDocument/publishDiagnostics`
  - Event sent by the server that gives diagnostic information to monaco-editor to display (i.e. errors and warnings)
