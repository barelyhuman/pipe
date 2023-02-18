import { Plugin } from '.'

const flatten = y =>
  Array.isArray(y) ? y.reduce((acc, item) => acc.concat(flatten(item)), []) : y

export const addFlatten: Plugin = {
  name: 'flatten',
  mapper: false,
  async do(x: any[]) {
    return flatten(x)
  },
}
