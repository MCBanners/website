<script setup lang="ts">
import { storeToRefs } from 'pinia'
import GeneratorPreview from '~/components/generator/GeneratorPreview.vue'
import { useDefaultStore } from '~/stores/defaults'
import { useStyleStore } from '~/stores/style'

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
const style = useStyleStore()
const { outputFormat } = storeToRefs(style)

const toast = useToast()
const copiedKey = ref('')
type EmbedFormat = 'markdown' | 'bbcode' | 'html'

const selectedFormat = ref<EmbedFormat>('markdown')

const formatItems: Array<{ label: string, value: EmbedFormat }> = [
  { label: 'Markdown', value: 'markdown' },
  { label: 'BBCode', value: 'bbcode' },
  { label: 'HTML', value: 'html' }
]

const embedCode = computed(() => {
  if (!props.savedUrl) return ''
  if (selectedFormat.value === 'bbcode') return `[img]${props.savedUrl}[/img]`
  if (selectedFormat.value === 'html') return `<img src='${props.savedUrl}' alt='Banner' />`
  return `![Banner](${props.savedUrl})`
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
  await copyText(props.savedUrl, 'saved-url', 'Saved banner URL copied to your clipboard.')
}

async function copyEmbedCode () {
  await copyText(embedCode.value, `embed-${selectedFormat.value}`, `${formatItems.find(item => item.value === selectedFormat.value)?.label} snippet copied to your clipboard.`)
}
</script>

<script lang="ts">
export default {
  name: 'BuilderPreviewPanel'
}
</script>

<template>
  <UCard
    class="h-full bg-elevated/55"
    :ui="{ body: 'space-y-4', header: 'pb-3' }"
  >
    <template #header>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 class="text-base font-semibold text-highlighted">
            Preview
          </h3>
          <p class="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <UIcon name="i-lucide-circle-dot" class="size-3.5" />
            Live preview updates automatically.
          </p>
        </div>
        <UButton
          type="button"
          size="sm"
          variant="outline"
          color="neutral"
          :icon="copiedKey === 'preview' ? 'i-lucide-check' : 'i-lucide-link'"
          @click="copyPreviewUrl"
        >
          Copy Preview URL
        </UButton>
      </div>
    </template>

    <div class="rounded-xl border border-muted bg-default/55 p-3 shadow-inner">
      <div class="mx-auto w-fit rounded-xl bg-elevated/70 p-2 ring-1 ring-white/10">
        <GeneratorPreview label="Banner preview" />
      </div>
    </div>

    <div class="flex flex-wrap justify-center gap-2">
      <UBadge color="neutral" variant="soft" icon="i-lucide-scan">
        300 x 100
      </UBadge>
      <UBadge color="neutral" variant="soft" icon="i-lucide-image">
        {{ outputFormat.toUpperCase() }}
      </UBadge>
    </div>

    <USeparator />

    <section class="space-y-4">
      <div>
        <h3 class="text-base font-semibold text-highlighted">
          Save Your Banner
        </h3>
        <p class="mt-1 text-sm text-muted">
          Saved banners are permanent, live-updating, and accountless.
        </p>
      </div>

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
    </section>
  </UCard>
</template>
