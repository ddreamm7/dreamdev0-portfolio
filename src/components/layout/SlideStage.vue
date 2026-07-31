<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, type Component } from 'vue'
import { gsap } from 'gsap'
import { useGsap } from '@/composables/useGsap'
import { useGsapReveal } from '@/composables/useGsapReveal'
import type { SlideStageProps } from './SlideStage.types'

const props = withDefaults(defineProps<SlideStageProps>(), {
  transitionDuration: 1.0,
  onNavigate: undefined,
  onStageRef: undefined,
})

const stageEl = ref<HTMLElement | null>(null)
const slideRefs = ref<HTMLElement[]>([])
let activeTl: gsap.core.Timeline | null = null

function setSlideRef(el: Element | Component | null, index: number): void {
  if (el instanceof HTMLElement) {
    slideRefs.value[index] = el
  }
}

function isActive(slideId: string): boolean {
  return slideId === props.activeId
}

function playEntryStagger(slide: HTMLElement, delay = 0.4): void {
  const children = slide.querySelectorAll<HTMLElement>('[data-slide-anim]')
  if (!children.length) return
  gsap.fromTo(
    children,
    { y: 48, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.1, ease: 'power2.out', stagger: 0.15, delay },
  )
}

useGsap((ctx) => {
  ctx.add(() => {
    slideRefs.value.forEach((el) => {
      if (!el) return
      gsap.set(el, { xPercent: 0, opacity: 1, scale: 1, willChange: 'transform, opacity' })
    })
  })

  watch(
    [() => props.target, () => props.current],
    () => {
      const to = props.target
      const from = props.current
      if (to === from) return
      const dir = to > from ? 1 : -1
      const outgoing = slideRefs.value[from]
      const incoming = slideRefs.value[to]

      if (!outgoing || !incoming) return

      if (activeTl) activeTl.kill()
      gsap.killTweensOf(outgoing)
      gsap.killTweensOf(incoming)

      slideRefs.value.forEach((el, idx) => {
        if (!el || idx === to || idx === from) return
        gsap.set(el, { xPercent: 100 * dir, opacity: 0 })
      })

      gsap.set(incoming, { xPercent: 100 * dir, opacity: 0 })

      const incomingChildren = incoming.querySelectorAll<HTMLElement>('[data-slide-anim]')
      if (incomingChildren.length) {
        gsap.set(incomingChildren, { y: 48, opacity: 0 })
      }

      const outX = gsap.getProperty(outgoing, 'xPercent') as number
      const outO = gsap.getProperty(outgoing, 'opacity') as number

      const tl = gsap.timeline({
        onComplete: () => {
          activeTl = null
          const id = props.components[to]?.id
          if (id && props.onNavigate) props.onNavigate(id)
        },
      })

      tl.fromTo(
        outgoing,
        { xPercent: outX, opacity: outO },
        {
          xPercent: -100 * dir,
          opacity: 0.35,
          duration: props.transitionDuration,
          ease: 'power2.inOut',
        },
        0,
      )

      const outgoingDecors = outgoing.querySelectorAll<HTMLElement>('[data-slide-decor]')
      if (outgoingDecors.length) {
        gsap.killTweensOf(outgoingDecors)
        tl.to(outgoingDecors, { opacity: 0, duration: 0.4, ease: 'power2.out' }, 0)
      }

      tl.to(
        incoming,
        {
          xPercent: 0,
          opacity: 1,
          duration: props.transitionDuration,
          ease: 'power2.inOut',
        },
        0,
      )

      if (incomingChildren.length) {
        tl.fromTo(
          incomingChildren,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            ease: 'power2.out',
            stagger: 0.12,
          },
          props.transitionDuration * 0.5,
        )
      }

      activeTl = tl
    },
    { flush: 'post' },
  )
})

onMounted(() => {
  if (stageEl.value && props.onStageRef) {
    props.onStageRef(stageEl.value)
  }
  slideRefs.value.forEach((el, i) => {
    if (!el) return
    gsap.set(el, {
      xPercent: i === props.index ? 0 : 100,
      opacity: i === props.index ? 1 : 0,
      scale: 1,
    })
  })
  const active = slideRefs.value[props.index]
  if (active) playEntryStagger(active)
})

onBeforeUnmount(() => {
  if (activeTl) activeTl.kill()
  activeTl = null
  slideRefs.value.forEach((el) => {
    if (el) gsap.set(el, { clearProps: 'all' })
  })
  if (props.onStageRef) props.onStageRef(null)
})

useGsapReveal(stageEl, {
  initial: { opacity: 0 },
  enter: { opacity: 1, duration: 1, ease: 'power2.out' },
  when: 'mount',
})
</script>

<template>
  <div
    ref="stageEl"
    class="stage relative h-full w-full overflow-hidden"
    role="region"
  >
    <div
      v-for="(item, i) in components"
      :key="item.id"
      :ref="(el) => setSlideRef(el as Element | null, i)"
      class="slide-panel absolute inset-0"
      :class="{ 'pointer-events-none': !isActive(item.id) }"
      :aria-hidden="!isActive(item.id)"
      :inert="!isActive(item.id) ? true : undefined"
    >
      <div class="slide-scroll">
        <component
          :is="item.component"
          :active="isActive(item.id)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-panel {
  will-change: transform, opacity;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}
</style>
