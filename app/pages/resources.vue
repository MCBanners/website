<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ConfigureStep from '~/components/generator/steps/ConfigureStep.vue'
import { useDefaultStore } from '~/stores/defaults'

type IdForm = {
  id: string
  platform: string
}

type PlatformOption = {
  label: string
  value: string
  bannerType: string
}

const defaults = useDefaultStore()
const { id, platform, type } = storeToRefs(defaults)
const apiBase = useMcbannersApiBase()

type.value = 'resource'

const canConfigure = ref(false)
const activeTab = ref('details')

const items = computed(() => [
  {
    value: 'details',
    label: 'Resource Details',
    description: 'Enter the Resource ID that you want to generate a banner for.'
  },
  {
    value: 'configure',
    label: 'Configure Banner',
    disabled: !canConfigure.value,
    description: 'Configure the banner to your liking. You can change the background, resource logo, resource name, author name, review count, stars, download count, and price of your banner.'
  }
])

const platforms: PlatformOption[] = [
  { label: 'Spigot', value: 'spigot', bannerType: 'SPIGOT_RESOURCE' },
  { label: 'Hangar', value: 'hangar', bannerType: 'HANGAR_RESOURCE' },
  { label: 'Sponge', value: 'ore', bannerType: 'SPONGE_RESOURCE' },
  { label: 'CurseForge', value: 'curseforge', bannerType: 'CURSEFORGE_RESOURCE' },
  { label: 'Modrinth', value: 'modrinth', bannerType: 'MODRINTH_RESOURCE' },
  { label: 'BuiltByBit', value: 'builtbybit', bannerType: 'BUILTBYBIT_RESOURCE' },
  { label: 'Polymart', value: 'polymart', bannerType: 'POLYMART_RESOURCE' }
]

const idForm = reactive<IdForm>({ id: '', platform: 'spigot' })

const toast = useToast()
const isOpen = ref(false)
const mnemonic = ref('')

const computedResultUrl = computed(() => `${apiBase}/banner/saved/${mnemonic.value}.png`)
const bannerAlt = computed(() => `Banner for ${id.value}`)

function getPlatformType (value: string): string | undefined {
  return platforms.find(platform => platform.value === value)?.bannerType
}

function resetToDetails () {
  canConfigure.value = false
  activeTab.value = 'details'
}

function copyToClipboard () {
  navigator.clipboard.writeText(computedResultUrl.value)
  toast.add({
    id: 'copied',
    title: 'Copied!',
    description: 'The URL has been copied to your clipboard.',
    duration: 3000
  })
}

async function save (type?: string) {
  if (!type) { return }

  const saved = await defaults.save(type)
  if (saved.mnemonic) {
    mnemonic.value = saved.mnemonic
    isOpen.value = true
  }
}

async function saveCurrent () {
  await save(getPlatformType(idForm.platform))
}

async function validateDetails () {
  const bannerId = idForm.id.trim()
  const platformName = idForm.platform

  if (!bannerId) {
    resetToDetails()
    toast.add({
      id: 'fetch_failed',
      title: 'Error!',
      description: 'Enter a resource ID before fetching.',
      duration: 3000
    })
    return
  }

  const response = await fetch(useMcbannersApiUrl(`/banner/resource/${platformName}/${encodeURIComponent(bannerId)}/isValid`))
  const json = await response.json()

  if (json.valid) {
    id.value = bannerId
    platform.value = platformName
    canConfigure.value = true
    await nextTick()
    activeTab.value = 'configure'
  } else {
    resetToDetails()
    toast.add({
      id: 'fetch_failed',
      title: 'Error!',
      description: 'Failed to fetch resource. Check that the resource ID is correct.',
      duration: 3000
    })
  }
}
</script>

<template>
  <div
    class="mx-auto mt-12 w-5/6 2xl:w-1/2"
    data-testid="resource-builder-page"
  >
    <UTabs
      v-model="activeTab"
      :items="items"
      class="w-full"
      :unmount-on-hide="false"
      :data-can-configure="String(canConfigure)"
    >
      <template #content="{ item }">
        <form
          v-if="item.value === 'details'"
          class="space-y-4"
          data-testid="details-step"
        >
          <UCard>
            <template #header>
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                {{ item.label }}
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ item.description }}
              </p>
            </template>

            <div class="space-y-4">
              <UAlert
                icon="i-heroicons-command-line"
                title="Heads Up"
                description="While we refer to it as a resource ID, it can also be a slug or project ID based on the platform."
                color="primary"
                variant="outline"
              />

              <UFormField label="Platform" name="platform">
                <USelect
                  v-model="idForm.platform"
                  name="platform"
                  :items="platforms"
                  class="w-full"
                  value-key="value"
                  label-key="label"
                  data-testid="platform-select"
                />
              </UFormField>

              <UFormField label="Resource ID" name="id">
                <UInput
                  v-model="idForm.id"
                  name="id"
                  aria-label="Resource ID"
                  class="w-full"
                  data-testid="resource-id-input"
                />
              </UFormField>
            </div>

            <template #footer>
              <UButton
                type="button"
                variant="outline"
                data-testid="resource-fetch-button"
                @click="validateDetails"
              >
                Fetch
              </UButton>
            </template>
          </UCard>
        </form>

        <form
          v-else-if="item.value === 'configure'"
          data-testid="configure-step"
        >
          <UCard>
            <template #header>
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                {{ item.label }}
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ item.description }}
              </p>
            </template>

            <ConfigureStep />

            <template #footer>
              <UButton
                type="button"
                variant="outline"
                data-testid="resource-save-button"
                @click="saveCurrent"
              >
                Submit
              </UButton>
            </template>
          </UCard>
        </form>
      </template>
    </UTabs>

    <UModal v-model:open="isOpen">
      <template #content>
        <UCard data-testid="save-result-modal">
          <template #header>
            <h1 class="text-xl font-semibold">
              Your banner was successfully saved!
            </h1>
          </template>

          <img
            :alt="bannerAlt"
            :src="computedResultUrl"
            width="300"
            height="100"
            class="mx-auto rounded-lg"
            data-testid="saved-banner-image"
          >

          <UInput
            :model-value="computedResultUrl"
            readonly
            class="mt-4 text-center"
            data-testid="saved-banner-url"
          />

          <div class="mt-2 flex justify-center">
            <UButton
              variant="outline"
              class="w-full"
              data-testid="copy-banner-url-button"
              @click="copyToClipboard"
            >
              <span class="mx-auto">Copy Banner URL</span>
            </UButton>
          </div>

          <template #footer>
            <div class="flex flex-col gap-4">
              <UFormField label="Markdown" name="markdown">
                <UInput
                  :model-value="`![Banner](${computedResultUrl})`"
                  readonly
                />
              </UFormField>
              <UFormField label="BBCode" name="bbcode">
                <UInput
                  :model-value="`[img]${computedResultUrl}[/img]`"
                  readonly
                />
              </UFormField>
              <UFormField label="HTML" name="html">
                <UInput
                  :model-value="`<img src='${computedResultUrl}' alt='Banner' />`"
                  readonly
                />
              </UFormField>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
