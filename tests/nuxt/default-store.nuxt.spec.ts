import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useConstantStore } from '~/stores/constants'
import { useDefaultStore } from '~/stores/defaults'
import { useStyleStore } from '~/stores/style'
import {
  fixtureAuthor,
  fixtureConstants,
  fixtureDefaults,
  fixtureResource,
  fixtureServer,
} from '../fixtures/banner-fixtures'

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response
}

describe('default store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('tracks whether the current selected source can open the builder', () => {
    const defaults = useDefaultStore()

    expect(defaults.hasActiveBuilderSource).toBe(false)

    defaults.resource = fixtureResource
    defaults.markSelectedSource()

    expect(defaults.hasActiveBuilderSource).toBe(true)

    defaults.resetSelectedSource()

    expect(defaults.id).toBe('0')
    expect(defaults.platform).toBe('spigot')
    expect(defaults.type).toBe('resource')
    expect(defaults.hasActiveBuilderSource).toBe(false)
  })

  it('clones defaults for each builder initialization and keeps the cache on reset', async () => {
    const fetchMock = vi.fn(
      async () =>
        ({
          ok: true,
          status: 200,
          json: async () => fixtureDefaults,
        }) as Response,
    )
    vi.stubGlobal('fetch', fetchMock)
    const defaults = useDefaultStore()

    await defaults.initializeBuilder('resource')
    defaults.resource!.resource_name.display = 'Customized'
    defaults.resetSelectedSource()
    await defaults.initializeBuilder('resource')

    expect(defaults.resource?.resource_name.display).toBe('Example Resource')
    expect(fixtureDefaults.resource.resource_name.display).toBe(
      'Example Resource',
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('deduplicates concurrent defaults requests while initializing each type', async () => {
    const fetchMock = vi.fn(
      async () =>
        ({
          ok: true,
          status: 200,
          json: async () => fixtureDefaults,
        }) as Response,
    )
    vi.stubGlobal('fetch', fetchMock)
    const defaults = useDefaultStore()

    await Promise.all([
      defaults.initializeBuilder('resource'),
      defaults.initializeBuilder('author'),
      defaults.initializeBuilder('server'),
    ])

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(defaults.resource?.resource_name.display).toBe('Example Resource')
    expect(defaults.author?.author_name.display).toBe('Example Author')
    expect(defaults.server?.server_name.display).toBe('Example Server')
  })

  it('does not cache failed or malformed defaults and retries successfully', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({}, 503))
      .mockResolvedValueOnce(jsonResponse({ ...fixtureDefaults, resource: {} }))
      .mockResolvedValueOnce(jsonResponse(fixtureDefaults))
    vi.stubGlobal('fetch', fetchMock)
    const defaults = useDefaultStore()

    await expect(defaults.initializeBuilder('resource')).rejects.toThrow(
      'Defaults request failed: 503',
    )
    expect(defaults.resource).toBeUndefined()
    await expect(defaults.initializeBuilder('resource')).rejects.toThrow(
      'Invalid defaults response',
    )
    expect(defaults.resource).toBeUndefined()
    await defaults.initializeBuilder('resource')

    expect(defaults.resource?.resource_name.display).toBe('Example Resource')
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('generates resource preview URLs with template and v1 style params', () => {
    const constants = useConstantStore()
    const defaults = useDefaultStore()
    const style = useStyleStore()

    constants.templates = Object.entries(fixtureConstants.templates).map(
      ([key, value]) => ({
        key,
        value,
      }),
    )

    defaults.resource = fixtureResource
    defaults.id = '12345'
    defaults.platform = 'spigot'
    defaults.type = 'resource'
    defaults.template = 'Moonlight Purple'
    defaults.markSelectedSource()

    style.setBackgroundColor('#ABCDEF')
    style.setTextPrimaryColor('#112233')

    const url = defaults.generateBannerUrl()

    expect(url).toContain('/banner/resource/spigot/12345/banner.png?')
    expect(url).toContain('background__template=MOONLIGHT_PURPLE')
    expect(url).toContain('background__mode=solid')
    expect(url).toContain('background__color=abcdef')
    expect(url).toContain('text__primary_color=112233')
    expect(url).toContain('style__version=1')
  })

  it('generates server preview URLs from host and port', () => {
    const constants = useConstantStore()
    const defaults = useDefaultStore()

    constants.templates = Object.entries(fixtureConstants.templates).map(
      ([key, value]) => ({
        key,
        value,
      }),
    )

    defaults.server = fixtureServer
    defaults.type = 'server'
    defaults.host = 'play.example.test'
    defaults.port = 25565
    defaults.template = 'Moonlight Purple'
    defaults.markSelectedSource()

    const url = defaults.generateBannerUrl()

    expect(url).toContain('/banner/server/play.example.test/25565/banner.png?')
    expect(url).toContain('background__template=MOONLIGHT_PURPLE')
  })

  it('sends the expected save payload for author banners', async () => {
    const constants = useConstantStore()
    const defaults = useDefaultStore()
    const style = useStyleStore()

    const fetchMock = vi.fn<typeof fetch>(async () => {
      return {
        json: async () => ({ mnemonic: 'saved-author' }),
      } as Response
    })

    vi.stubGlobal('fetch', fetchMock)

    constants.templates = Object.entries(fixtureConstants.templates).map(
      ([key, value]) => ({
        key,
        value,
      }),
    )

    defaults.author = fixtureAuthor
    defaults.type = 'author'
    defaults.platform = 'spigot'
    defaults.id = 'HelpChat'
    defaults.template = 'Moonlight Purple'
    defaults.markSelectedSource()

    style.setShadowPreset('soft')

    const result = await defaults.save('SPIGOT_AUTHOR')
    const firstCall = fetchMock.mock.calls[0]

    expect(firstCall).toBeDefined()

    const [, init] = firstCall!
    const payload = JSON.parse(String((init as RequestInit | undefined)?.body))

    expect(result).toEqual({ mnemonic: 'saved-author' })

    expect(init).toMatchObject({
      method: 'POST',
    })

    expect(payload).toMatchObject({
      type: 'SPIGOT_AUTHOR',
      metadata: {
        author_id: 'HelpChat',
      },
      settings: {
        background__template: 'MOONLIGHT_PURPLE',
        author_name__display: 'Example Author',
        shadow__preset: 'soft',
        style__version: 1,
      },
    })
  })
})
