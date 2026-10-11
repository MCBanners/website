type PendingPreview = {
  controller: AbortController
  promise: Promise<Blob>
  consumers: number
}

const pendingPreviews = new Map<string, PendingPreview>()

export function acquireBannerPreview(apiUrl: string) {
  let request = pendingPreviews.get(apiUrl)

  if (!request || request.controller.signal.aborted) {
    const controller = new AbortController()
    const created = {} as PendingPreview
    created.controller = controller
    created.consumers = 0
    created.promise = fetch(apiUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.blob()
      })
      .finally(() => {
        if (pendingPreviews.get(apiUrl) === created) {
          pendingPreviews.delete(apiUrl)
        }
      })
    request = created
    pendingPreviews.set(apiUrl, request)
  }

  request.consumers++
  let released = false

  return {
    promise: request.promise,
    release() {
      if (released) return
      released = true
      request!.consumers--
      if (request!.consumers === 0) request!.controller.abort()
    },
  }
}
