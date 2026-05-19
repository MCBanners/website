<script setup lang="ts">
import { useDefaultStore } from '~/stores/defaults'

const props = defineProps<{
  savedUrl: string
  resultUrl: string
  saveButtonTestId: string
  isSaving: boolean
  hasErrors: boolean
}>()

const emit = defineEmits<{
  (e: 'save'): void
}>()

const defaults = useDefaultStore()
const toast = useToast()
const copiedKey = ref('')
type EmbedFormat = 'markdown' | 'bbcode' | 'html'

const selectedFormat = ref<EmbedFormat>('markdown')

const formatItems: Array<{ label: string, value: EmbedFormat }> = [
  { label: 'Markdown', value: 'markdown' },
  { label: 'BBCode', value: 'bbcode' },
  { label: 'HTML', value: 'html' }
]

const displayUrl = computed(() => props.savedUrl)

const embedCode = computed(() => {
  if (!displayUrl.value) return ''
  if (selectedFormat.value === 'bbcode') return `[img]${displayUrl.value}[/img]`
  if (selectedFormat.value === 'html') return `<img src='${displayUrl.value}' alt='Banner' />`
  return `![Banner](${displayUrl.value})`
})

function markCopied (key: string) {
  copiedKey.value = key
  setTimeout(() => { copiedKey.value = '' }, 2000)
}

async function copyText (text: string, key: string, description: string) {
  if (!text) return
  await navigator.clipboard.writeText(text)
  markCopied(key)
  toast.add({
    id: `copied-${key}`,
    title: 'Copied!',
    description,
    duration: 3000
  })
}

async function copyPreviewUrl () {
  await copyText(defaults.generateBannerUrl(), 'preview', 'Preview URL copied to your clipboard.')
}

async function copySavedUrl () {
  await copyText(displayUrl.value, 'saved-url', 'Saved banner URL copied to your clipboard.')
}

async function copyEmbedCode () {
  await copyText(embedCode.value, `embed-${selectedFormat.value}`, `${formatItems.find(item => item.value === selectedFormat.value)?.label} snippet copied to your clipboard.`)
}
</script>

<script lang="ts">
export default {
  name: 'SaveOutputPanel'
}
</script>

<template>
  <UCard
    class="bg-elevated/55"
    :ui="{ body: 'space-y-4', header: 'pb-3' }"
  >
    <template #header>
      <div>
        <h3 class="text-base font-semibold text-highlighted">
          Save Your Banner
        </h3>
        <p class="mt-1 text-sm text-muted">
          Saved banners are permanent, live-updating, and accountless.
        </p>
      </div>
    </template>

    <div class="grid gap-3 sm:grid-cols-2">
      <UButton
        type="button"
        block
        size="lg"
        icon="i-lucide-save"
        :loading="isSaving"
        :disabled="hasErrors"
        :data-testid="saveButtonTestId"
        @click="emit('save')"
      >
        Save Banner
      </UButton>
      <UButton
        type="button"
        block
        size="lg"
        variant="outline"
        color="neutral"
        :icon="copiedKey === 'preview' ? 'i-lucide-check' : 'i-lucide-link'"
        @click="copyPreviewUrl"
      >
        Copy Preview URL
      </UButton>
    </div>

    <template v-if="savedUrl">
      <USeparator />

      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <p class="text-sm font-semibold text-highlighted">
            Your Saved Banner
          </p>
          <UBadge color="neutral" variant="soft">
            Permanent URL
          </UBadge>
        </div>
        <div class="flex gap-2">
          <UInput
            :model-value="savedUrl"
            readonly
            class="min-w-0 flex-1 font-mono text-xs"
          />
          <UButton
            type="button"
            variant="outline"
            color="neutral"
            :icon="copiedKey === 'saved-url' ? 'i-lucide-check' : 'i-lucide-copy'"
            @click="copySavedUrl"
          >
            Copy
          </UButton>
        </div>
        <p class="text-xs text-muted">
          Use this URL in forums, websites, Discord, and more.
        </p>
      </div>

      <USeparator />

      <div class="space-y-3">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm font-semibold text-highlighted">
            Embed Code
          </p>
          <div class="inline-flex rounded-md shadow-sm">
            <UButton
              v-for="item in formatItems"
              :key="item.value"
              type="button"
              size="xs"
              class="first:rounded-r-none last:rounded-l-none [&:not(:first-child):not(:last-child)]:rounded-none"
              :variant="selectedFormat === item.value ? 'solid' : 'outline'"
              :color="selectedFormat === item.value ? 'primary' : 'neutral'"
              @click="selectedFormat = item.value"
            >
              {{ item.label }}
            </UButton>
          </div>
        </div>
        <div class="flex gap-2">
          <UInput
            :model-value="embedCode"
            readonly
            class="min-w-0 flex-1 font-mono text-xs"
          />
          <UButton
            type="button"
            variant="outline"
            color="neutral"
            :icon="copiedKey === `embed-${selectedFormat}` ? 'i-lucide-check' : 'i-lucide-copy'"
            @click="copyEmbedCode"
          >
            Copy
          </UButton>
        </div>
      </div>
    </template>
  </UCard>
</template>
