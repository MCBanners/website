<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ServerNameSection from '../sections/server/ServerNameSection.vue'
import ServerVersionSection from '../sections/server/ServerVersionSection.vue'
import ServerMotdSection from '../sections/server/ServerMotdSection.vue'
import ServerPlayerCountSection from '../sections/server/ServerPlayerCountSection.vue'
import { useDefaultStore } from '~/stores/defaults'
import BackgroundSection from '~/components/generator/sections/BackgroundSection.vue'
import LogoSection from '~/components/generator/sections/LogoSection.vue'
import ResourceNameSection from '~/components/generator/sections/ResourceNameSection.vue'
import AuthorNameSection from '~/components/generator/sections/AuthorNameSection.vue'
import ReviewCountSection from '~/components/generator/sections/ReviewCountSection.vue'
import StarSection from '~/components/generator/sections/StarSection.vue'
import DownloadCountSection from '~/components/generator/sections/DownloadCountSection.vue'
import UpdatedTimeSection from '~/components/generator/sections/UpdatedTimeSection.vue'
import PriceSection from '~/components/generator/sections/PriceSection.vue'
import ResourceCountSection from '~/components/generator/sections/ResourceCountSection.vue'
import LikeCountSection from '~/components/generator/sections/LikeCountSection.vue'

const defaults = useDefaultStore()

const { platform, type } = storeToRefs(defaults)

const configureItems = [
  {
    value: 'background',
    label: 'Background',
    description: 'Background Configuration'
  },
  {
    value: 'resourceLogo',
    label: 'Resource Logo',
    description: 'Logo Configuration'
  },
  {
    value: 'authorLogo',
    label: 'Author Logo',
    description: 'Logo Configuration'
  },
  {
    value: 'serverLogo',
    label: 'Server Logo',
    description: 'Logo Configuration'
  },
  {
    value: 'resourceCount',
    label: 'Resource Count',
    description: 'Resource Count Configuration'
  },
  {
    value: 'resourceName',
    label: 'Resource Name',
    description: 'Name Configuration'
  },
  {
    value: 'authorName',
    label: 'Author Name',
    description: 'Change the author name of your banner.'
  },
  {
    value: 'serverName',
    label: 'Server Name',
    description: 'Name Configuration'
  },
  {
    value: 'reviewCount',
    label: 'Review Count',
    description: 'Change the review count of your banner.'
  },
  {
    value: 'viewCount',
    label: 'View Count',
    description: 'View Count Configuration.'
  },
  {
    value: 'starredCount',
    label: 'Star Count',
    description: 'Change the star count of your banner.'
  },
  {
    value: 'likeCount',
    label: 'Like Count',
    description: 'Like Count Configuration.'
  },
  {
    value: 'followersCount',
    label: 'Follower Count',
    description: 'Change the follower count of your banner.'
  },
  {
    value: 'starsCount',
    label: 'Stars Count',
    description: 'Star Count Configuration.'
  },
  {
    value: 'lastUpdated',
    label: 'Updated Time',
    description: 'Change the last updated design of your banner.'
  },
  {
    value: 'stars',
    label: 'Stars',
    description: 'Change the stars of your banner.'
  },
  {
    value: 'downloadCount',
    label: 'Download Count',
    description: 'Change the download count of your banner.'
  },
  {
    value: 'price',
    label: 'Price',
    description: 'Change the price of your banner.'
  },
  {
    value: 'serverVersion',
    label: 'Server Version',
    description: 'Change the server version of your banner.'
  },
  {
    value: 'serverMotd',
    label: 'MOTD',
    description: 'Change the MOTD of your banner.'
  },
  {
    value: 'serverPlayerCount',
    label: 'Player Count',
    description: 'Change the player count of your banner.'
  }
]

const platformSectionConfig: Record<string, Record<string, string[]>> = {
  resource: {
    spigot: [
      'background',
      'resourceLogo',
      'resourceName',
      'authorName',
      'reviewCount',
      'stars',
      'downloadCount',
      'price'
    ],
    ore: [
      'background',
      'resourceLogo',
      'resourceName',
      'authorName',
      'reviewCount',
      'downloadCount'
    ],
    curseforge: [
      'background',
      'resourceLogo',
      'resourceName',
      'authorName',
      'lastUpdated',
      'downloadCount'
    ],
    modrinth: [
      'background',
      'resourceLogo',
      'resourceName',
      'authorName',
      'lastUpdated',
      'downloadCount'
    ],
    builtbybit: [
      'background',
      'resourceLogo',
      'resourceName',
      'authorName',
      'reviewCount',
      'stars',
      'downloadCount',
      'price'
    ],
    polymart: [
      'background',
      'resourceLogo',
      'resourceName',
      'authorName',
      'reviewCount',
      'stars',
      'downloadCount',
      'price'
    ],
    hangar: [
      'background',
      'resourceLogo',
      'resourceName',
      'authorName',
      'starredCount',
      'downloadCount'
    ]
  },
  author: {
    spigot: [
      'background',
      'authorLogo',
      'authorName',
      'resourceCount',
      'likeCount',
      'reviewCount',
      'downloadCount'
    ],
    ore: [
      'background',
      'authorLogo',
      'authorName',
      'resourceCount',
      'likeCount',
      'downloadCount'
    ],
    curseforge: [
      'background',
      'authorLogo',
      'authorName',
      'resourceCount',
      'downloadCount'
    ],
    modrinth: [
      'background',
      'authorLogo',
      'authorName',
      'resourceCount',
      'followersCount',
      'downloadCount'
    ],
    builtbybit: [
      'background',
      'authorLogo',
      'authorName',
      'resourceCount',
      'reviewCount',
      'downloadCount'
    ],
    polymart: [
      'background',
      'authorLogo',
      'authorName',
      'resourceCount',
      'reviewCount',
      'downloadCount'
    ],
    hangar: [
      'background',
      'authorLogo',
      'authorName',
      'resourceCount',
      'starsCount',
      'viewCount',
      'downloadCount'
    ]
  }
}

