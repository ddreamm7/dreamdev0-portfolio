<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMediaQuery, useElementSize, useEventListener } from '@vueuse/core'
import { gsap } from 'gsap'
import { useNavigation } from '@/composables/useNavigation'
import { useReducedMotion } from '@/composables/useReducedMotion'
import type { Project } from '@/types'
import { projects } from '@/data/projects'
import SectionHeading from '@/components/ui/SectionHeading.vue'

const props = defineProps<{ active: boolean }>()
const { t } = useI18n()
const { jumpById } = useNavigation()
const reducedMotion = useReducedMotion()

const CHUNK_SIZE = 4

const isDesktop = useMediaQuery('(min-width: 768px)')

const blocksWrapper = ref<HTMLElement | null>(null)
const blocksTrack = ref<HTMLElement | null>(null)
const blocksInner = ref<HTMLElement | null>(null)
const blockIndex = ref(0)
let isAnimatingBlock = false

const trackSize = useElementSize(blocksTrack)

const blocks = computed<Project[][]>(() => {
  if (!isDesktop.value) return []
  const result: Project[][] = []
  for (let i = 0; i < projects.length; i += CHUNK_SIZE)
    result.push(projects.slice(i, i + CHUNK_SIZE))
  return result
})

function animateToBlock(from: number, to: number) {
  if (!blocksInner.value) return
  const children = blocksInner.value.children
  const outgoing = children[from] as HTMLElement
  const incoming = children[to] as HTMLElement
  if (!outgoing || !incoming) return

  const w = trackSize.width.value
  const targetX = -(to * w)
  const currentX = gsap.getProperty(blocksInner.value, 'x') as number
  if (Math.abs(currentX - targetX) < 1) return

  if (reducedMotion.value) {
    gsap.set(blocksInner.value, { x: targetX })
    for (let i = 0; i < children.length; i++) {
      gsap.set(children[i], { opacity: i === to ? 1 : 0.3 })
    }
    blockIndex.value = to
    return
  }

  isAnimatingBlock = true
  gsap.set(incoming, { opacity: 0.3 })

  const tl = gsap.timeline({
    onComplete: () => { isAnimatingBlock = false; blockIndex.value = to },
  })
  tl.to(blocksInner.value, { x: targetX, duration: 1, ease: 'power2.out' }, 0)
  tl.to(outgoing, { opacity: 0, duration: 1, ease: 'power2.out' }, 0)
  tl.to(incoming, { opacity: 1, duration: 1, ease: 'power2.out' }, 0)
}

function goToBlock(index: number) {
  if (index === blockIndex.value || isAnimatingBlock) return
  animateToBlock(blockIndex.value, index)
}

function onBlockWheel(e: WheelEvent) {
  e.preventDefault()
  e.stopPropagation()
  if (isAnimatingBlock || !props.active) return
  const lastBlock = blocks.value.length - 1
  if (e.deltaY > 0) {
    if (blockIndex.value < lastBlock) {
      goToBlock(blockIndex.value + 1)
    } else {
      jumpById('experience')
    }
  } else if (e.deltaY < 0) {
    if (blockIndex.value > 0) {
      goToBlock(blockIndex.value - 1)
    } else {
      jumpById('skills')
    }
  }
}

const wheelTarget = computed(() =>
  props.active && isDesktop.value ? blocksWrapper.value : null,
)
useEventListener(wheelTarget, 'wheel', onBlockWheel, { passive: false })

watch([() => props.active, isDesktop], ([active, desktop]) => {
  if (active && desktop) {
    const el = blocksInner.value
    if (!el) return
    blockIndex.value = 0
    nextTick(() => {
      gsap.set(el, { x: 0 })
      for (const child of el.children)
        gsap.set(child, { opacity: 1 })
    })
  }
})

watch([trackSize.width, () => props.active, isDesktop], () => {
  if (props.active && isDesktop.value && blocksInner.value) {
    const el = blocksInner.value
    gsap.set(el, { x: -(blockIndex.value * trackSize.width.value) })
    for (let i = 0; i < el.children.length; i++)
      gsap.set(el.children[i], { opacity: i === blockIndex.value ? 1 : 0.3 })
  }
})
</script>

