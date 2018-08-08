export type UrlProvider = () => Promise<string>

export default class DWebSocket {
  private _ws: WebSocket
  private _url: string
  private _urlProvider: UrlProvider
  public sendEvent: any
  public onclose: (this: DWebSocket, ev: CloseEvent) => any
  public onerror: (this: DWebSocket, ev: Event) => any
  public onmessage: (this: DWebSocket, ev: MessageEvent) => any
  public onopen: (this: DWebSocket, ev: Event) => any

  private _setupListeners() {
    this._ws.onclose = ((ws: DWebSocket) => {
      return (ev: CloseEvent) => {
        if (ws.onclose) {
          return ws.onclose(ev)
        }
      }
    })(this)

    this._ws.onerror = ((ws: DWebSocket) => {
      return (ev: Event) => {
        if (ws.onerror) {
          return ws.onerror(ev)
        }
      }
    })(this)

    this._ws.onmessage = ((ws: DWebSocket) => {
      return (ev: MessageEvent) => {
        if (ws.onmessage) {
          return ws.onmessage(ev)
        }
      }
    })(this)

    this._ws.onopen = ((ws: DWebSocket) => {
      return (ev: Event) => {
        if (ws.onopen) {
          return ws.onopen(ev)
        }
      }
    })(this)
  }

  private async _connect() {
    this._url = await this._urlProvider()
    this._ws = new WebSocket(this._url)
    this._setupListeners()
  }

  constructor(provider: UrlProvider) {
    this._urlProvider = provider
    this._connect()
  }

  public close(code?: number, reason?: string): void {
    return this._ws.close(code, reason)
  }

  public send(data: any): void {
    console.log('in dwebsocket sending data: ', data)
    return this._ws.send(data)
  }

  public protocol(): string {
    return this._ws.protocol
  }

  public readyState(): number {
    return this._ws.readyState
  }

  public url(): string {
    return this._ws.url
  }
}
