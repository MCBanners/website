import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useConstantStore } from '~/stores/constants'
import { fixtureConstants } from '../fixtures/banner-fixtures'

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response
}

describe('constant store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('retries HTTP and malformed responses before caching constants', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(jsonResponse({}, 503))
      .mockResolvedValueOnce(jsonResponse({ ...fixtureConstants, fonts: [] }))
      .mockResolvedValueOnce(jsonResponse(fixtureConstants))
    vi.stubGlobal('fetch', fetchMock)
    const constants = useConstantStore()

    await expect(constants.getConstants()).rejects.toThrow(
      'Constants request failed: 503',
    )
    expect(constants.templates).toHaveLength(0)
    await expect(constants.getConstants()).rejects.toThrow(
      'Invalid constants response',
    )
    expect(constants.templates).toHaveLength(0)
    await constants.getConstants()

    expect(constants.templates).toHaveLength(2)
    expect(constants.alignments).toHaveLength(3)
    expect(constants.fontFaces).toHaveLength(2)
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('shares a concurrent constants request', async () => {
    const fetchMock = vi.fn(async () => jsonResponse(fixtureConstants))
    vi.stubGlobal('fetch', fetchMock)
    const constants = useConstantStore()

    await Promise.all([constants.getConstants(), constants.getConstants()])

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(constants.templates).toHaveLength(2)
  })
})
