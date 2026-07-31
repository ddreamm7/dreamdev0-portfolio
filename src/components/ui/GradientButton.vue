<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  href?: string
  to?: string
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  href: undefined,
  to: undefined,
  ariaLabel: undefined,
})

const tag = computed<'a' | 'button'>(() => (props.href || props.to ? 'a' : 'button'))

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm'
    case 'lg':
      return 'px-7 py-3.5 text-base'
    default:
      return 'px-5 py-2.5 text-sm'
  }
})

const variantClass = computed(() => {
  switch (props.variant) {
    case 'ghost':
      return 'bg-transparent text-ctp-text hover:bg-ctp-surface0'
    case 'outline':
      return 'border border-ctp-surface2 bg-transparent text-ctp-text hover:border-accent hover:text-accent'
    default:
      return 'border border-ctp-surface1 bg-ctp-surface0/60 text-ctp-subtext1 hover:border-accent hover:bg-accent hover:text-accent-on'
  }
})
</script>

<template>
  <component
    :is="tag"
    :href="href"
    :to="to"
    :type="!href && !to ? type : undefined"
    :aria-label="ariaLabel"
    class="inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 will-change-transform hover:-translate-y-0.5 active:translate-y-0"
    :class="[sizeClass, variantClass]"
  >
    <slot />
  </component>
</template>
