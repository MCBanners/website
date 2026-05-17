<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ConfigureStep from '~/components/generator/steps/ConfigureStep.vue'
import { useDefaultStore } from '~/stores/defaults'

type ServerForm = {
  host: string
  port: number
}

const defaults = useDefaultStore()
const { host, port, type } = storeToRefs(defaults)
const apiBase = useMcbannersApiBase()

type.value = 'server'

const canConfigure = ref(false)
const activeTab = ref('details')

const items = computed(() => [
  {
    value: 'details',
    label: 'Server Details',
    description: 'Enter the Server IP and Port that you want to generate a banner for.'
  },
  {
    value: 'configure',
    label: 'Configure Banner',
    disabled: !canConfigure.value,
    description: 'Configure the banner to your liking. You can change the background, server logo, server name, server version, MOTD, and player count of your banner.'
  }
])

const serverForm = reactive<ServerForm>({ host: '', port: 25565 })

const toast = useToast()
const isOpen = ref(false)
const mnemonic = ref('')

const computedResultUrl = computed(() => `${apiBase}/banner/saved/${mnemonic.value}.png`)
const bannerAlt = computed(() => `Banner for ${host.value}`)

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

async function save () {
  const saved = await defaults.save('MINECRAFT_SERVER')
  if (saved.mnemonic) {
    mnemonic.value = saved.mnemonic
    isOpen.value = true
  }
}

async function validateDetails () {
  const serverHost = serverForm.host.trim()
  const serverPort = Number(serverForm.port)

  if (!serverHost || !Number.isFinite(serverPort)) {
    resetToDetails()
    toast.add({
      id: 'fetch_failed',
      title: 'Error!',
      description: 'Enter a valid server host and port.',
      duration: 3000
    })
    return
  }

  const response = await fetch(useMcbannersApiUrl(`/banner/server/${encodeURIComponent(serverHost)}/${serverPort}/isValid`))
  const json = await response.json()

  if (json.valid) {
    host.value = serverHost
    port.value = serverPort
    canConfigure.value = true
    await nextTick()
    activeTab.value = 'configure'
  } else {
    resetToDetails()
    toast.add({
      id: 'fetch_failed',
      title: 'Error!',
      description: 'Failed to ping that server. Please make sure the IP and port are correct.',
      duration: 3000
    })
  }
}
</script>

<template>
  <div
    class="mx-auto mt-12 w-5/6 2xl:w-1/2"
    data-testid="server-builder-page"
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
              <UFormField label="Host" name="host">
                <UInput
                  v-model="serverForm.host"
                  name="host"
                  aria-label="Host"
                  class="w-full"
                  data-testid="server-host-input"
                />
              </UFormField>

              <UFormField label="Port" name="port">
                <UInput
                  v-model.number="serverForm.port"
                  name="port"
                  aria-label="Port"
                  type="number"
                  class="w-full"
                  data-testid="server-port-input"
                />
              </UFormField>
            </div>

            <template #footer>
              <UButton
                type="button"
                variant="outline"
                data-testid="server-fetch-button"
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
                data-testid="server-save-button"
                @click="save"
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
