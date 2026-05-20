import { mkdir, rm, stat } from 'node:fs/promises'
import { resolve } from 'node:path'

const directories = [
  '.nuxt/cache/nuxt/payload',
  '.nuxt/cache/nitro',
  '.nuxt/cache/vite'
]

async function ensureDirectory (directory) {
  const target = resolve(process.cwd(), directory)

  try {
    const current = await stat(target)
    if (current.isDirectory()) {
      return
    }

    await rm(target, { force: true })
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error
    }
  }

  await mkdir(target, { recursive: true })
}

await Promise.all(directories.map(directory => ensureDirectory(directory)))