const serverSectionConfig = [
  'background',
  'serverLogo',
  'serverName',
  'serverVersion',
  'serverMotd',
  'serverPlayerCount'
]

const filteredItems = computed(() => {
  let sectionsToShow: string | string[] = []

  if (type.value === 'server') {
    sectionsToShow = serverSectionConfig
  } else {
    sectionsToShow = platformSectionConfig[type.value]?.[platform.value] || []
  }

  return configureItems.filter(item => sectionsToShow.includes(item.value))
})

const activeConfigureTab = ref('background')

watch(
  filteredItems,
  (items) => {
    const firstItem = items[0]

    if (!firstItem) {
      return
    }

    const activeItemStillVisible = items.some(item => item.value === activeConfigureTab.value)

    if (!activeItemStillVisible) {
      activeConfigureTab.value = firstItem.value
    }
  },
  { immediate: true }
)
</script>

<script lang="ts">
export default {
  name: 'ConfigureStep'
}
</script>


<template>
  <UTabs
    v-model="activeConfigureTab"
    :items="filteredItems"
    orientation="vertical"
    :unmount-on-hide="false"
    data-testid="configure-tabs"
    :ui="{
      root: 'flex flex-col gap-4 md:flex-row md:items-start',
      list: 'w-full md:w-48 shrink-0',
      content: 'min-w-0 flex-1'
    }"
  >
    <template #content="{ item }">
      <div
        class="flex min-w-0 flex-col"
        :data-testid="`configure-section-${item.value}`"
      >
        <GeneratorPreview />

        <BackgroundSection
          v-if="item.value === 'background'"
          :label="item.label"
          :description="item.description"
          class="space-y-3"
        />

        <LogoSection
          v-else-if="item.value === 'resourceLogo' || item.value === 'authorLogo' || item.value === 'serverLogo'"
          :label="item.label"
          :description="item.description"
          class="space-y-3"
        />

        <ResourceNameSection
          v-else-if="item.value === 'resourceName'"
          :label="item.label"
          :description="item.description"
          class="space-y-3"
        />

        <AuthorNameSection
          v-else-if="item.value === 'authorName'"
          :label="item.label"
          :description="item.description"
          class="space-y-3"
        />

        <ReviewCountSection
          v-else-if="item.value === 'reviewCount' || item.value === 'starredCount' || item.value === 'viewCount'"
          :label="item.label"
          :description="item.description"
          class="space-y-3"
        />

        <StarSection
          v-else-if="item.value === 'stars'"
          :label="item.label"
          :description="item.description"
          class="space-y-3"
        />

        <DownloadCountSection
          v-else-if="item.value === 'downloadCount'"
          :label="item.label"
          :description="item.description"
          class="space-y-3"
        />

        <UpdatedTimeSection
          v-else-if="item.value === 'lastUpdated'"
          :label="item.label"
          :description="item.description"
          class="space-y-3"
        />

        <PriceSection
          v-else-if="item.value === 'price'"
          :label="item.label"
          :description="item.description"
          class="space-y-3"
        />

        <ResourceCountSection
          v-else-if="item.value === 'resourceCount'"
          :label="item.label"
          :description="item.description"
          class="space-y-3"
        />

        <LikeCountSection
          v-else-if="item.value === 'likeCount' || item.value === 'followersCount' || item.value === 'starsCount'"
          :label="item.label"
          :description="item.description"
          class="space-y-3"
        />

        <ServerNameSection
          v-else-if="item.value === 'serverName'"
          :label="item.label"
          :description="item.description"
          class="space-y-3"
        />

        <ServerVersionSection
          v-else-if="item.value === 'serverVersion'"
          :label="item.label"
          :description="item.description"
          class="space-y-3"
        />

        <ServerMotdSection
          v-else-if="item.value === 'serverMotd'"
          :label="item.label"
          :description="item.description"
          class="space-y-3"
        />

        <ServerPlayerCountSection
          v-else-if="item.value === 'serverPlayerCount'"
          :label="item.label"
          :description="item.description"
          class="space-y-3"
        />
      </div>
    </template>
  </UTabs>
</template>
