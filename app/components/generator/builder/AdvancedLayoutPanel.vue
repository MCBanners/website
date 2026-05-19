<script setup lang="ts">
import LogoControls from '~/components/generator/types/LogoControls.vue'
import ResourceNameControls from '~/components/generator/types/ResourceNameControls.vue'
import AuthorNameControls from '~/components/generator/types/AuthorNameControls.vue'
import ReviewCountControls from '~/components/generator/types/ReviewCountControls.vue'
import StarControls from '~/components/generator/types/StarControls.vue'
import DownloadCountControls from '~/components/generator/types/DownloadCountControls.vue'
import UpdatedTimeControls from '~/components/generator/types/UpdatedTimeControls.vue'
import PriceControls from '~/components/generator/types/PriceControls.vue'
import ResourceCountControls from '~/components/generator/types/ResourceCountControls.vue'
import LikeCountControls from '~/components/generator/types/LikeCountControls.vue'
import ServerNameControls from '~/components/generator/types/server/ServerNameControls.vue'
import ServerVersionControls from '~/components/generator/types/server/ServerVersionControls.vue'
import ServerMotdControls from '~/components/generator/types/server/ServerMotdControls.vue'
import ServerPlayerCountControls from '~/components/generator/types/server/ServerPlayerCountControls.vue'

type ConfigureItem = {
  value: string
  label: string
  description: string
}

const props = defineProps<{
  items: ConfigureItem[]
}>()

const activeItemValue = ref('')
const isExpanded = ref(false)

watch(
  () => props.items,
  (items) => {
    if (!items.length) {
      activeItemValue.value = ''
      return
    }

    if (!items.some(item => item.value === activeItemValue.value)) {
      activeItemValue.value = items[0]!.value
    }
  },
  { immediate: true }
)

const activeItem = computed(() => props.items.find(item => item.value === activeItemValue.value))

function tabLabel (item: ConfigureItem): string {
  const labels: Record<string, string> = {
    resourceLogo: 'Logo',
    authorLogo: 'Logo',
    serverLogo: 'Logo',
    resourceName: 'Resource',
    authorName: 'Author',
    serverName: 'Server',
    reviewCount: 'Reviews',
    starredCount: 'Stars',
    viewCount: 'Views',
    stars: 'Stars',
    downloadCount: 'Downloads',
    price: 'Price',
    resourceCount: 'Resources',
    likeCount: 'Likes',
    followersCount: 'Followers',
    starsCount: 'Stars',
    lastUpdated: 'Updated',
    serverVersion: 'Version',
    serverMotd: 'MOTD',
    serverPlayerCount: 'Players'
  }

  return labels[item.value] || item.label
}

const activeMicrocopy = computed(() => {
  const value = activeItem.value?.value

  if (!value) return ''
  if (value.includes('Logo')) return 'Position and size the logo.'
  if (value === 'stars') return 'Adjust star spacing and placement.'
  if (value.includes('Count') || value === 'price' || value === 'lastUpdated') return 'Tune stat placement and display text.'
  if (value.includes('Name') || value.includes('Motd') || value === 'serverVersion') return 'Fine-tune text placement and appearance.'
  return activeItem.value?.description || ''
})
</script>

<script lang="ts">
export default {
  name: 'AdvancedLayoutPanel'
}
</script>

<template>
  <UCard
    class="border-white/10 bg-elevated/20"
    data-testid="advanced-layout-panel"
    :ui="{ body: 'space-y-3 p-3 sm:p-4 pt-0', header: 'p-3 sm:p-4' }"
  >
    <template #header>
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="text-sm font-semibold text-highlighted">
            Advanced Layout
          </h3>
          <p class="mt-1 text-xs text-muted">
            Fine-tune typography, positioning, and field-level details.
          </p>
        </div>
        <UButton
          type="button"
          size="xs"
          variant="ghost"
          color="neutral"
          :icon="isExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
          :aria-expanded="isExpanded"
          aria-controls="advanced-layout-content"
          @click="isExpanded = !isExpanded"
        />
      </div>
    </template>

    <div
      v-if="isExpanded"
      id="advanced-layout-content"
      class="space-y-3"
    >
      <div
        class="flex overflow-x-auto"
        role="tablist"
        aria-label="Advanced layout sections"
        data-testid="configure-advanced-tabs"
      >
        <button
          v-for="item in items"
          :key="item.value"
          type="button"
          role="tab"
          :aria-selected="activeItemValue === item.value"
          :class="[
            'relative shrink-0 border-b-2 px-3 py-2 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
            activeItemValue === item.value
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-default'
          ]"
          @click="activeItemValue = item.value"
        >
          {{ tabLabel(item) }}
        </button>
      </div>

      <USeparator />

      <div
        v-if="activeItem"
        role="tabpanel"
        class="px-1"
        :data-testid="`configure-section-${activeItem.value}`"
      >
        <div class="mb-3 flex justify-end">
          <p class="text-xs text-muted">
            {{ activeMicrocopy }}
          </p>
        </div>

        <div class="advanced-control-surface overflow-x-auto">
          <LogoControls
            v-if="activeItem.value === 'resourceLogo' || activeItem.value === 'authorLogo' || activeItem.value === 'serverLogo'"
          />

          <ResourceNameControls
            v-else-if="activeItem.value === 'resourceName'"
          />

          <AuthorNameControls
            v-else-if="activeItem.value === 'authorName'"
          />

          <ReviewCountControls
            v-else-if="activeItem.value === 'reviewCount' || activeItem.value === 'starredCount' || activeItem.value === 'viewCount'"
          />

          <StarControls
            v-else-if="activeItem.value === 'stars'"
          />

          <DownloadCountControls
            v-else-if="activeItem.value === 'downloadCount'"
          />

          <UpdatedTimeControls
            v-else-if="activeItem.value === 'lastUpdated'"
          />

          <PriceControls
            v-else-if="activeItem.value === 'price'"
          />

          <ResourceCountControls
            v-else-if="activeItem.value === 'resourceCount'"
          />

          <LikeCountControls
            v-else-if="activeItem.value === 'likeCount' || activeItem.value === 'followersCount' || activeItem.value === 'starsCount'"
          />

          <ServerNameControls
            v-else-if="activeItem.value === 'serverName'"
          />

          <ServerVersionControls
            v-else-if="activeItem.value === 'serverVersion'"
          />

          <ServerMotdControls
            v-else-if="activeItem.value === 'serverMotd'"
          />

          <ServerPlayerCountControls
            v-else-if="activeItem.value === 'serverPlayerCount'"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>
