const namespace = Symbol.for('BARELYHUMAN_PIPE')

type ChainItem = {
  chainType: 'normal' | 'mapper'
  fn: Function
}

export type Plugin = {
  name: string
  mapper: boolean
  do: Function
}

export const pipe = function (initData, chain: ChainItem[] = []) {
  let _data = initData
  if (_data && _data.__namespace === namespace) {
    chain.push({
      chainType: 'normal',
      fn: () => {
        return _data.run()
      },
    })
  }
  if (typeof initData === 'function') {
    _data = initData()
  }
  return {
    __namespace: namespace,
    to(fn: Function) {
      chain.push({
        chainType: 'normal',
        fn: fn,
      })
      return this
    },
    plugin(plug: Plugin) {
      if (!plug.do || typeof plug.do != 'function') {
        throw new Error('do is required and needs to be a function')
      }
      this[plug.name] = function () {
        if (plug.mapper) {
          return this.map(plug.do)
        }
        return this.to(plug.do)
      }
      return this
    },
    map(fn: Function) {
      chain.push({
        chainType: 'mapper',
        fn: fn,
      })
      return this
    },
    async run() {
      let initValue = _data
      if (_data instanceof Promise) {
        initValue = await _data
      }
      const chainableFn = function (acc, item: ChainItem) {
        if (item.chainType === 'normal') {
          return acc.then(function (prev) {
            return item.fn(prev)
          })
        } else if (item.chainType === 'mapper') {
          return acc.then(function (prev) {
            return Array.isArray(prev) && prev.map(x => item.fn(x))
          })
        }
      }
      return chain.reduce(chainableFn, Promise.resolve(initValue))
    },
  }
}
