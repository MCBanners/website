<script setup lang="ts">
import { useDefaultStore } from '~/stores/defaults'
import { useStyleStore } from '~/stores/style'
import { acquireBannerPreview } from '~/utils/banner-preview-request'

const MAX_CACHE_SIZE = 20
const PREVIEW_DEBOUNCE_MS = 250

defineProps({
  label: String,
  description: String,
})

const defaults = useDefaultStore()
const styleStore = useStyleStore()
// Keep cached object URLs local to the component that owns and revokes them.
const previewCache = new Map<string, string>()

const immediateUrl = computed(() => defaults.generateBannerUrl())
const displayUrl = ref(immediateUrl.value)
const displayGeneration = ref(0)
const isLoading = ref(false)
const hasLoaded = ref(false)
const hasError = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | null = null
let activePreview: { url: string; release: () => void } | null = null
let generation = 0
let isUnmounted = false

function cancelActivePreview() {
  activePreview?.release()
  activePreview = null
}

function revokeAndClearCache() {
  for (const blobUrl of previewCache.values()) URL.revokeObjectURL(blobUrl)
  previewCache.clear()
}

/** Fetch the API URL, cache it as a blob URL, and commit only the latest result. */
async function fetchAndCommit(apiUrl: string, requestGeneration: number) {
  const request = acquireBannerPreview(apiUrl)
  const active = { url: apiUrl, release: request.release }
  activePreview = active

  try {
    const blob = await request.promise
    if (isUnmounted || requestGeneration !== generation) return

    const blobUrl = URL.createObjectURL(blob)
    previewCache.set(apiUrl, blobUrl)
    displayUrl.value = blobUrl
    displayGeneration.value = requestGeneration
    hasError.value = false

    if (previewCache.size > MAX_CACHE_SIZE) {
      const oldest = previewCache.keys().next().value
      if (oldest !== undefined) {
        const oldestBlobUrl = previewCache.get(oldest)
        previewCache.delete(oldest)
        if (oldestBlobUrl) {
          await nextTick()
          URL.revokeObjectURL(oldestBlobUrl)
        }
      }
    }
  } catch {
    if (!isUnmounted && requestGeneration === generation) {
      // Do not assign the API URL to <img>; that would retry the failed request.
      hasLoaded.value = true
      hasError.value = true
    }
  } finally {
    request.release()
    if (activePreview === active) activePreview = null
    if (!isUnmounted && requestGeneration === generation) {
      isLoading.value = false
    }
  }
}

/** Returns true and commits immediately if apiUrl is already cached. */
function tryCommitCached(apiUrl: string, requestGeneration: number): boolean {
  const cached = previewCache.get(apiUrl)
  if (cached !== undefined) {
    hasError.value = false
    isLoading.value = false
    previewCache.delete(apiUrl)
    previewCache.set(apiUrl, cached)
    displayUrl.value = cached
    displayGeneration.value = requestGeneration
    return true
  }
  return false
}

// Abort obsolete work immediately; debounce only the start of the next request.
watch(immediateUrl, (newUrl) => {
  const requestGeneration = ++generation
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  cancelActivePreview()
  hasError.value = false
  if (tryCommitCached(newUrl, requestGeneration)) return
  isLoading.value = true
  debounceTimer = setTimeout(() => {
    debounceTimer = null
    void fetchAndCommit(newUrl, requestGeneration)
  }, PREVIEW_DEBOUNCE_MS)
})

// Immediately flush the preview when signalled (Enter, blur, or preset click)
watch(
  () => styleStore.previewFlushTick,
  () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
    const url = immediateUrl.value
    if (activePreview?.url === url) return
    const requestGeneration = ++generation
    cancelActivePreview()
    hasError.value = false
    if (tryCommitCached(url, requestGeneration)) return
    isLoading.value = true
    void fetchAndCommit(url, requestGeneration)
  },
)

// Reset All historically invalidates every locally owned preview URL.
watch(
  () => styleStore.cacheResetTick,
  () => revokeAndClearCache(),
)

// Revoke owned URLs and cancel pending work when the preview leaves the page.
onUnmounted(() => {
  isUnmounted = true
  generation++
  if (debounceTimer) clearTimeout(debounceTimer)
  cancelActivePreview()
  revokeAndClearCache()
})

function isCurrentImageEvent(event: Event): boolean {
  const image = event.currentTarget as HTMLImageElement | null
  const imageGeneration = Number(image?.dataset.previewGeneration)
  return (
    imageGeneration === generation &&
    imageGeneration === displayGeneration.value
  )
}

function onImageLoad(event: Event) {
  if (!isCurrentImageEvent(event)) return
  hasLoaded.value = true
  hasError.value = false
  isLoading.value = false
}

function onImageError(event: Event) {
  if (!isCurrentImageEvent(event)) return
  hasLoaded.value = true
  hasError.value = true
  isLoading.value = false
}
</script>

<template>
  <div class="w-full">
    <div class="relative flex items-center justify-center">
      <USkeleton
        v-if="!hasLoaded"
        class="aspect-[3/1] w-full max-w-[600px] rounded-xl bg-elevated"
      />
      <div
        :class="
          hasLoaded
            ? 'mx-auto w-full max-w-[600px] rounded-xl ring-1 ring-white/10 shadow-xl'
            : 'sr-only'
        "
      >
        <Transition name="fade">
          <div
            v-if="isLoading"
            class="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/25"
            aria-label="Loading preview"
          >
            <UIcon
              name="i-heroicons-arrow-path"
              class="size-6 animate-spin text-white"
            />
          </div>
        </Transition>
        <img
          v-if="!hasError"
          :key="displayGeneration"
          :data-preview-generation="displayGeneration"
          :alt="label"
          :src="displayUrl"
          width="300"
          height="100"
          class="w-full rounded-xl"
          @load="onImageLoad"
          @error="onImageError"
        />
        <div
          v-else
          class="flex aspect-[3/1] w-full max-w-[600px] items-center justify-center rounded-xl bg-elevated text-xs text-muted"
          role="img"
          :aria-label="`${label || 'Banner preview'} unavailable`"
        >
          Preview unavailable
        </div>
      </div>
    </div>
  </div>
</template>
