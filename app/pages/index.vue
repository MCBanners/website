<script setup lang="ts">
import { useDefaultStore } from '~/stores/defaults'
import type { BannerKind, PlatformOption, SourcePlaceholder } from '~/utils/builder-entry'
import {
  authorPlaceholders,
  authorPlatformOptions,
  extractResourceIdFromUrl,
  resourcePlaceholders,
  resourcePlatformOptions
} from '~/utils/builder-entry'

type HomeBuilderState = 'entry' | 'loading' | 'error'

type BannerTypeOption = {
  kind: BannerKind
  label: string
  icon: string
  description: string
}

type ValuePoint = {
  icon: string
  title: string
  description: string
}

type ExampleCard = {
  title: string
  description: string
  imageUrl: string
  alt: string
}

const {
  validateResource,
  validateAuthor,
  validateServer
} = useBannerEntryFlow()
const defaults = useDefaultStore()

defaults.resetSelectedSource()

const bannerTypes: BannerTypeOption[] = [
  {
    kind: 'resource',
    label: 'Resource Banner',
    icon: 'i-lucide-package',
    description: 'Showcase your plugin, mod, or resource stats.'
  },
  {
    kind: 'author',
    label: 'Author Banner',
    icon: 'i-lucide-user-round',
    description: 'Display creator stats and published work.'
  },
  {
    kind: 'server',
    label: 'Server Banner',
    icon: 'i-lucide-server',
    description: 'Show server status, players, and version.'
  }
]

const valuePoints: ValuePoint[] = [
  { icon: 'i-lucide-zap', title: 'Live data', description: 'Always up to date' },
  { icon: 'i-lucide-link', title: 'Share anywhere', description: 'Permanent URLs' },
  { icon: 'i-lucide-sliders-horizontal', title: 'Fully customizable', description: 'Fine-tune every detail' }
]

const exampleCards: ExampleCard[] = [
  {
    title: 'Resource Banner',
    description: 'Real generated resource example',
    imageUrl: 'https://api.mcbanners.com/banner/saved/IRQubpsghQdjqb.png',
    alt: 'Generated resource banner example'
  },
  {
    title: 'Author Banner',
    description: 'Real generated author example',
    imageUrl: 'https://api.mcbanners.com/banner/saved/gcNDoSInhxExGy.png',
    alt: 'Generated author banner example'
  },
  {
    title: 'Server Banner',
    description: 'Real generated server example',
    imageUrl: 'https://api.mcbanners.com/banner/saved/dYZnpqVrUMOggw.png',
    alt: 'Generated server banner example'
  }
]

const flowState = ref<HomeBuilderState>('entry')
const kind = ref<BannerKind>('resource')
const resourcePlatform = ref('spigot')
const authorPlatform = ref('spigot')
const resourceUrl = ref('')
const resourceId = ref('')
const authorId = ref('')
const serverHost = ref('')
const serverPort = ref('25565')
const validationMessage = ref('')

const selectedType = computed(() => bannerTypes.find(type => type.kind === kind.value)!)
const activePlatforms = computed<PlatformOption[]>(() => {
  if (kind.value === 'author') {
    return authorPlatformOptions
  }

  return resourcePlatformOptions
})
const activePlatform = computed({
  get: () => kind.value === 'author' ? authorPlatform.value : resourcePlatform.value,
  set: (value: string) => {
    if (kind.value === 'author') {
      authorPlatform.value = value
    } else {
      resourcePlatform.value = value
    }
  }
})
const sourceHeading = computed(() => {
  if (kind.value === 'resource') {
    return 'Add your resource'
  }
  if (kind.value === 'author') {
    return 'Add your author'
  }
  return 'Add your server'
})
const sourceDescription = computed(() => {
  if (kind.value === 'resource') {
    return 'Paste a resource URL or enter the resource ID.'
  }
  if (kind.value === 'author') {
    return 'Enter the author, user, or creator ID.'
  }
  return 'Enter a Minecraft server host and optional port.'
})
const loadingTitle = computed(() => {
  if (kind.value === 'resource') {
    return `Fetching resource from ${platformLabel(resourcePlatform.value)}...`
  }
  if (kind.value === 'author') {
    return `Fetching author from ${platformLabel(authorPlatform.value)}...`
  }
  return `Pinging ${serverHost.value.trim() || 'server'}...`
})
const fallbackResourcePlaceholder: SourcePlaceholder = {
  url: 'https://www.spigotmc.org/resources/placeholderapi.6245/',
  id: '6245',
  helper: 'Spigot resources usually use the numeric ID from the resource URL.'
}
const fallbackAuthorPlaceholder: SourcePlaceholder = {
  id: 'HelpChat',
  helper: 'Enter the Spigot author name or ID.'
}
const resourcePlaceholder = computed<SourcePlaceholder>(() => resourcePlaceholders[resourcePlatform.value] || fallbackResourcePlaceholder)
const authorPlaceholder = computed<SourcePlaceholder>(() => authorPlaceholders[authorPlatform.value] || fallbackAuthorPlaceholder)

