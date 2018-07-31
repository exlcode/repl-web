declare module 'sharedb/lib/client'
declare module 'ot-text'
declare module 'diff-match-patch'
declare module 'query-string'

interface ITheme {
  background: string
  primaryLight: string
  primaryDark: string
  primary: string
  secondaryLight: string
  secondaryDark: string
  secondary: string
  primaryText: string
  secondaryText: string
}

type Callback = (err: Error, payload?: any) => void
