import * as queryString from 'query-string'

export const getQueryParam = (param: string = null) => {
  const parsed = queryString.parse(location.search)
  if (param) {
    return parsed[param]
  }
  return parsed
}

export const getJsonParam = (param: string) => {
  const parsed = queryString.parse(location.search)
  try {
    return JSON.parse(parsed[param])
  } catch (error) {
    return null
  }
}
