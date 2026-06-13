import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useBannerEntryFlow } from '~/composables/useBannerEntryFlow'
import { useDefaultStore } from '~/stores/defaults'
import { fixtureDefaults } from '../fixtures/banner-fixtures'

function jsonResponse(body: unknown) {
  return {
    json: async () => body,
  } as Response
}

function pathnameFromFetchInput(input: RequestInfo | URL): string {
  return new URL(String(input)).pathname
}

describe('useBannerEntryFlow', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('validates a resource and selects it for the builder', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const pathname = pathnameFromFetchInput(input)

      if (pathname === '/banner/svc/defaults/all') {
        return jsonResponse(fixtureDefaults)
      }

      if (pathname === '/banner/resource/spigot/12345/isValid') {
        return jsonResponse({ valid: true })
      }

      throw new Error(`Unexpected fetch: ${pathname}`)
    })
    vi.stubGlobal('fetch', fetchMock)

    const flow = useBannerEntryFlow()
    const result = await flow.validateResource('spigot', '12345')
    const defaults = useDefaultStore()

    expect(result).toEqual({ ok: true })
    expect(defaults.type).toBe('resource')
    expect(defaults.platform).toBe('spigot')
    expect(defaults.id).toBe('12345')
    expect(defaults.hasSelectedSource).toBe(true)
    expect(defaults.resource?.resource_name.display).toBe('Example Resource')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('returns a resource validation error without selecting a source', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse({ valid: false })),
    )

    const flow = useBannerEntryFlow()
    const result = await flow.validateResource('spigot', 'invalid-resource')
    const defaults = useDefaultStore()

    expect(result).toEqual({
      ok: false,
      message:
        'Failed to fetch resource. Check that the resource ID is correct.',
    })
    expect(defaults.hasSelectedSource).toBe(false)
    expect(defaults.id).toBe('0')
  })

  it('validates an author and stores the author source details', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const pathname = pathnameFromFetchInput(input)

        if (pathname === '/banner/svc/defaults/all') {
          return jsonResponse(fixtureDefaults)
        }

        if (pathname === '/banner/author/spigot/HelpChat/isValid') {
          return jsonResponse({ valid: true })
        }

        throw new Error(`Unexpected fetch: ${pathname}`)
      }),
    )

    const flow = useBannerEntryFlow()
    const result = await flow.validateAuthor('spigot', 'HelpChat')
    const defaults = useDefaultStore()

    expect(result).toEqual({ ok: true })
    expect(defaults.type).toBe('author')
    expect(defaults.platform).toBe('spigot')
    expect(defaults.id).toBe('HelpChat')
    expect(defaults.author?.author_name.display).toBe('Example Author')
  })

  it('validates a server and stores host/port source details', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const pathname = pathnameFromFetchInput(input)

        if (pathname === '/banner/svc/defaults/all') {
          return jsonResponse(fixtureDefaults)
        }

        if (pathname === '/banner/server/play.example.test/25565/isValid') {
          return jsonResponse({ valid: true })
        }

        throw new Error(`Unexpected fetch: ${pathname}`)
      }),
    )

    const flow = useBannerEntryFlow()
    const result = await flow.validateServer('play.example.test', 25565)
    const defaults = useDefaultStore()

    expect(result).toEqual({ ok: true })
    expect(defaults.type).toBe('server')
    expect(defaults.host).toBe('play.example.test')
    expect(defaults.port).toBe(25565)
    expect(defaults.server?.server_name.display).toBe('Example Server')
  })

  it('resolves platform banner types for matching resource and author platforms', () => {
    const flow = useBannerEntryFlow()

    expect(
      flow.getPlatformBannerType('resource', 'spigot', [
        { label: 'Spigot', value: 'spigot', bannerType: 'SPIGOT_RESOURCE' },
      ]),
    ).toBe('SPIGOT_RESOURCE')

    expect(
      flow.getPlatformBannerType('author', 'spigot', [
        { label: 'Spigot', value: 'spigot', bannerType: 'SPIGOT_AUTHOR' },
      ]),
    ).toBe('SPIGOT_AUTHOR')

    expect(
      flow.getPlatformBannerType('resource', 'spigot', [
        { label: 'Spigot', value: 'spigot', bannerType: 'SPIGOT_AUTHOR' },
      ]),
    ).toBeUndefined()
  })
})
