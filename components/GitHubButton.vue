<template>
  <ClientOnly>
    <UButton
      to="https://github.com/MCBanners/"
      color="gray"
      variant="ghost"
      aria-label="GitHub"
      target="_blank"
      icon="i-simple-icons-github"
    />
    <template #fallback>
      <div class="w-8 h-8" />
    </template>
  </ClientOnly>
</template>
