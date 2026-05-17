<template>
  <header class="w-full">
    <nav
      class="container mx-auto flex h-24 items-center justify-between px-4 sm:px-6"
      aria-label="Primary"
    >
      <div class="flex flex-1 justify-center gap-6 text-gray-600 dark:text-gray-300">
        <NuxtLink
          to="/"
          class="font-bold transition-colors hover:text-gray-900 dark:hover:text-white"
        >
          Home
        </NuxtLink>
        <NuxtLink
          to="/resources"
          class="font-bold transition-colors hover:text-gray-900 dark:hover:text-white"
        >
          Resources
        </NuxtLink>
        <NuxtLink
          to="/authors"
          class="font-bold transition-colors hover:text-gray-900 dark:hover:text-white"
        >
          Authors
        </NuxtLink>
        <NuxtLink
          to="/servers"
          class="font-bold transition-colors hover:text-gray-900 dark:hover:text-white"
        >
          Servers
        </NuxtLink>
      </div>

      <div class="flex items-center gap-2">
        <ColorModeButton />
        <GitHubButton />
      </div>
    </nav>
  </header>
</template>
