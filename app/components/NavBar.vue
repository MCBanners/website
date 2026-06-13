<script setup lang="ts">
const defaults = useDefaultStore()

function resetToHome() {
  defaults.resetSelectedSource()
}
</script>

<template>
  <header class="w-full border-b border-white/10 bg-gray-950/90 text-white">
    <nav
      class="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10"
      aria-label="Primary"
    >
      <NuxtLink
        to="/"
        class="text-xl font-black tracking-normal text-white transition-colors hover:text-lime-200"
        aria-label="MCBanners home"
        @click="resetToHome"
      >
        MCBanners
      </NuxtLink>

      <div class="flex items-center gap-2">
        <GitHubButton />
      </div>
    </nav>
  </header>
</template>
