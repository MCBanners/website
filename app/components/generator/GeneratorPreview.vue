<script setup lang="ts">
import { useDefaultStore } from '~/stores/defaults'
import { useStyleStore } from '~/stores/style'

// Maximum number of entries to keep in the session preview cache
const MAX_CACHE_SIZE = 100

// Session-level cache: API URL → blob: URL
// Using a plain Map (not reactive) — we only need reactivity on displayUrl/isLoading
const previewCache = new Map<string, string>()

function revokeAndClear() {
  for (const blobUrl of previewCache.values()) URL.revokeObjectURL(blobUrl)
  previewCache.clear()
}

defineProps({
  label: String,
  description: String,
})

const defaults = useDefaultStore()
const styleStore = useStyleStore()

const immediateUrl = computed(() => defaults.generateBannerUrl())
const displayUrl = ref(immediateUrl.value)
const isLoading = ref(false)
const hasLoaded = ref(false)
const hasError = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

/** Fetch the API URL, cache it as a blob URL, and commit to displayUrl. */
async function fetchAndCommit(apiUrl: string) {
  try {
    const resp = await fetch(apiUrl)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const blob = await resp.blob()
    const blobUrl = URL.createObjectURL(blob)
    // Enforce size limit: evict the oldest entry when full
    if (previewCache.size >= MAX_CACHE_SIZE) {
      const oldest = previewCache.keys().next().value
      if (oldest !== undefined) {
        URL.revokeObjectURL(previewCache.get(oldest)!)
        previewCache.delete(oldest)
      }
    }
    previewCache.set(apiUrl, blobUrl)
    displayUrl.value = blobUrl
  } catch {
    // Fallback: show the raw API URL so the img element can handle the error state
    displayUrl.value = apiUrl
  } finally {
    isLoading.value = false
  }
}

/** Returns true and commits immediately if apiUrl is already cached. */
function tryCommitCached(apiUrl: string): boolean {
  const cached = previewCache.get(apiUrl)
  if (cached !== undefined) {
    hasError.value = false
    displayUrl.value = cached
    return true
  }
  return false
}

// Watch for style/settings changes; apply cache-first logic with 500ms debounce for misses
watch(immediateUrl, (newUrl) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  hasError.value = false
  if (tryCommitCached(newUrl)) return
  isLoading.value = true
  debounceTimer = setTimeout(() => fetchAndCommit(newUrl), 500)
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
    hasError.value = false
    if (tryCommitCached(url)) return
    isLoading.value = true
    fetchAndCommit(url)
  },
)

// Clear the session cache when Reset All is triggered
watch(() => styleStore.cacheResetTick, revokeAndClear)

// Revoke all blob URLs when the component is unmounted to avoid memory leaks
onUnmounted(revokeAndClear)

function onImageLoad() {
  hasLoaded.value = true
  hasError.value = false
  isLoading.value = false
}

function onImageError() {
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
