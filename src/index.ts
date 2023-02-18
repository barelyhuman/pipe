const namespace = Symbol.for('BARELYHUMAN_PIPE')

type ChainItem = {
  chainType: 'normal' | 'mapper'
  fn: Function
}

export type Plugin<T extends String> = {
  name: T
  mapper?: boolean
  do: Function
}

const RESTRICTED_PLUGIN_NAMES = ['map', 'to']

type PipePrototype = {
  __namespace: symbol
  to(fn: Function): any
  plugins<Name extends string, T extends Plugin<Name>[]>(
    plugs: T
  ): { [key in T[number]['name']]: (fn?: any) => PipePrototypeExtended<T[number]['name']> }
  map(fn: Function): any
  run(): Promise<any>
}

type PipePrototypeExtended<K extends string> = PipePrototype & {
  [key in K]: (fn?: any) => PipePrototypeExtended<K>
}

export function pipe(initData: any, chain: ChainItem[] = []): PipePrototype {
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
    plugins<Name extends string, T extends Plugin<Name>[]>(
      plugs: T
    ): PipePrototypeExtended<Name> {
      plugs.forEach(plug => {
        if (!plug.do || typeof plug.do != 'function') {
          throw new Error('do is required and needs to be a function')
        }

        if (RESTRICTED_PLUGIN_NAMES.indexOf(plug.name) > -1) {
          throw new Error(
            `${plug.name} is a reserved name in pipe, please name you plugin something else`
          )
        }

        this[plug.name] = function () {
          if (plug.mapper) {
            return this.map(plug.do)
          }
          return this.to(plug.do)
        }
      })

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
