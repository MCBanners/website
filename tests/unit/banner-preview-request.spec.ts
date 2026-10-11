import { afterEach, describe, expect, it, vi } from 'vitest'
import { acquireBannerPreview } from '../../app/utils/banner-preview-request'

function response(ok: boolean): Response {
  return {
    ok,
    status: ok ? 200 : 503,
    blob: async () => new Blob(['preview']),
  } as Response
}

describe('acquireBannerPreview', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shares an in-flight request and aborts only after its final consumer releases', async () => {
    let resolveRequest: (response: Response) => void = () => {}
    let signal: AbortSignal | null = null
    const fetchMock = vi.fn((_url: RequestInfo | URL, init?: RequestInit) => {
      signal = init?.signal as AbortSignal | null
      return new Promise<Response>((resolve) => {
        resolveRequest = resolve
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    const first = acquireBannerPreview('/banner/preview?same')
    const second = acquireBannerPreview('/banner/preview?same')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    first.release()
    expect(signal?.aborted).toBe(false)
    second.release()
    expect(signal?.aborted).toBe(true)

    resolveRequest(response(true))
    await expect(first.promise).resolves.toBeInstanceOf(Blob)
  })

  it('rejects HTTP errors and allows the URL to be requested again', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response(false))
      .mockResolvedValueOnce(response(true))
    vi.stubGlobal('fetch', fetchMock)

    const failed = acquireBannerPreview('/banner/preview?retry')
    await expect(failed.promise).rejects.toThrow('HTTP 503')
    failed.release()

    const recovered = acquireBannerPreview('/banner/preview?retry')
    await expect(recovered.promise).resolves.toBeInstanceOf(Blob)
    recovered.release()

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