<template>
  <section
    id="projects"
    class="flex h-full w-full items-start md:items-center"
    style="height: 100%"
    aria-label="Projects"
  >
    <div
      ref="blocksWrapper"
      class="flex flex-col gap-6 sm:gap-10 section-container"
      :class="isDesktop ? 'h-full overflow-hidden' : 'h-full'"
    >
      <div
        data-slide-anim
        class="shrink-0 z-10"
      >
        <SectionHeading>{{ t('projects.heading') }}</SectionHeading>
      </div>

      <template v-if="isDesktop">
        <div
          ref="blocksTrack"
          class="flex-1 overflow-hidden relative"
        >
          <div
            ref="blocksInner"
            class="flex flex-row will-change-transform h-full"
          >
            <div
              v-for="(block, bIdx) in blocks"
              :key="bIdx"
              class="flex-[0_0_100%] min-h-0 overflow-hidden"
            >
              <div class="grid grid-cols-2 grid-rows-2 gap-12 h-full">
                <article
                  v-for="p in block"
                  :key="p.slug"
                  :data-slide-anim="bIdx === 0 ? '' : undefined"
                  class="group border-ctp-surface1 bg-ctp-mantle/40 hover:border-accent flex rounded-2xl border overflow-hidden min-h-0"
                >
                  <div class="bg-ctp-crust relative w-2/5 shrink-0 overflow-hidden">
                    <img
                      :src="p.cover"
                      :alt="t(`projects.items.${p.slug}.title`)"
                      class="h-full w-full object-cover"
                      loading="lazy"
                    >
                  </div>
                  <div class="flex flex-col flex-1 min-w-0 gap-2 p-6 overflow-hidden">
                    <h3 class="text-ctp-text text-lg font-semibold sm:text-xl">
                      {{ t(`projects.items.${p.slug}.title`) }}
                    </h3>
                    <p class="text-ctp-subtext1 text-xs sm:text-sm line-clamp-2">
                      {{ t(`projects.items.${p.slug}.description`) }}
                    </p>
                    <div class="mt-auto flex flex-wrap items-stretch gap-2">
                      <a
                        :href="p.links.source"
                        target="_blank"
                        rel="noopener noreferrer"
        class="flex-1 border border-ctp-surface1 bg-ctp-surface0/60 text-ctp-subtext1 hover:border-accent hover:text-accent inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                      >
                        {{ t('projects.source') }}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M7 17 17 7M7 7h10v10" />
                        </svg>
                      </a>
                      <a
                        v-if="p.links.download"
                        :href="p.links.download"
                        target="_blank"
                        rel="noopener noreferrer"
        class="flex-1 border border-ctp-surface1 bg-ctp-surface0/60 text-ctp-subtext1 hover:border-accent hover:text-accent inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                      >
                        {{ t('projects.download') }}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="blocks.length > 1"
          class="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2 z-10"
        >
          <button
            v-for="(_, i) in blocks"
            :key="i"
            class="h-2 rounded-full transition-colors cursor-pointer"
            :class="[
              i === blockIndex ? 'w-6 bg-accent' : 'w-2 bg-ctp-surface2 hover:bg-ctp-overlay0',
            ]"
            :aria-label="`Page ${i + 1}`"
            @click="goToBlock(i)"
          />
        </div>
      </template>

      <template v-else>
        <div
          ref="blocksTrack"
          class="flex-1 overflow-y-auto pb-8"
        >
          <div class="flex flex-col gap-6 sm:gap-8">
            <article
              v-for="p in projects"
              :key="p.slug"
              data-slide-anim
              class="group border-ctp-surface1 bg-ctp-mantle/40 hover:border-accent flex flex-col gap-3 overflow-hidden rounded-2xl border sm:gap-4"
            >
              <div class="bg-ctp-crust relative w-full overflow-hidden h-24">
                <img
                  :src="p.cover"
                  :alt="t(`projects.items.${p.slug}.title`)"
                   class="h-full w-full object-cover"
                   loading="lazy"
                 >
                </div>
                <div class="flex flex-1 flex-col gap-3 px-3 py-3 sm:px-4 sm:py-4">
                <h3 class="text-ctp-text text-lg font-semibold sm:text-xl">
                  {{ t(`projects.items.${p.slug}.title`) }}
                </h3>
                <p class="text-ctp-subtext1 text-xs sm:text-sm line-clamp-2">
                  {{ t(`projects.items.${p.slug}.description`) }}
                </p>
                <div class="mt-auto flex flex-wrap items-stretch gap-3 sm:gap-4">
                  <a
                    :href="p.links.source"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex-1 border border-ctp-surface1 bg-ctp-surface0/60 text-ctp-subtext1 hover:border-accent hover:text-accent inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                  >
                    {{ t('projects.source') }}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M7 17 17 7M7 7h10v10" />
                    </svg>
                  </a>
                  <a
                    v-if="p.links.download"
                    :href="p.links.download"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex-1 border border-ctp-surface1 bg-ctp-surface0/60 text-ctp-subtext1 hover:border-accent hover:text-accent inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                  >
                    {{ t('projects.download') }}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
