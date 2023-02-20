import { Plugin } from '.'

const _flatten = y =>
  y && Array.isArray(y) ? y.reduce((acc, item) => acc.concat(_flatten(item)), []) : y

const _groupBy = (x, keyGen) =>
x && Array.isArray(x)
    ? x.reduce((acc, item) => {
        const key = keyGen(item)
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(item)
        return acc
      }, {})
    : x

export const flatten: Plugin = {
  mapper: false,
  async do(x: any[]) {
    return _flatten(x)
  },
}

export const groupBy = (keyGen = x => x): Plugin => {
  return {
    mapper: false,
    async do(x: any[]) {
      return _groupBy(x, keyGen)
    },
  }
}
