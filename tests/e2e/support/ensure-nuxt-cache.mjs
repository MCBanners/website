import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const directories = [
  '.nuxt/cache/nuxt/payload',
  '.nuxt/cache/nitro',
  '.nuxt/cache/vite'
]

await Promise.all(
  directories.map(directory => mkdir(resolve(process.cwd(), directory), { recursive: true }))
)
