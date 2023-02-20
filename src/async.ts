import { Plugin } from '.'

export const resolve: Plugin = {
  mapper: false,
  do: x => Promise.all(x),
}
