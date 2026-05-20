<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDefaultStore } from '~/stores/defaults'
import BuilderShell from '~/components/generator/builder/BuilderShell.vue'
import BuilderPreviewPanel from '~/components/generator/builder/BuilderPreviewPanel.vue'
import DesignPanel from '~/components/generator/builder/DesignPanel.vue'
import AdvancedLayoutPanel from '~/components/generator/builder/AdvancedLayoutPanel.vue'

const props = defineProps<{
  savedUrl: string
  resultUrl: string
  saveButtonTestId: string
  isSaving: boolean
  hasErrors: boolean
}>()

const emit = defineEmits<{
  (e: 'save' | 'change-resource'): void
}>()

const defaults = useDefaultStore()
const { platform, type, serverGame } = storeToRefs(defaults)

const configureItems = [
  {
    value: 'background',
    label: 'Background',
    description: 'Background Configuration',
    group: 'Design'
  },
  {
    value: 'style',
    label: 'Style',
    description: 'Customize colors, shadows, and output format.',
    group: 'Design'
  },
  {
    value: 'resourceLogo',
    label: 'Resource Logo',
    description: 'Logo Configuration',
    group: 'Layout'
  },
  {
    value: 'authorLogo',
    label: 'Author Logo',
    description: 'Logo Configuration',
    group: 'Layout'
  },
  {
    value: 'serverLogo',
    label: 'Server Logo',
    description: 'Logo Configuration',
    group: 'Layout'
  },
  {
    value: 'resourceCount',
    label: 'Resource Count',
    description: 'Resource Count Configuration',
    group: 'Content'
  },
  {
    value: 'resourceName',
    label: 'Resource Name',
    description: 'Name Configuration',
    group: 'Content'
  },
  {
    value: 'authorName',
    label: 'Author Name',
    description: 'Change the author name of your banner.',
    group: 'Content'
  },
  {
    value: 'serverName',
    label: 'Server Name',
    description: 'Name Configuration',
    group: 'Content'
  },
  {
    value: 'reviewCount',
    label: 'Review Count',
    description: 'Change the review count of your banner.',
    group: 'Content'
  },
  {
    value: 'viewCount',
    label: 'View Count',
    description: 'View Count Configuration.',
    group: 'Content'
  },
  {
    value: 'starredCount',
    label: 'Star Count',
    description: 'Change the star count of your banner.',
    group: 'Content'
  },
  {
    value: 'likeCount',
    label: 'Like Count',
    description: 'Like Count Configuration.',
    group: 'Content'
  },
  {
    value: 'followersCount',
    label: 'Follower Count',
    description: 'Change the follower count of your banner.',
    group: 'Content'
  },
  {
    value: 'starsCount',
    label: 'Stars Count',
    description: 'Star Count Configuration.',
    group: 'Content'
  },
  {
    value: 'lastUpdated',
    label: 'Updated Time',
    description: 'Change the last updated design of your banner.',
    group: 'Content'
  },
  {
    value: 'stars',
    label: 'Stars',
    description: 'Change the stars of your banner.',
    group: 'Content'
  },
  {
    value: 'downloadCount',
    label: 'Download Count',
    description: 'Change the download count of your banner.',
    group: 'Content'
  },
  {
    value: 'price',
    label: 'Price',
    description: 'Change the price of your banner.',
    group: 'Content'
  },
  {
    value: 'serverVersion',
    label: 'Server Version',
    description: 'Change the server version of your banner.',
    group: 'Content'
  },
  {
    value: 'serverMotd',
    label: 'MOTD',
    description: 'Change the MOTD of your banner.',
    group: 'Content'
  },
  {
    value: 'serverPlayerCount',
    label: 'Player Count',
    description: 'Change the player count of your banner.',
    group: 'Content'
  }
]

