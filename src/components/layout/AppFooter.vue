<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { profile } from '@/data/profile'
import { useTemplateRef } from 'vue'

defineProps<{
  progress: number
}>()

const { t } = useI18n()
const year = new Date().getFullYear()

const root = useTemplateRef<HTMLElement>('root')

defineExpose({ root })
</script>

<template>
  <footer
    ref="root"
    class="flex h-16 shrink-0 items-center px-4 sm:h-20 sm:px-6 md:px-8 lg:px-12"
    :aria-label="t('progress.aria')"
  >
    <div class="flex w-full items-center gap-4 sm:gap-6 md:gap-8">
      <p class="text-ctp-subtext0 shrink-0 text-[10px] sm:text-xs md:text-sm">
        {{ t('footer.copyright', { year, name: profile.displayName }) }}
      </p>

      <div class="bg-ctp-surface0/40 relative h-0.75 flex-1 overflow-hidden rounded-full">
        <div
          class="from-accent to-accent-strong absolute inset-y-0 left-0 bg-linear-to-r transition-[width] duration-1000 ease-in-out"
          :style="{ width: `${progress * 100}%` }"
        />
      </div>
    </div>
  </footer>
</template>
