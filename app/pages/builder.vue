<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ConfigureStep from '~/components/generator/steps/ConfigureStep.vue'
import { useDefaultStore } from '~/stores/defaults'
import { useStyleStore } from '~/stores/style'
import {
  authorPlatformOptions,
  resourcePlatformOptions,
} from '~/utils/builder-entry'

const defaults = useDefaultStore()
const styleStore = useStyleStore()
const { type, platform, hasActiveBuilderSource } = storeToRefs(defaults)
const { hasErrors } = storeToRefs(styleStore)
const apiBase = useMcbannersApiBase()
const { getPlatformBannerType } = useBannerEntryFlow()

if (!hasActiveBuilderSource.value) {
  await navigateTo('/')
}

const mnemonic = ref('')
const savedUrl = ref('')
const isSaving = ref(false)

const computedResultUrl = computed(
  () => `${apiBase}/banner/saved/${mnemonic.value}.png`,
)

function resetToHome() {
  defaults.resetSelectedSource()
  return navigateTo('/')
}

async function saveCurrent() {
  let saveType: string | undefined

  if (type.value === 'server') {
    saveType = 'MINECRAFT_SERVER'
  } else if (type.value === 'resource') {
    saveType = getPlatformBannerType(
      'resource',
      platform.value,
      resourcePlatformOptions,
    )
  } else {
    saveType = getPlatformBannerType(
      'author',
      platform.value,
      authorPlatformOptions,
    )
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
      v-if="hasActiveBuilderSource"
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
  </main>
</template>
