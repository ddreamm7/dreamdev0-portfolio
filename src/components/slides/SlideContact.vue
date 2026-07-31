<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import SocialIconLink from '@/components/ui/SocialIconLink.vue'
const { t } = useI18n()

const props = defineProps<{ active: boolean }>()
</script>

<template>
  <section
    id="contact"
    class="relative flex h-full w-full items-center overflow-hidden"
    aria-label="Contact"
  >
    <div
      class="relative z-10 flex flex-col items-center gap-8 text-center section-container"
    >
      <div data-slide-anim>
        <SectionHeading shimmer>
          {{ t('contact.heading') }}
        </SectionHeading>
      </div>

      <p
        data-slide-anim
        class="text-ctp-subtext1 max-w-2xl text-xl sm:text-2xl"
      >
        {{ t('contact.intro') }}
      </p>

      <div
        data-slide-anim
        class="mt-4 flex flex-wrap justify-center gap-3"
      >
        <SocialIconLink />
      </div>
    </div>
  </section>
</template>
