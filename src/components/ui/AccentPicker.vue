<script setup lang="ts">
import { computed, ref } from 'vue'
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useAccent } from '@/composables/useAccent'
import { useTheme } from '@/composables/useTheme'
import { accents } from '@/data/accents'
import type { AccentId } from '@/types'

const { t } = useI18n()
const { accent, set } = useAccent()
const { flavor } = useTheme()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

onClickOutside(root, () => (open.value = false))
onKeyStroke('Escape', () => (open.value = false))

function pick(id: AccentId) {
  set(id)
  open.value = false
}

const swatches = computed(() =>
  accents.map((a) => ({
    id: a.id,
    label: t(`accents.${a.id}`),
    color: flavor.value === 'mocha' ? a.mochaHex : a.latteHex,
    isActive: a.id === accent.value,
  })),
)

const currentSwatch = computed(() => {
  const active = accents.find((a) => a.id === accent.value)
  return flavor.value === 'mocha' ? active?.mochaHex : active?.latteHex
})
</script>

<template>
  <div
    ref="root"
    class="relative"
  >
    <button
      type="button"
      data-cursor-hover
      :aria-label="t('header.accent')"
      :title="t('header.accent')"
      :aria-expanded="open"
      aria-haspopup="dialog"
      class="border-ctp-surface1 bg-ctp-surface0/80 text-ctp-text hover:border-accent hover:text-accent focus-visible:border-accent flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border transition-all"
      @click="open = !open"
    >
      <span
        class="ring-ctp-base block h-5 w-5 rounded-full ring-2 transition-all duration-300"
        :style="{ backgroundColor: currentSwatch }"
      />
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="open"
        role="dialog"
        :aria-label="t('header.accent')"
        class="border-ctp-overlay0 bg-ctp-mantle absolute top-full right-0 z-[100] mt-2 w-64 origin-top-right rounded-xl border p-3 shadow-2xl shadow-black/20"
      >
        <div class="text-ctp-subtext0 mb-2 px-1 text-xs font-semibold tracking-wider uppercase">
          {{ t('header.accent') }}
        </div>
        <div class="grid grid-cols-7 gap-2">
          <button
            v-for="s in swatches"
            :key="s.id"
            type="button"
            data-cursor-hover
            :aria-label="s.label"
            :aria-pressed="s.isActive"
            :title="s.label"
            class="group ring-ctp-surface1 relative flex aspect-square cursor-pointer items-center justify-center rounded-full ring-1 transition-transform hover:scale-110 focus-visible:scale-110"
            :class="s.isActive ? 'ring-accent ring-2' : ''"
            :style="{ backgroundColor: s.color }"
            @click="pick(s.id)"
          >
            <svg
              v-if="s.isActive"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-ctp-base"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
