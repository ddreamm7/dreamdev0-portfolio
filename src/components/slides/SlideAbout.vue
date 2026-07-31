<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import SectionHeading from '@/components/ui/SectionHeading.vue'
import TypewriterText from '@/components/ui/TypewriterText.vue'

const { tm, t, locale } = useI18n()

const paragraphs = computed(() => tm('about.bio') as string[])

const typewriterText = computed(() => (locale.value === 'es' ? 'Amo programar.' : 'I love coding.'))

function isHtml(p: string): boolean {
  return p.includes('<')
}

function isTypewriter(p: string): boolean {
  return p === ''
}
</script>

<template>
  <section
    id="about"
    class="relative flex h-full w-full items-center overflow-hidden"
    aria-label="About"
  >
    <div class="relative z-10 flex flex-col justify-center section-container">
      <div class="flex flex-col gap-4 sm:gap-6">
        <div data-slide-anim>
          <SectionHeading shimmer>
            {{ t('about.heading') }}
          </SectionHeading>
        </div>

        <div class="text-ctp-subtext1 flex flex-col gap-4 text-base leading-relaxed sm:text-lg">
          <template
            v-for="(p, i) in paragraphs"
            :key="i"
          >
            <p
              v-if="isTypewriter(p)"
              data-slide-anim
              class="text-2xl font-bold"
            >
              <TypewriterText :text="typewriterText" />
            </p>
            <p
              v-else-if="isHtml(p)"
              data-slide-anim
              v-html="p"
            />
            <p
              v-else
              data-slide-anim
            >
              {{ p }}
            </p>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
:deep(.bio-link-osu) {
  background: linear-gradient(90deg, #ffffff, #ff66aa, #ffffff);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-size: 200% 100%;
  animation: osu-shimmer 3s linear infinite;
  text-decoration: underline;
  font-weight: 700;
}

@keyframes osu-shimmer {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

:deep(.bio-link-catppuccin) {
  background: linear-gradient(
    90deg,
    #f5e0dc,
    #f2cdcd,
    #f5c2e7,
    #cba6f7,
    #f38ba8,
    #eba0ac,
    #fab387,
    #f9e2af,
    #a6e3a1,
    #94e2d5,
    #89dceb,
    #74c7ec,
    #89b4fa,
    #b4befe
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-size: 200% 100%;
  animation: catpuccin-shimmer 4s linear infinite;
  font-weight: 700;
  text-decoration: underline;
}

@keyframes catpuccin-shimmer {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}
</style>
