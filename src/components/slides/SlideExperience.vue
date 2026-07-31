<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { experience } from '@/data/experience'
import SectionHeading from '@/components/ui/SectionHeading.vue'

const { t } = useI18n()
</script>

<template>
  <section
    id="experience"
    class="relative flex h-full w-full items-center overflow-hidden"
    aria-label="Experience"
  >
    <div class="relative z-10 flex flex-col gap-6 sm:gap-10 section-container">
      <div data-slide-anim>
        <SectionHeading shimmer>
          {{ t('experience.heading') }}
        </SectionHeading>
      </div>

      <ol
        class="border-accent-soft relative ml-2 flex flex-col gap-6 border-l-2 pl-6 sm:ml-4 sm:gap-8 sm:pl-8"
      >
        <li
          v-for="item in experience"
          :key="item.slug"
          data-slide-anim
          class="relative"
        >
          <span
            data-timeline-dot
            class="bg-accent ring-accent-soft absolute top-1.5 -left-[33px] h-3.5 w-3.5 rounded-full ring-[3px] sm:-left-[41px] sm:h-4 sm:w-4 sm:ring-4"
            aria-hidden="true"
          />

          <div class="flex flex-col gap-1.5">
            <span class="text-accent text-xs font-semibold tracking-wider uppercase">
              {{ item.period }}
            </span>
            <h3 class="text-ctp-text text-xl font-semibold">
              {{ t(`experience.items.${item.slug}.role`) }}
            </h3>
            <p class="text-ctp-subtext0 text-sm font-medium">
              {{ t(`experience.items.${item.slug}.org`) }}
            </p>
            <p class="text-ctp-subtext1 mt-1 text-sm leading-relaxed">
              {{ t(`experience.items.${item.slug}.description`) }}
            </p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