function platformLabel (value: string): string {
  return activePlatforms.value.find(platformOption => platformOption.value === value)?.label || value
}

function chooseKind (nextKind: BannerKind) {
  kind.value = nextKind
  validationMessage.value = ''
  if (flowState.value === 'error') {
    flowState.value = 'entry'
  }
}

function choosePlatform (platform: string) {
  activePlatform.value = platform
  validationMessage.value = ''
}

function serverPortNumber (): number {
  const parsed = Number(serverPort.value.trim() || 25565)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

async function continueToBuilder () {
  validationMessage.value = ''

  if (kind.value === 'resource') {
    const bannerId = resourceId.value.trim() || extractResourceIdFromUrl(resourceUrl.value)

    if (!bannerId) {
      validationMessage.value = 'Enter a resource URL or resource ID.'
      flowState.value = 'error'
      return
    }

    await validateAndOpenBuilder(() => validateResource(resourcePlatform.value, bannerId))
    return
  }

  if (kind.value === 'author') {
    const bannerId = authorId.value.trim()

    if (!bannerId) {
      validationMessage.value = 'Enter an author or user ID.'
      flowState.value = 'error'
      return
    }

    await validateAndOpenBuilder(() => validateAuthor(authorPlatform.value, bannerId))
    return
  }

  const host = serverHost.value.trim()
  const port = serverPortNumber()

  if (!host || !Number.isFinite(port)) {
    validationMessage.value = 'Enter a valid server host and port.'
    flowState.value = 'error'
    return
  }

  await validateAndOpenBuilder(() => validateServer(host, port))
}

async function validateAndOpenBuilder (
  action: () => Promise<{ ok: boolean, message?: string }>
) {
  flowState.value = 'loading'

  try {
    const result = await action()

    if (result.ok) {
      await navigateTo('/builder')
      return
    }

    validationMessage.value = result.message || 'Could not validate that source. Check the details and try again.'
    flowState.value = 'error'
  } catch {
    validationMessage.value = 'Could not reach the banner API. Check the source details and try again.'
    flowState.value = 'error'
  }
}

</script>

<template>
  <main class="mcb-home-surface bg-gray-950 text-white" style="color-scheme: dark;">
    <section
      class="mx-auto flex w-full max-w-[1650px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-10"
    >
      <div class="grid gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(520px,1fr)] lg:items-end">
        <div class="space-y-4">
          <UBadge
            color="primary"
            variant="soft"
            class="w-fit border border-lime-400/20 bg-lime-400/10 uppercase tracking-wide text-lime-300"
          >
            <UIcon name="i-lucide-zap" class="mr-1 size-4" />
            Live data. Beautiful banners.
          </UBadge>

          <div class="space-y-3">
            <h1 class="max-w-[820px] text-4xl font-bold leading-tight tracking-normal text-white">
              Build beautiful <span class="text-lime-300">live-updating</span> banners in seconds
            </h1>
            <p class="max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
              Turn backend stats into polished banner images for forums, websites, and Minecraft communities.
            </p>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <div
            v-for="point in valuePoints"
            :key="point.title"
            class="flex items-center gap-3 rounded-lg border border-white/10 bg-gray-900/60 p-3"
          >
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg border border-lime-400/25 bg-lime-400/10 text-lime-300">
              <UIcon :name="point.icon" class="size-5" />
            </div>
            <div>
              <p class="font-semibold text-white">
                {{ point.title }}
              </p>
              <p class="text-sm text-gray-400">
                {{ point.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <UCard
        class="overflow-hidden border-lime-400/25 bg-gray-950/95 shadow-2xl shadow-black/30"
        :ui="{ body: 'p-0 sm:p-0' }"
      >
        <div class="border-b border-white/10 bg-gray-900/60 px-5 py-4 sm:px-6">
          <ol class="grid gap-3 sm:grid-cols-3">
            <li
              v-for="(step, index) in ['Start', 'Customize', 'Get URL']"
              :key="step"
              class="flex items-center gap-3"
            >
              <span
                class="flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold"
                :class="index === 0 ? 'border-lime-300 bg-lime-300 text-gray-950' : 'border-gray-700 text-gray-400'"
              >
                {{ index + 1 }}
              </span>
              <span>
                <span class="block font-semibold" :class="index === 0 ? 'text-white' : 'text-gray-400'">{{ step }}</span>
                <span class="block text-sm text-gray-500">
                  {{ index === 0 ? 'Choose your content' : index === 1 ? 'Design your banner' : 'Share anywhere' }}
                </span>
              </span>
            </li>
          </ol>
        </div>

        <div
          v-if="flowState === 'loading'"
          class="flex min-h-[430px] flex-col items-center justify-center gap-5 p-8 text-center"
        >
          <div class="flex size-16 items-center justify-center rounded-full border border-lime-300/30 bg-lime-300/10 text-lime-300">
            <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">
              {{ loadingTitle }}
            </h2>
            <p class="mt-2 text-gray-400">
              Preparing your banner builder...
            </p>
          </div>
        </div>

        <div
          v-else
          class="grid gap-8 p-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)] lg:p-7 xl:gap-10"
        >
          <div class="space-y-7">
            <div>
              <p class="text-sm font-semibold uppercase tracking-wide text-lime-300">
                Step 1
              </p>
              <h2 class="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Start your banner
              </h2>
              <p class="mt-2 max-w-3xl text-gray-400">
                Pick the banner type, select the supported source, and open the builder after validation.
              </p>
            </div>

            <div class="grid gap-3 lg:grid-cols-3">
              <button
                v-for="typeOption in bannerTypes"
                :key="typeOption.kind"
                type="button"
                class="flex min-h-28 items-start gap-4 rounded-lg border p-4 text-left transition hover:border-lime-300/60 hover:bg-white/[0.04]"
                :class="kind === typeOption.kind ? 'border-lime-300 bg-lime-300/10' : 'border-white/10 bg-gray-900/80'"
                @click="chooseKind(typeOption.kind)"
              >
                <span class="flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <UIcon :name="typeOption.icon" class="size-6 text-lime-300" />
                </span>
                <span>
                  <span class="block font-semibold text-white">{{ typeOption.label }}</span>
                  <span class="mt-1 block text-sm leading-5 text-gray-400">{{ typeOption.description }}</span>
                </span>
              </button>
            </div>

            <div v-if="kind !== 'server'" class="space-y-3">
              <div class="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p class="text-sm font-semibold text-white">
                    Select Platform
                  </p>
                  <p class="text-sm text-gray-500">
                    Only currently supported MCBanners sources are shown.
                  </p>
                </div>
              </div>
              <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                <button
                  v-for="platformOption in activePlatforms"
                  :key="platformOption.value"
                  type="button"
                  class="rounded-md border px-3 py-2 text-center text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300/45"
                  :class="activePlatform === platformOption.value
                    ? 'border-lime-400 bg-lime-400 text-gray-950 hover:bg-lime-300'
                    : 'border-white/15 bg-gray-900/80 text-gray-100 hover:border-lime-300/50 hover:bg-gray-800/90'"
                  @click="choosePlatform(platformOption.value)"
                >
                  {{ platformOption.label }}
                </button>
              </div>
            </div>
          </div>

          <div class="rounded-lg border border-white/10 bg-gray-900/70 p-5">
            <div class="space-y-5">
              <div>
                <h3 class="text-xl font-bold text-white">
                  {{ sourceHeading }}
                </h3>
                  <p class="mt-2 text-sm text-gray-400">
                    {{ sourceDescription }}
                  </p>
                  <p
                    v-if="kind === 'resource'"
                    class="mt-2 text-xs text-gray-500"
                  >
                    {{ resourcePlaceholder.helper }}
                  </p>
                  <p
                    v-else-if="kind === 'author'"
                    class="mt-2 text-xs text-gray-500"
                  >
                    {{ authorPlaceholder.helper }}
                  </p>
                </div>

              <div v-if="kind === 'resource'" class="space-y-4">
                <UFormField label="Resource URL" name="resource-url">
                  <div class="relative">
                    <UIcon name="i-lucide-link" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                    <input
                      v-model="resourceUrl"
                      name="resource-url"
                      :placeholder="resourcePlaceholder.url"
                      class="mcb-native-input w-full rounded-md border border-slate-700/90 bg-slate-950/80 py-2.5 pl-10 pr-3 text-sm text-slate-100 shadow-none outline-none placeholder:text-slate-500 focus:border-lime-300/65 focus:ring-1 focus:ring-lime-300/35"
                    >
                  </div>
                </UFormField>

                <div class="flex items-center gap-3 text-xs uppercase tracking-wide text-gray-500">
                  <USeparator class="flex-1" />
                  Or
                  <USeparator class="flex-1" />
                </div>

                <UFormField label="Resource ID" name="resource-id">
                  <div class="relative">
                    <UIcon name="i-lucide-hash" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                    <input
                      v-model="resourceId"
                      name="resource-id"
                      :placeholder="resourcePlaceholder.id"
                      class="mcb-native-input w-full rounded-md border border-slate-700/90 bg-slate-950/80 py-2.5 pl-10 pr-3 text-sm text-slate-100 shadow-none outline-none placeholder:text-slate-500 focus:border-lime-300/65 focus:ring-1 focus:ring-lime-300/35"
                    >
                  </div>
                </UFormField>
              </div>

              <div v-else-if="kind === 'author'" class="space-y-4">
                <UFormField label="Author or user ID" name="author-id">
                  <div class="relative">
                    <UIcon name="i-lucide-user-round" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                    <input
                      v-model="authorId"
                      name="author-id"
                      :placeholder="authorPlaceholder.id"
                      class="mcb-native-input w-full rounded-md border border-slate-700/90 bg-slate-950/80 py-2.5 pl-10 pr-3 text-sm text-slate-100 shadow-none outline-none placeholder:text-slate-500 focus:border-lime-300/65 focus:ring-1 focus:ring-lime-300/35"
                    >
                  </div>
                </UFormField>
              </div>

              <div v-else class="grid gap-4 sm:grid-cols-[1fr_140px]">
                <UFormField label="Server host" name="server-host">
                  <div class="relative">
                    <UIcon name="i-lucide-server" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                    <input
                      v-model="serverHost"
                      name="server-host"
                      placeholder="play.example.net"
                      class="mcb-native-input w-full rounded-md border border-slate-700/90 bg-slate-950/80 py-2.5 pl-10 pr-3 text-sm text-slate-100 shadow-none outline-none placeholder:text-slate-500 focus:border-lime-300/65 focus:ring-1 focus:ring-lime-300/35"
                    >
                  </div>
                </UFormField>

                <UFormField label="Port" name="server-port">
                  <input
                    v-model="serverPort"
                    name="server-port"
                    placeholder="25565"
                    type="number"
                    class="mcb-native-input w-full rounded-md border border-slate-700/90 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 shadow-none outline-none placeholder:text-slate-500 focus:border-lime-300/65 focus:ring-1 focus:ring-lime-300/35"
                  >
                </UFormField>
              </div>

              <UAlert
                v-if="validationMessage"
                color="error"
                variant="soft"
                icon="i-lucide-circle-alert"
                :description="validationMessage"
              />

              <button
                type="button"
                class="flex w-full items-center justify-center gap-2 rounded-md border border-lime-400 bg-lime-400 px-4 py-3 text-sm font-bold text-gray-950 transition hover:bg-lime-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300/60"
                @click="continueToBuilder"
              >
                <span>Continue to Builder</span>
                <UIcon name="i-lucide-arrow-right" class="size-5" />
              </button>

              <p class="text-xs leading-5 text-gray-500">
                We will validate the {{ selectedType.label.toLowerCase() }} source and open the builder on this page.
              </p>
            </div>
          </div>
        </div>
      </UCard>

      <div class="space-y-3">
        <div class="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-lime-300">
              Generated examples
            </p>
            <h2 class="text-lg font-bold text-white">
              Real MCBanners output
            </h2>
          </div>
          <UBadge
            color="neutral"
            variant="soft"
            class="w-fit border border-white/10 bg-gray-900/80 text-gray-300"
          >
            300 x 100
          </UBadge>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <article
            v-for="card in exampleCards"
            :key="card.title"
            class="rounded-lg border border-white/10 bg-gray-900/75 p-3 shadow-xl shadow-black/15 transition hover:border-lime-300/40 hover:bg-gray-900"
          >
            <div class="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 class="font-semibold text-white">
                  {{ card.title }}
                </h3>
                <p class="text-sm text-gray-400">
                  {{ card.description }}
                </p>
              </div>
              <span class="shrink-0 rounded-md border border-white/10 bg-gray-950 px-2 py-1 text-xs font-semibold text-gray-400">
                3:1
              </span>
            </div>

            <div class="aspect-[3/1] overflow-hidden rounded-md border border-white/10 bg-gray-950 p-2">
              <img
                :src="card.imageUrl"
                :alt="card.alt"
                width="300"
                height="100"
                loading="lazy"
                class="size-full object-contain"
              >
            </div>
          </article>
        </div>
      </div>
    </section>

  </main>
</template>
