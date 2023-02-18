import { Plugin } from '.'

export const addResolveAll: Plugin<'resolveAll'> = {
  name: 'resolveAll',
  mapper: false,
  async do(x: Promise<any>[]) {
    return Promise.all(x)
  },
} 
