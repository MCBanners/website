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

const { id, platform, template, type } = storeToRefs(defaults)

const resource = storeToRefs(defaults).resource
const author = storeToRefs(defaults).author
const server = storeToRefs(defaults).server

const using = computed(() => {
  if (type.value === 'resource') {
    return resource.value!
  } else if (type.value === 'author') {
    return author.value!
  } else {
    return server.value!
  }
})

const { logo } = using.value

const configureItems = [
  {
    key: 'background',
    label: 'Background',
    description: 'Background Configuration'
  },
  {
    key: 'resourceLogo',
    label: 'Resource Logo',
    description: 'Logo Configuration'
  },
  {
    key: 'authorLogo',
    label: 'Author Logo',
    description: 'Logo Configuration'
  },
  {
    key: 'serverLogo',
    label: 'Server Logo',
    description: 'Logo Configuration'
  },
  {
    key: 'resourceCount',
    label: 'Resource Count',
    description: 'Resource Count Configuration'
  },
  {
    key: 'resourceName',
    label: 'Resource Name',
    description: 'Name Configuration'
  },
  {
    key: 'authorName',
    label: 'Author Name',
    description: 'Change the author name of your banner.'
  },
  {
    key: 'serverName',
    label: 'Server Name',
    description: 'Name Configuration'
  },
  {
    key: 'reviewCount',
    label: 'Review Count',
    description: 'Change the review count of your banner.'
  },
  {
    key: 'viewCount',
    label: 'View Count',
    description: 'View Count Configuration.'
  },
  {
    key: 'starredCount',
    label: 'Star Count',
    description: 'Change the star count of your banner.'
  },
  {
    key: 'followersCount',
    label: 'Follower Count',
    description: 'Change the follower count of your banner.'
  },
  {
    key: 'starsCount',
    label: 'Stars Count',
    description: 'Star Count Configuration.'
  },
  {
    key: 'lastUpdated',
    label: 'Updated Time',
    description: 'Change the last updated design of your banner.'
  },
  {
    key: 'stars',
    label: 'Stars',
    description: 'Change the stars of your banner.'
  },
  {
    key: 'downloadCount',
    label: 'Download Count',
    description: 'Change the download count of your banner.'
  },
  {
    key: 'price',
    label: 'Price',
    description: 'Change the price of your banner.'
  },
  {
    key: 'serverVersion',
    label: 'Server Version',
    description: 'Change the server version of your banner.'
  },
  {
    key: 'serverMotd',
    label: 'MOTD',
    description: 'Change the MOTD of your banner.'
  },
  {
    key: 'serverPlayerCount',
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
      'likesCount',
      'reviewCount',
      'downloadCount'
    ],
    ore: [
      'background',
      'authorLogo',
      'authorName',
      'resourceCount',
      'likesCount',
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
    sectionsToShow = platformSectionConfig[type.value][platform.value] || []
  }

  return configureItems.filter(item => sectionsToShow.includes(item.key))
})
</script>

<script lang="ts">
export default {
  name: 'ConfigureStep'
}
</script>

<template>
  <UTabs
    :items="filteredItems"
    orientation="vertical"
    :ui="{
      wrapper: 'flex items-center gap-4',
      list: { width: 'w-48' },
    }"
  >
    <template #item="{ item }">
      <div class="flex flex-col">
        <GeneratorPreview />
        <div v-if="item.key === 'background'" class="space-y-3">
          <BackgroundSection
            :label="item.label"
            :description="item.description"
          />
        </div>
        <div v-if="item.key === 'resourceLogo' || item.key === 'authorLogo' || item.key === 'serverLogo'" class="space-y-3">
          <LogoSection :label="item.label" :description="item.description" />
        </div>
        <div v-if="item.key === 'resourceName'" class="space-y-3">
          <ResourceNameSection
            :label="item.label"
            :description="item.description"
          />
        </div>
        <div v-if="item.key === 'authorName'" class="space-y-3">
          <AuthorNameSection
            :label="item.label"
            :description="item.description"
          />
        </div>
        <div v-if="item.key === 'reviewCount' || item.key === 'starredCount' || item.key === 'viewCount'" class="space-y-3">
          <ReviewCountSection
            :label="item.label"
            :description="item.description"
          />
        </div>
        <div v-if="item.key === 'stars'" class="space-y-3">
          <StarSection :label="item.label" :description="item.description" />
        </div>
        <div v-if="item.key === 'downloadCount'" class="space-y-3">
          <DownloadCountSection
            :label="item.label"
            :description="item.description"
          />
        </div>
        <div v-if="item.key === 'lastUpdated'" class="space-y-3">
          <UpdatedTimeSection
            :label="item.label"
            :description="item.description"
          />
        </div>
        <div v-if="item.key === 'price'" class="space-y-3">
          <PriceSection :label="item.label" :description="item.description" />
        </div>
        <div v-if="item.key === 'resourceCount'" class="space-y-3">
          <ResourceCountSection :label="item.label" :description="item.description" />
        </div>
        <div v-if="item.key === 'followersCount' || item.key === 'starsCount'" class="space-y-3">
          <LikeCountSection :label="item.label" :description="item.description" />
        </div>
        <div v-if="item.key === 'serverName'" class="space-y-3">
          <ServerNameSection :label="item.label" :description="item.description" />
        </div>
        <div v-if="item.key === 'serverVersion'" class="space-y-3">
          <ServerVersionSection :label="item.label" :description="item.description" />
        </div>
        <div v-if="item.key === 'serverMotd'" class="space-y-3">
          <ServerMotdSection :label="item.label" :description="item.description" />
        </div>
        <div v-if="item.key === 'serverPlayerCount'" class="space-y-3">
          <ServerPlayerCountSection :label="item.label" :description="item.description" />
        </div>
      </div>
    </template>
  </UTabs>
</template>
