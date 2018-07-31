import IModelContentChange = monaco.editor.IModelContentChange

// Checks if two monaco Ranges are equal
const rangeEqual = (range1: monaco.IRange, range2: monaco.IRange) => {
  return (
    range1.endLineNumber === range2.endLineNumber &&
    range1.startLineNumber === range2.startLineNumber &&
    range1.startColumn === range2.startColumn &&
    range1.endColumn === range2.endColumn
  )
}

const getPositionFromOffset = (
  text: string,
  offset: number,
  startingOffset = 0,
  startPos = { lineNumber: 1, column: 1 }
): monaco.IPosition => {
  let lineNumber = startPos.lineNumber
  let column = startPos.column
  for (; startingOffset < offset; startingOffset++) {
    if (text[startingOffset] === '\n') {
      lineNumber++
      column = 1
    } else {
      column++
    }
  }
  return {
    lineNumber,
    column
  }
}

const getRangeFromOffset = (
  text: string,
  startOffset: number,
  endOffset?: number
): monaco.IRange => {
  endOffset = endOffset ? endOffset : startOffset
  const startPos = getPositionFromOffset(text, startOffset)
  const endPos = getPositionFromOffset(text, endOffset, startOffset, startPos)
  return {
    startColumn: startPos.column,
    endColumn: endPos.column,
    startLineNumber: startPos.lineNumber,
    endLineNumber: endPos.lineNumber
  }
}

export default class ShareDBMonaco {
  editor: monaco.editor.ICodeEditor
  disposeListener: monaco.IDisposable

  // ShareDB document
  shareDoc: any

  // Latest editor value before a sharedb op
  lastValue: string

  // Key in document to perform operation
  key: string

  // Keeps track of last edits made from sharedb operations
  lastEdits: any

  constructor(editor: monaco.editor.ICodeEditor, shareDoc: any, key = 'text') {
    this.editor = editor
    this.shareDoc = shareDoc
    this.key = key
    this.lastEdits = []
  }

  public start = () => {
    this.lastValue = this.editor.getValue()

    this.editor.onDidChangeModel(() => {
      this.disposeListener.dispose()
      this.disposeListener = this.editor
        .getModel()
        .onDidChangeContent(this.contentListener)
    })

    // Initialize monaco and sharedb op listeners
    this.disposeListener = this.editor
      .getModel()
      .onDidChangeContent(this.contentListener)
    this.shareDoc.on('op', this.opListener)
  }

  public stop() {
    this.shareDoc.removeListener('op', this.opListener)
    this.disposeListener.dispose()
  }

  contentListener = (e: monaco.editor.IModelContentChangedEvent) => {
    this.shareDoc.submitOp(this.createOpsFromChanges(e.changes))
    this.lastValue = this.editor.getValue()
  }

  // Converts monaco model content change to sharedb op
  createOpsFromChanges = (changes: IModelContentChange[]) => {
    let operations = []
    outer: for (const change of changes) {
      let op = []
      for (let edit of this.lastEdits) {
        if (edit.text === change.text && rangeEqual(edit.range, change.range)) {
          continue outer
        }
      }
      const lineArray = this.lastValue.split('\n')
      const offset =
        change.range.startColumn -
        1 +
        lineArray
          .slice(0, change.range.startLineNumber - 1)
          .reduce((prev, curr) => {
            return prev + curr.length + 1
          }, 0)
      if (offset > 0) {
        op.push(offset)
      }
      if (change.text) {
        op.push(change.text)
      }
      if (change.rangeLength > 0) {
        op.push({ d: change.rangeLength })
      }
      operations.push({
        t: 'text',
        p: [this.key],
        o: op
      })
    }
    return operations
  }

  // Applies changes to monaco using sharedb op
  opListener = (op: any, source: any) => {
    if (!source) {
      const edits: any[] = []
      const model = this.editor.getModel()
      op.forEach((opPart: any) => {
        if (opPart.t === 'text' && opPart.p && opPart.p[0] === this.key) {
          const text = model.getValue()
          let lastOffset = 0
          opPart.o.forEach((part: any) => {
            if (typeof part === 'number') {
              lastOffset += part
            } else if (typeof part === 'string') {
              edits.push({
                identifier: {
                  major: 0,
                  minor: 0
                },
                text: part,
                range: getRangeFromOffset(text, lastOffset),
                forceMoveMarkers: false,
                isAutoWhitespaceEdit: false
              })
            } else if (typeof part === 'object') {
              if (typeof part.d === 'number') {
                edits.push({
                  identifier: {
                    major: 0,
                    minor: 0
                  },
                  text: '',
                  range: getRangeFromOffset(
                    text,
                    lastOffset,
                    lastOffset + part.d
                  ),
                  forceMoveMarkers: false,
                  isAutoWhitespaceEdit: false
                })
                // add to offset to simulate deletion on old text
                lastOffset += part.d
              }
            } else {
              // invalid operation
              console.error('Invalid text operation')
            }
          })
        }
      })
      this.lastEdits = edits
      const selection = this.editor.getSelection()
      model.applyEdits(edits)
      this.editor.setSelection(selection)
    }
  }
}

interface IOptions {
  key?: string
  value?: string
}

const defaultOptions = { key: 'text', value: '' }
// Entry point
export const attachToMonaco = (
  shareDoc: any,
  editor: monaco.editor.ICodeEditor,
  opts?: IOptions
) => {
  const options = Object.assign({}, defaultOptions, opts)
  const shareDBMonaco = new ShareDBMonaco(editor, shareDoc, options.key)
  shareDoc.subscribe((err: Error) => {
    if (err) {
      throw err
    }
    if (!shareDoc.type) {
      shareDoc.create({
        [options.key]: options.value
      })
    }
    // Set value from shareDB doc
    editor.setValue(shareDoc.data[options.key])
    shareDBMonaco.start()
  })
  return shareDBMonaco
}
