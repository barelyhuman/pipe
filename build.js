import * as esbuild from 'esbuild'
import Watcher from 'watcher'
import glob from 'tiny-glob'

const watch = process.argv.slice(2).includes('-w')

const common = {
  logLevel: 'info',
}

async function main() {
  await core()
  await array()
}

async function core() {
  const entry = ['src/index.ts']
  const output = [
    {
      path: 'dist/index.js',
      format: 'esm',
    },
    {
      path: 'dist/index.cjs',
      format: 'cjs',
    },
  ]

  const toBuild = output.map(async out => {
    esbuild.build({
      ...common,
      outfile: out.path,
      format: out.format,
      entryPoints: entry,
    })
  })

  return Promise.all(toBuild)
}

async function array() {
  const entry = ['src/array.ts']
  const output = [
    {
      path: 'dist/array.js',
      format: 'esm',
    },
    {
      path: 'dist/array.cjs',
      format: 'cjs',
    },
  ]

  const toBuild = output.map(async out => {
    esbuild.build({
      ...common,
      outfile: out.path,
      format: out.format,
      entryPoints: entry,
    })
  })

  return Promise.all(toBuild)
}

// if watching, watcher will execute an
// initial build
!watch && (await main())

if (watch) {
  const gPaths = await glob('./src/**/*.{ts,js}', { absolute: true })
  const watcher = new Watcher(gPaths)
  watcher.on('error', error => {
    console.error(error)
  })

  watcher.on('close', () => {
    process.exit(0)
  })

  watcher.on('all', async () => {
    await main()
  })
}
