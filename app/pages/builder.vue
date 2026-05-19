<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ConfigureStep from '~/components/generator/steps/ConfigureStep.vue'
import { useDefaultStore } from '~/stores/defaults'
import { useStyleStore } from '~/stores/style'
import {
  authorPlatformOptions,
  resourcePlatformOptions
} from '~/utils/builder-entry'

const defaults = useDefaultStore()
const styleStore = useStyleStore()
const { type, platform, hasSelectedSource } = storeToRefs(defaults)
const { hasErrors } = storeToRefs(styleStore)
const apiBase = useMcbannersApiBase()
const { getPlatformBannerType } = useBannerEntryFlow()

const mnemonic = ref('')
const savedUrl = ref('')
const isSaving = ref(false)

const computedResultUrl = computed(() => `${apiBase}/banner/saved/${mnemonic.value}.png`)

function resetToHome () {
  defaults.resetSelectedSource()
  return navigateTo('/')
}

async function saveCurrent () {
  let saveType: string | undefined

  if (type.value === 'server') {
    saveType = 'MINECRAFT_SERVER'
  } else if (type.value === 'resource') {
    saveType = getPlatformBannerType('resource', platform.value, resourcePlatformOptions)
  } else {
    saveType = getPlatformBannerType('author', platform.value, authorPlatformOptions)
  }

  if (!saveType) {
    return
  }

  isSaving.value = true
  try {
    const saved = await defaults.save(saveType)
    if (saved.mnemonic) {
      mnemonic.value = saved.mnemonic
      savedUrl.value = computedResultUrl.value
    }
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <main class="bg-gray-950 text-white">
    <section
      v-if="hasSelectedSource"
      class="mx-auto w-full max-w-[1520px] px-4 py-5 sm:px-6 lg:px-8"
      data-testid="builder-route-state"
    >
      <ConfigureStep
        :saved-url="savedUrl"
        :result-url="computedResultUrl"
        save-button-test-id="builder-save-button"
        :is-saving="isSaving"
        :has-errors="hasErrors"
        @save="saveCurrent"
        @change-resource="resetToHome"
      />
    </section>

    <section
      v-else
      class="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-3xl items-center px-4 py-10 sm:px-6"
    >
      <UCard class="w-full border-white/10 bg-gray-950/95 text-center">
        <div class="mx-auto mb-5 flex size-14 items-center justify-center rounded-lg border border-lime-400/25 bg-lime-400/10 text-lime-300">
          <UIcon name="i-lucide-route" class="size-7" />
        </div>
        <h1 class="text-2xl font-bold text-white">
          No banner source selected.
        </h1>
        <p class="mx-auto mt-3 max-w-lg text-gray-400">
          Start from the homepage to choose a resource, author, or server before opening the builder.
        </p>
        <UButton
          to="/"
          size="lg"
          class="mt-6"
          icon="i-lucide-arrow-left"
          @click="defaults.resetSelectedSource()"
        >
          Start Building
        </UButton>
      </UCard>
    </section>
  </main>
</template>
