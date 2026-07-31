<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { gsap } from 'gsap'

const isHoverable = useMediaQuery('(hover: hover) and (pointer: fine)')
const reducedMotion = useReducedMotion()

const enabled = computed(() => isHoverable.value && !reducedMotion.value)
const hovering = ref(false)
const cursorRef = ref<HTMLElement | null>(null)

let qX: ((v: number) => void) | null = null
let qY: ((v: number) => void) | null = null

function isInteractiveElement(el: Element): boolean {
  try {
    return (
      el.matches('a, button, [role="button"], [data-cursor-hover]') ||
      !!el.closest('a, button, [role="button"], [data-cursor-hover]')
    )
  } catch {
    return false
  }
}

function onPointerMove(e: PointerEvent) {
  if (qX) qX(e.clientX)
  if (qY) qY(e.clientY)
  const el = document.elementFromPoint(e.clientX, e.clientY)
  hovering.value = el ? isInteractiveElement(el) : false
}

onMounted(() => {
  if (!enabled.value) return

  if (cursorRef.value) {
    qX = gsap.quickTo(cursorRef.value, 'left', { duration: 0.15, ease: 'power2.out' })
    qY = gsap.quickTo(cursorRef.value, 'top', { duration: 0.15, ease: 'power2.out' })
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
})
</script>

<template>
  <div
    v-if="enabled"
    ref="cursorRef"
    class="cursor-ring pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border border-solid border-[2px] border-accent will-change-[left,top] transition-[width,height] duration-300"
    :class="[
      hovering
        ? 'size-[24px] is-hovering'
        : 'size-[20px]',
    ]"
    style="transform: translate(-50%, -50%)"
  />
</template>

<style scoped>
.cursor-ring::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  border-radius: 100%;
  background: var(--accent);
  transition: width 0.3s, height 0.3s;
}

.cursor-ring.is-hovering::after {
  width: 6px;
  height: 6px;
}
</style>
