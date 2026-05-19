<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  summaryItems: string[]
}>()
</script>

<script lang="ts">
export default {
  name: 'BuilderShell'
}
</script>

<template>
  <div class="space-y-3" data-testid="builder-shell">
    <section class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-primary">
          Banner Builder
        </p>
        <h2 class="mt-0.5 text-2xl font-bold tracking-tight text-highlighted">
          {{ title }}
        </h2>
        <div class="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted">
          <span class="font-medium text-default">{{ subtitle }}</span>
          <template v-for="item in summaryItems" :key="item">
            <span class="text-muted">&middot;</span>
            <span>{{ item }}</span>
          </template>
        </div>
      </div>
      <slot name="actions" />
    </section>

    <section class="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.12fr)_minmax(390px,0.88fr)]">
      <div class="h-full">
        <slot name="left" />
      </div>
      <slot name="design" />
    </section>

    <slot name="advanced" />
  </div>
</template>
