import * as esbuild from 'esbuild'
import Watcher from 'watcher'
import glob from 'tiny-glob'
import path from 'path'
import fs from 'fs/promises'

const watch = process.argv.slice(2).includes('-w')

const common = {
  logLevel: 'info',
}

function createEntry(entry) {
  const formats = [
    {
      format: 'esm',
      outfile(filename) {
        let outFile = filename
        if (filename.endsWith('.ts') || filename.endsWith('.js')) {
          outFile = filename.replace(/\.ts$/, '.js')
        }
        return path.join('./dist', outFile)
      },
    },
    {
      format: 'cjs',
      outfile(filename) {
        let outFile = filename
        if (filename.endsWith('.ts') || filename.endsWith('.js')) {
          outFile = filename.replace(/\.ts$/, '.cjs')
        }
        return path.join('./dist', outFile)
      },
    },
  ]

  let filename = path.basename(entry)
  return formats.map(x => {
    return {
      ...common,
      entryPoints: [].concat(entry),
      format: x.format,
      outfile: x.outfile(filename),
    }
  })
}

async function main() {
  const configs = [].concat(
    createEntry('src/index.ts'),
    createEntry('src/array.ts'),
    createEntry('src/async.ts')
  )
  await Promise.all(configs.map(x => esbuild.build(x)))
  await copyAssets()
}

async function copyAssets() {
  await fs.copyFile('./package.json', './dist/package.json')
  await fs.copyFile('./LICENSE', './dist/LICENSE')
  await fs.copyFile('./README.md', './dist/README.md')
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
