<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LocaleSwitcher from '@/components/ui/LocaleSwitcher.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import AccentPicker from '@/components/ui/AccentPicker.vue'
import type { NavSection } from '@/types'
import { useTemplateRef } from 'vue'

const props = defineProps<{ active: string }>()
const emit = defineEmits<{ jump: [id: string] }>()

const { t } = useI18n()

const sections: NavSection[] = [
  { id: 'about', key: 'about' },
  { id: 'skills', key: 'skills' },
  { id: 'projects', key: 'projects' },
  { id: 'experience', key: 'experience' },
  { id: 'contact', key: 'contact' },
]

function go(id: string) {
  emit('jump', id)
}

void props

const root = useTemplateRef<HTMLElement>('root')
const items = useTemplateRef<HTMLElement>('items')

defineExpose({ root, items })
</script>

<template>
  <header
    ref="root"
    class="relative z-[100] flex h-16 shrink-0 items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 md:px-8 lg:px-12"
  >
    <a
      data-entry-item
      href="#hero"
      class="group hover:text-accent flex items-center gap-2 font-mono text-sm font-bold tracking-tight transition-colors"
      @click.prevent="go('hero')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        class="h-8 w-8 rounded-lg"
        fill="currentColor"
      >
        <path
          d="M40.8 7.2c6.4 8.6 5.2 21.9-3.4 30.5s-21.9 9.8-30.5 3.4c9.4 9.4 24.5 9.4 33.9 0s9.4-24.5 0-33.9z"
        />
        <path
          d="M40.8 7.2c.4 7.2-3 16.6-10.2 23.8s-16.6 10.5-23.8 10.2c8.3 4.8 20.6 3.1 28.8-5.1s10-20.5 5.2-28.9z"
        />
        <path
          d="M28.9 18.2c.3-.1.6 0 .8.2s.3.5.2.8l-1.8 4.2 3 3.4c.2.2.3.6.1.8s-.4.4-.7.4l-4.6-.4-2.3 4c-.2.2-.5.4-.8.3-.3 0-.5-.3-.6-.6l-1-4.5-4.5-1c-.3-.1-.5-.3-.6-.6s.1-.6.4-.8l4-2.3-.4-4.6c0-.3.1-.6.4-.7s.6-.1.8.1l3.4 3 4.2-1.8z"
        />
        <path
          d="M40.8 7.2c-8.3-4.8-20.6-3.1-28.8 5.1s-10 20.5-5.2 28.9c-.4-7.2 3-16.6 10.2-23.8s16.6-10.5 23.8-10.2z"
        />
        <path
          d="M40.8 7.2c-9.4-9.4-24.5-9.4-33.9 0s-9.4 24.5 0 33.9c-6.4-8.6-5.2-21.9 3.4-30.5s21.9-9.8 30.5-3.4z"
        />
      </svg>
    </a>

    <nav
      ref="items"
      class="hidden items-center gap-1 md:flex"
      :aria-label="t('nav.items.hero')"
    >
      <button
        v-for="s in sections"
        :key="s.id"
        data-entry-item
        type="button"
        :aria-current="props.active === s.id ? 'true' : undefined"
        class="hover:text-accent cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors relative"
        :class="props.active === s.id ? 'text-accent' : 'text-ctp-subtext1'"
        @click="go(s.id)"
      >
        {{ t(`nav.items.${s.key}`) }}
      </button>
    </nav>

    <div
      ref="items"
      class="flex items-center gap-2"
    >
      <div data-entry-item>
        <LocaleSwitcher />
      </div>
      <div data-entry-item>
        <ThemeToggle />
      </div>
      <div data-entry-item>
        <AccentPicker />
      </div>
    </div>
  </header>
</template>

<style scoped>
nav button::after {
  content: '';
  position: absolute;
  inset-inline: 0.75rem;
  bottom: 0;
  height: 2px;
  background-color: var(--accent);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.3s ease;
}
nav button[aria-current="true"]::after {
  transform: scaleX(1);
}
</style>
