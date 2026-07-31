<script setup lang="ts">
interface Props {
  label: string
  url: string
}

defineProps<Props>()
</script>

<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    data-cursor-hover
    class="border-ctp-surface2 bg-ctp-surface0/60 text-ctp-subtext1 hover:border-accent hover:text-accent inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors"
  >
    {{ label }}
  </a>
</template>
