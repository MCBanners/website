<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<script lang="ts">
export default {
  name: 'BuilderShell',
}
</script>

<template>
  <div class="space-y-4" data-testid="builder-shell">
    <section
      class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-primary">
          Banner Builder
        </p>
        <h2 class="mt-1 text-2xl font-bold tracking-tight text-highlighted">
          {{ title }}
        </h2>
      </div>
      <slot name="actions" />
    </section>

    <section
      class="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.22fr)_minmax(380px,0.78fr)]"
    >
      <div class="h-full">
        <slot name="left" />
      </div>
      <slot name="design" />
    </section>

    <slot name="advanced" />
  </div>
</template>
