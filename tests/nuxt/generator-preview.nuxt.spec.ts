import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest'
import GeneratorPreview from '~/components/generator/GeneratorPreview.vue'
import { useDefaultStore } from '~/stores/defaults'
import { THEME_PRESETS, useStyleStore } from '~/stores/style'
import { fixtureDefaults } from '../fixtures/banner-fixtures'

type PreviewFetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>

let previewFetch: Mock<PreviewFetch>
let previewId = 0

function okResponse(): Response {
  return {
    ok: true,
    status: 200,
    blob: async () => new Blob(['preview']),
  } as Response
}

async function preparePreview() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const defaults = useDefaultStore()
  await defaults.initializeBuilder('resource')
  defaults.id = `preview-test-${++previewId}`
  defaults.markSelectedSource()
  const style = useStyleStore()
  const wrapper = await mountSuspended(GeneratorPreview, {
    global: { plugins: [pinia] },
  })
  return { defaults, style, wrapper }
}

describe('GeneratorPreview', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    let blobId = 0
    vi.stubGlobal(
      'URL',
      Object.assign(class extends URL {}, {
        createObjectURL: vi.fn(() => `blob:preview-${++blobId}`),
        revokeObjectURL: vi.fn(),
      }),
    )
    previewFetch = vi.fn<PreviewFetch>(async () => okResponse())
    vi.stubGlobal('fetch', (input: RequestInfo | URL, init?: RequestInit) => {
      if (String(input).includes('/banner/svc/defaults/all')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => fixtureDefaults,
        } as Response)
      }
      return previewFetch(input, init)
    })
    vi.stubGlobal(
      '$fetch',
      vi.fn(async () => fixtureDefaults),
    )
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('aborts an obsolete request and does not display its late response', async () => {
    const pending: Array<{
      signal: AbortSignal | null
      resolve: (response: Response) => void
    }> = []
    previewFetch = vi.fn<PreviewFetch>((_url, init) => {
      return new Promise<Response>((resolve) => {
        pending.push({
          signal: init?.signal as AbortSignal | null,
          resolve,
        })
      })
    })
    const { style, wrapper } = await preparePreview()

    style.setTextPrimaryColor('#112233')
    await vi.advanceTimersByTimeAsync(250)
    expect(pending).toHaveLength(1)

    style.setTextPrimaryColor('#445566')
    await nextTick()
    expect(pending[0]?.signal?.aborted).toBe(true)
    await vi.advanceTimersByTimeAsync(250)
    expect(pending).toHaveLength(2)

    pending[0]?.resolve(okResponse())
    pending[1]?.resolve(okResponse())
    await flushPromises()

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1)
    expect(wrapper.find('img').attributes('src')).toMatch(/^blob:preview-/)
    wrapper.unmount()
  })

  it('debounces rapid changes and requests only the latest preview URL', async () => {
    const { style, wrapper } = await preparePreview()

    style.setTextPrimaryColor('#112233')
    await nextTick()
    await vi.advanceTimersByTimeAsync(100)
    style.setTextPrimaryColor('#445566')
    await nextTick()
    await vi.advanceTimersByTimeAsync(249)
    expect(previewFetch).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    await flushPromises()

    expect(previewFetch).toHaveBeenCalledTimes(1)
    expect(String(previewFetch.mock.calls[0]?.[0])).toContain(
      'text__primary_color=445566',
    )
    wrapper.unmount()
  })

  it('reuses a cached preview after returning to a previous style', async () => {
    const { style, wrapper } = await preparePreview()

    style.setTextPrimaryColor('#112233')
    await vi.advanceTimersByTimeAsync(250)
    await flushPromises()
    const requestCount = previewFetch.mock.calls.length

    style.setTextPrimaryColor('#445566')
    await vi.advanceTimersByTimeAsync(250)
    await flushPromises()
    style.setTextPrimaryColor('#112233')
    await vi.advanceTimersByTimeAsync(250)

    expect(requestCount).toBe(1)
    expect(previewFetch).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })

  it('shows the existing error state without retrying a failed URL as an image', async () => {
    previewFetch = vi.fn<PreviewFetch>(async () => {
      throw new Error('offline')
    })
    const { style, wrapper } = await preparePreview()

    style.setTextPrimaryColor('#112233')
    await vi.advanceTimersByTimeAsync(250)
    await flushPromises()

    expect(wrapper.text()).toContain('Preview unavailable')
    expect(
      wrapper
        .find('[role="img"]')
        .element.parentElement?.classList.contains('sr-only'),
    ).toBe(false)
    expect(wrapper.find('img').exists()).toBe(false)
    expect(previewFetch).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('aborts its active preview when unmounted', async () => {
    const signal: { value: AbortSignal | null } = { value: null }
    previewFetch = vi.fn<PreviewFetch>((_url, init) => {
      signal.value = init?.signal as AbortSignal | null
      return new Promise<Response>(() => {})
    })
    const { style, wrapper } = await preparePreview()

    style.setTextPrimaryColor('#112233')
    await vi.advanceTimersByTimeAsync(250)
    wrapper.unmount()

    expect(signal.value?.aborted).toBe(true)
  })

  it('reuses an in-flight request when preview flush is requested for the same URL', async () => {
    previewFetch = vi.fn<PreviewFetch>(() => new Promise<Response>(() => {}))
    const { style, wrapper } = await preparePreview()

    style.setTextPrimaryColor('#112233')
    await vi.advanceTimersByTimeAsync(250)
    style.flushPreview()
    await flushPromises()

    expect(previewFetch).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('does not duplicate a preset preview when its URL and flush watchers run together', async () => {
    const { style, wrapper } = await preparePreview()

    style.applyThemePreset(THEME_PRESETS[1]!)
    await flushPromises()
    await vi.advanceTimersByTimeAsync(250)

    expect(previewFetch).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('evicts old blob URLs and revokes the remaining cache on unmount', async () => {
    const { style, wrapper } = await preparePreview()
    const createObjectURL = vi.mocked(URL.createObjectURL)
    const revokeObjectURL = vi.mocked(URL.revokeObjectURL)

    for (let color = 1; color <= 21; color++) {
      style.setTextPrimaryColor(`#${color.toString(16).padStart(6, '0')}`)
      await vi.advanceTimersByTimeAsync(250)
      await flushPromises()
    }

    expect(createObjectURL).toHaveBeenCalledTimes(21)
    expect(revokeObjectURL).toHaveBeenCalledTimes(1)
    wrapper.unmount()
    expect(revokeObjectURL).toHaveBeenCalledTimes(21)
  })
})
