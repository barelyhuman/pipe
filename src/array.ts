import { Plugin } from '.'

const _flatten = y =>
  Array.isArray(y) ? y.reduce((acc, item) => acc.concat(_flatten(item)), []) : y

export const flatten: Plugin = {
  mapper: false,
  async do(x: any[]) {
    return _flatten(x)
  },
}