const platformSectionConfig: Record<string, Record<string, string[]>> = {
  resource: {
    spigot: ['background', 'style', 'resourceLogo', 'resourceName', 'authorName', 'reviewCount', 'stars', 'downloadCount', 'price'],
    ore: ['background', 'style', 'resourceLogo', 'resourceName', 'authorName', 'reviewCount', 'downloadCount'],
    curseforge: ['background', 'style', 'resourceLogo', 'resourceName', 'authorName', 'lastUpdated', 'downloadCount'],
    modrinth: ['background', 'style', 'resourceLogo', 'resourceName', 'authorName', 'lastUpdated', 'downloadCount'],
    builtbybit: ['background', 'style', 'resourceLogo', 'resourceName', 'authorName', 'reviewCount', 'stars', 'downloadCount', 'price'],
    polymart: ['background', 'style', 'resourceLogo', 'resourceName', 'authorName', 'reviewCount', 'stars', 'downloadCount', 'price'],
    hangar: ['background', 'style', 'resourceLogo', 'resourceName', 'authorName', 'starredCount', 'downloadCount']
  },
  author: {
    spigot: ['background', 'style', 'authorLogo', 'authorName', 'resourceCount', 'likeCount', 'reviewCount', 'downloadCount'],
    ore: ['background', 'style', 'authorLogo', 'authorName', 'resourceCount', 'likeCount', 'downloadCount'],
    curseforge: ['background', 'style', 'authorLogo', 'authorName', 'resourceCount', 'downloadCount'],
    modrinth: ['background', 'style', 'authorLogo', 'authorName', 'resourceCount', 'followersCount', 'downloadCount'],
    builtbybit: ['background', 'style', 'authorLogo', 'authorName', 'resourceCount', 'reviewCount', 'downloadCount'],
    polymart: ['background', 'style', 'authorLogo', 'authorName', 'resourceCount', 'reviewCount', 'downloadCount'],
    hangar: ['background', 'style', 'authorLogo', 'authorName', 'resourceCount', 'starsCount', 'viewCount', 'downloadCount']
  }
}

const serverSectionConfig = ['background', 'style', 'serverLogo', 'serverName', 'serverVersion', 'serverMotd', 'serverPlayerCount']

const filteredItems = computed(() => {
  const sectionsToShow = type.value === 'server'
    ? serverSectionConfig
    : platformSectionConfig[type.value]?.[platform.value] || []

  return configureItems.filter(item => sectionsToShow.includes(item.value))
})

const advancedItems = computed(() => filteredItems.value.filter(item => item.group !== 'Design'))

const builderKindLabel = computed(() => {
  if (type.value === 'server') return serverGame.value === 'hytale' ? 'Hytale Server' : 'Minecraft Server'
  if (type.value === 'author') return 'Author'
  return 'Resource'
})

const changeButtonLabel = computed(() => {
  if (type.value === 'server') return 'Change Server'
  return `Change ${builderKindLabel.value}`
})

const title = computed(() => `Configure ${builderKindLabel.value} Banner`)
</script>

<script lang="ts">
export default {
  name: 'ConfigureStep'
}
</script>

<template>
  <div data-testid="configure-tabs">
    <div class="sr-only" data-testid="configure-section-background">
      Background Configuration
    </div>
    <div class="sr-only" data-testid="configure-section-style">
      Style
    </div>

    <BuilderShell
      :title="title"
    >
      <template #actions>
        <UButton
          type="button"
          variant="outline"
          icon="i-lucide-arrow-left"
          @click="emit('change-resource')"
        >
          {{ changeButtonLabel }}
        </UButton>
      </template>

      <template #left>
        <BuilderPreviewPanel
          :saved-url="props.savedUrl"
          :result-url="props.resultUrl"
          :save-button-test-id="props.saveButtonTestId"
          :is-saving="props.isSaving"
          :has-errors="props.hasErrors"
          @save="emit('save')"
        />
      </template>

      <template #design>
        <DesignPanel />
      </template>

      <template #advanced>
        <AdvancedLayoutPanel :items="advancedItems" />
      </template>
    </BuilderShell>
  </div>
</template>
