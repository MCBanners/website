<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDefaultStore } from '~/stores/defaults'
import ConfigureStep from '~/components/generator/steps/ConfigureStep.vue'

const defaults = useDefaultStore()

const { id, platform, type } = storeToRefs(defaults)

type.value = 'author'

const items = [
  {
    key: 'details',
    label: 'Author Details',
    disabled: false,
    description:
      'Enter the Author ID that you want to generate a banner for.'
  },
  {
    key: 'configure',
    label: 'Configure Banner',
    disabled: false,
    description:
      'Configure the banner to your liking. You can change the background, resource logo, resource name, author name, review count, stars, download count, and price of your banner.'
  }
]

const platforms = [
  {
    key: 'spigot',
    value: 'Spigot',
    type: 'SPIGOT_AUTHOR'
  },
  {
    key: 'hangar',
    value: 'Hangar',
    type: 'HANGAR_AUTHOR'
  },
  {
    key: 'ore',
    value: 'Sponge',
    type: 'SPONGE_AUTHOR'
  },
  {
    key: 'curseforge',
    value: 'CurseForge',
    type: 'CURSEFORGE_AUTHOR'
  },
  {
    key: 'modrinth',
    value: 'Modrinth',
    type: 'MODRINTH_AUTHOR'
  },
  {
    key: 'builtbybit',
    value: 'BuiltByBit',
    type: 'BUILTBYBIT_AUTHOR'
  },
  {
    key: 'polymart',
    value: 'Polymart',
    type: 'POLYMART_AUTHOR'
  }
]

const idForm = reactive({ id: '', platform: 'Spigot' })
const index = ref(0)

const toast = useToast()

const isOpen = ref(false)
const mnemonic = ref('')

function getPlatformKey (value: string): string | undefined {
  return platforms.find(platform => platform.value === value)?.key
}

function getPlatformType (value: string): string | undefined {
  return platforms.find(platform => platform.value === value)?.type
}

function copyToClipboard () {
  navigator.clipboard.writeText(computedResultUrl.value)
  toast.add({
    id: 'copied',
    title: 'Copied!',
    description: 'The URL has been copied to your clipboard.',
    timeout: 3000
  })
}

async function save (type: string) {
  const saved = await defaults.save(type)
  if (saved.mnemonic) {
    mnemonic.value = saved.mnemonic
    isOpen.value = true
  }
}

const computedResultUrl: ComputedRef<string> = computed(() => {
  return `https://api.mcbanners.com/banner/saved/${mnemonic.value}.png`
})

async function onSubmit (form: any) {
  const bannerId = form.id
  const platformName = getPlatformKey(form.platform)
  const data = await fetch(
    `https://api.mcbanners.com/banner/author/${platformName}/${bannerId}/isValid`
  )
  const json = await data.json()
  if (json.valid) {
    id.value = bannerId
    platform.value = platformName!
    items[1].disabled = false
    index.value = 1
    items[0].disabled = true
  } else {
    index.value = 0
    toast.add({
      id: 'fetch_failed',
      title: 'Error!',
      description:
        'Failed to fetch author. Check that the author ID is correct.',
      timeout: 3000
    })
  }
}
</script>
<template>
  <UTabs :items="items" class="w-5/6 2xl:w-1/2 mx-auto mt-12" :model-value="index">
    <template #item="{ item }">
      <UCard
        @submit.prevent="
          () => onSubmit(item.key === 'details' ? idForm : idForm)
        "
      >
        <template #header>
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ item.label }}
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ item.description }}
          </p>
        </template>
        <div v-if="item.key === 'details'" class="space-y-3">
          <UAlert
            icon="i-heroicons-command-line"
            description="While we refer to it as a author ID, it can also be a slug or name based on the platform."
            title="Heads Up"
            color="primary"
            variant="outline"
            class="mb-2"
          />
          <UFormGroup label="Platform" name="platform">
            <USelect
              v-model="idForm.platform"
              :options="platforms"
              option-attribute="value"
            />
          </UFormGroup>
          <UFormGroup label="Author ID" name="id">
            <UInput v-model="idForm.id" />
          </UFormGroup>
        </div>
        <div v-else-if="item.key === 'configure'" class="space-y-3">
          <ConfigureStep />
        </div>
        <template #footer>
          <div v-if="item.key === 'details'">
            <UButton type="submit" variant="outline">
              Fetch
            </UButton>
          </div>
          <div v-else>
            <UButton
              type="submit"
              variant="outline"
              @click="() => save(getPlatformType(idForm.platform)!)"
            >
              Submit
            </UButton>
          </div>
          <UModal v-model="isOpen">
            <UCard
              :ui="{
                divide: 'divide-y divide-gray-100 dark:divide-gray-800',
              }"
            >
              <template #header>
                <h1 class="text-xl font-semibold">
                  Your banner was successfully saved!
                </h1>
              </template>
              <!-- Content -->
              <img
                :alt="`Banner for ${id.value}`"
                :src="computedResultUrl"
                width="300"
                height="100"
                class="rounded-lg mx-auto"
              >
              <UInput
                v-model="computedResultUrl"
                readonly
                class="mt-4 text-center"
              />
              <div class="flex justify-center mt-2">
                <UButton
                  variant="outline"
                  class="w-full"
                  @click="copyToClipboard"
                >
                  <p class="mx-auto">
                    Copy Banner URL
                  </p>
                </UButton>
              </div>
              <template #footer>
                <div class="flex flex-col space-y-4">
                  <UFormGroup label="Markdown" name="markdown">
                    <UInput
                      :model-value="`![Banner](${computedResultUrl})`"
                      readonly
                    />
                  </UFormGroup>
                  <UFormGroup label="BBCode" name="bbcode">
                    <UInput
                      :model-value="`[img]${computedResultUrl}[/img]`"
                      readonly
                    />
                  </UFormGroup>
                  <UFormGroup label="HTML" name="html">
                    <UInput
                      :model-value="`<img src='${computedResultUrl}' alt='Banner' />`"
                      readonly
                    />
                  </UFormGroup>
                </div>
              </template>
            </UCard>
          </UModal>
        </template>
      </UCard>
    </template>
  </UTabs>
</template>
