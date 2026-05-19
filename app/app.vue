<script setup lang="ts">
import { useConstantStore } from '~/stores/constants'
import { useDefaultStore } from '~/stores/defaults'

useHead({
  htmlAttrs: {
    class: 'dark',
    style: 'background:#050914;color-scheme:dark;',
  },
  bodyAttrs: {
    style: 'background:#050914;color:#f8fafc;',
  },
  title: 'MCBanners',
})

useSeoMeta({
  description:
    'Build beautiful live-updating banners for Minecraft resources, authors, and servers.',

  ogTitle: 'MCBanners',
  ogDescription:
    'Build beautiful live-updating banners for Minecraft resources, authors, and servers.',
  ogType: 'website',
  ogImage: '/og/mcbanners-og.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'MCBanners banner builder preview',

  twitterCard: 'summary_large_image',
  twitterTitle: 'MCBanners',
  twitterDescription:
    'Build beautiful live-updating banners for Minecraft resources, authors, and servers.',
  twitterImage: '/og/mcbanners-og.png',
  twitterImageAlt: 'MCBanners banner builder preview',
})

const constants = useConstantStore()
const defaults = useDefaultStore()

await callOnce('mcbanners:constants', () => constants.getConstants())
await callOnce('mcbanners:defaults', () => defaults.getDefaults())
</script>

<template>
  <UApp>
    <div class="min-h-dvh bg-gray-950 text-white">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </UApp>
</template>
