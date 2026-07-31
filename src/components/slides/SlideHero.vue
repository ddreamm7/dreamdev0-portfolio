<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { profile } from '@/data/profile'
import GradientButton from '@/components/ui/GradientButton.vue'
import { useNavigation } from '@/composables/useNavigation'

const { t } = useI18n()

const { jumpById } = useNavigation()
</script>

<template>
  <section
    id="hero"
    class="relative flex h-full w-full items-center overflow-hidden"
    aria-label="Hero"
  >
    <div class="relative z-10 flex flex-col gap-8 section-container">
      <span
        data-slide-anim
        class="border-ctp-surface1 bg-ctp-surface0/60 text-ctp-subtext1 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
      >
        <span class="bg-accent block h-2 w-2 animate-pulse rounded-full" />
        {{ profile.location }}
      </span>

      <h1
        data-slide-anim
        class="text-4xl leading-[1.05] font-extrabold tracking-tight break-words sm:text-5xl md:text-7xl lg:text-8xl"
      >
        <span
          class="from-accent via-accent to-accent-strong bg-gradient-to-br bg-clip-text text-transparent"
        >
          {{ t('hero.greeting', { name: profile.displayName }) }}
        </span>
      </h1>

      <p
        data-slide-anim
        class="text-ctp-subtext1 max-w-3xl text-lg sm:text-xl md:text-2xl"
      >
        {{ t('hero.tagline') }}
      </p>

      <div
        data-slide-anim
        class="flex flex-wrap items-center gap-3"
      >
        <GradientButton
          variant="primary"
          size="lg"
          @click="jumpById('contact')"
        >
          {{ t('hero.ctaContact') }}
        </GradientButton>
        <GradientButton
          variant="outline"
          size="lg"
          @click="jumpById('projects')"
        >
          {{ t('nav.items.projects') }}
        </GradientButton>
      </div>

      <div
        data-slide-anim
        class="text-accent mt-6 flex items-center gap-2 self-center text-xs tracking-[0.3em] uppercase sm:self-start"
        :aria-label="t('hero.scroll')"
      >
        <span>{{ t('hero.scroll') }}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="nudge-right"
          aria-hidden="true"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nudge-right {
  animation: nudge-right 1.4s ease-in-out infinite;
}

@keyframes nudge-right {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(4px);
  }
}
</style>
