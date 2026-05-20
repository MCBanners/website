import http from 'node:http'
import { constants, defaults, transparentPngBase64 } from './mock-data.mjs'

const port = Number(process.env.PLAYWRIGHT_API_PORT || 4310)
const host = process.env.PLAYWRIGHT_API_HOST || '127.0.0.1'
const transparentPng = Buffer.from(transparentPngBase64, 'base64')

function sendJson (res, body, status = 200) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type'
  })
  res.end(JSON.stringify(body))
}

function sendPng (res) {
  res.writeHead(200, {
    'content-type': 'image/png',
    'cache-control': 'no-store',
    'access-control-allow-origin': '*'
  })
  res.end(transparentPng)
}

function readBody (req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => resolve(body))
  })
}

function isInvalidValidationPath (pathname) {
  return /\/invalid(?:-|\/|$)/i.test(pathname) || /invalid\.example\.test/i.test(pathname)
}

function isKnownServerBannerPath (pathname) {
  return /^\/banner\/server\/(?:minecraft|hytale)\/[^/]+\/[0-9]+\/(?:isValid|banner\.png)$/i.test(pathname)
    || /^\/banner\/server\/[^/]+\/[0-9]+\/(?:isValid|banner\.png)$/i.test(pathname)
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${host}:${port}`)
  const pathname = url.pathname

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET,POST,OPTIONS',
      'access-control-allow-headers': 'content-type'
    })
    res.end()
    return
  }

  if (pathname === '/health') {
    sendJson(res, { ok: true })
    return
  }

  if (pathname === '/banner/svc/constants') {
    sendJson(res, constants)
    return
  }

  if (pathname === '/banner/svc/defaults/all') {
    sendJson(res, defaults)
    return
  }

  if (pathname.startsWith('/banner/server/') && !isKnownServerBannerPath(pathname)) {
    sendJson(res, { error: `Unhandled mock API route: ${pathname}` }, 404)
    return
  }

  if (pathname.endsWith('/isValid')) {
    sendJson(res, { valid: !isInvalidValidationPath(pathname) })
    return
  }

  if (pathname === '/banner/saved/save') {
    await readBody(req)
    sendJson(res, { mnemonic: 'e2e-banner' })
    return
  }

  if (pathname.endsWith('.png')) {
    sendPng(res)
    return
  }

  sendJson(res, { error: `Unhandled mock API route: ${pathname}` }, 404)
})

server.listen(port, host, () => {
  console.log(`Mock MCBanners API listening at http://${host}:${port}`)
})

function shutdown () {
  server.close(() => process.exit(0))
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
