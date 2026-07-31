import {
  ref,
  computed,
  readonly,
  onMounted,
  onBeforeUnmount,
  type Ref,
  type ComputedRef,
} from 'vue'
import { gsap } from 'gsap'

export interface UseSlideNavigationOptions {
  count: number
  transitionDuration?: number
  bufferThreshold?: number
  wheelSensitivity?: number
  touchThreshold?: number
  cooldownMs?: number
  enabled?: Ref<boolean>
}

export interface SlideNavigationApi {
  index: Readonly<Ref<number>>
  target: Readonly<Ref<number>>
  current: Readonly<Ref<number>>
  progress: Readonly<Ref<number>>
  isAnimating: Readonly<Ref<boolean>>
  isEntering: Readonly<Ref<boolean>>
  isExiting: Readonly<Ref<boolean>>
  inCooldown: Readonly<Ref<boolean>>
  canNavigate: ComputedRef<boolean>
  direction: Readonly<Ref<1 | -1 | 0>>
  next: () => void
  prev: () => void
  goTo: (i: number) => void
  stageRef: (el: HTMLElement | null) => void
  offset: ComputedRef<number>
}

const STAGE_BOUND_FLAG = '__portfolioNavBound'

export function useSlideNavigation(options: UseSlideNavigationOptions): SlideNavigationApi {
  const {
    count,
    transitionDuration = 1.0,
    bufferThreshold = 1,
    wheelSensitivity = 0.0035,
    touchThreshold = 60,
    cooldownMs = 500,
    enabled,
  } = options

  const index = ref(0)
  const target = ref(0)
  const current = ref(0)
  const progress = ref(0)
  const isAnimating = ref(false)
  const isEntering = ref(false)
  const isExiting = ref(false)
  const inCooldown = ref(false)
  const direction = ref<1 | -1 | 0>(0)
  const buffer = ref(0)
  const offset = computed(() => target.value - index.value)
  const stageEl = ref<HTMLElement | null>(null)

  const canNavigate = computed(
    () => !isAnimating.value && !isEntering.value && !isExiting.value && !inCooldown.value,
  )

  let activeTween: gsap.core.Tween | null = null
  let cooldownTimer: ReturnType<typeof setTimeout> | null = null

  const clearCooldown = (): void => {
    if (cooldownTimer) {
      clearTimeout(cooldownTimer)
      cooldownTimer = null
    }
    inCooldown.value = false
  }

  const flushBuffer = (): void => {
    if (!canNavigate.value) return
    if (buffer.value >= 1) {
      buffer.value = 0
      goTo(target.value + 1)
    } else if (buffer.value <= -1) {
      buffer.value = 0
      goTo(target.value - 1)
    } else {
      buffer.value = 0
    }
  }

  const goTo = (i: number): void => {
    const clamped = Math.max(0, Math.min(count - 1, i))
    if (clamped === target.value && !isAnimating.value) return
    const dir: 1 | -1 = clamped > target.value ? 1 : -1
    direction.value = dir
    clearCooldown()
    current.value = target.value
    target.value = clamped
    progress.value = clamped / Math.max(1, count - 1)
    isAnimating.value = true
    isEntering.value = true
    isExiting.value = true
    buffer.value = 0
    if (activeTween) activeTween.kill()
    activeTween = gsap.to(index, {
      value: clamped,
      duration: transitionDuration,
      ease: 'power2.inOut',
      overwrite: 'auto',
      onComplete: () => {
        activeTween = null
        isAnimating.value = false
        isEntering.value = false
        isExiting.value = false
        direction.value = 0
        inCooldown.value = true
        cooldownTimer = setTimeout(() => {
          cooldownTimer = null
          inCooldown.value = false
          flushBuffer()
        }, cooldownMs)
      },
    })
  }

  const next = (): void => {
    if (!enabled?.value) return
    if (target.value >= count - 1) return
    if (buffer.value < bufferThreshold) {
      buffer.value = Math.min(bufferThreshold, buffer.value + 1)
    }
    if (canNavigate.value) {
      goTo(target.value + 1)
    }
  }

  const prev = (): void => {
    if (!enabled?.value) return
    if (target.value <= 0) return
    if (buffer.value > -bufferThreshold) {
      buffer.value = Math.max(-bufferThreshold, buffer.value - 1)
    }
    if (canNavigate.value) {
      goTo(target.value - 1)
    }
  }

  const onWheel = (e: WheelEvent): void => {
    if (!enabled?.value) return
    e.preventDefault()
    if (isAnimating.value) return
    const delta = e.deltaY * wheelSensitivity
    if (delta > 0) {
      buffer.value = Math.min(bufferThreshold, buffer.value + delta)
    } else if (delta < 0) {
      buffer.value = Math.max(-bufferThreshold, buffer.value + delta)
    }
    if (!inCooldown.value && Math.abs(buffer.value) >= 1) {
      flushBuffer()
    }
  }

  let touchStartX: number | null = null
  let touchStartY: number | null = null

  const onTouchStart = (e: TouchEvent): void => {
    if (!enabled?.value) return
    const t = e.touches[0]
    if (!t) return
    touchStartX = t.clientX
    touchStartY = t.clientY
  }

  const onTouchEnd = (e: TouchEvent): void => {
    if (!enabled?.value) return
    if (touchStartX === null || touchStartY === null) return
    const t = e.changedTouches[0]
    if (!t) return
    const dx = t.clientX - touchStartX
    const dy = t.clientY - touchStartY
    touchStartX = null
    touchStartY = null
    if (Math.abs(dx) < touchThreshold) return
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next()
      else prev()
    }
  }

  const onKeyDown = (e: KeyboardEvent): void => {
    if (!enabled?.value) return
    if (e.target instanceof HTMLElement) {
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault()
      next()
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault()
      prev()
    } else if (e.key === 'Home') {
      e.preventDefault()
      goTo(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      goTo(count - 1)
    }
  }

  const bindStageListeners = (el: HTMLElement): void => {
    const bound = (el as unknown as Record<string, unknown>)[STAGE_BOUND_FLAG]
    if (bound) return
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    ;(el as unknown as Record<string, unknown>)[STAGE_BOUND_FLAG] = true
  }

  const unbindStageListeners = (el: HTMLElement): void => {
    if (!(el as unknown as Record<string, unknown>)[STAGE_BOUND_FLAG]) return
    el.removeEventListener('wheel', onWheel)
    el.removeEventListener('touchstart', onTouchStart)
    el.removeEventListener('touchend', onTouchEnd)
    delete (el as unknown as Record<string, unknown>)[STAGE_BOUND_FLAG]
  }

  const stageRef = (el: HTMLElement | null): void => {
    if (stageEl.value && stageEl.value !== el) {
      unbindStageListeners(stageEl.value)
    }
    stageEl.value = el
    if (el) bindStageListeners(el)
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
    if (stageEl.value) bindStageListeners(stageEl.value)
  })

  onBeforeUnmount(() => {
    if (stageEl.value) unbindStageListeners(stageEl.value)
    window.removeEventListener('keydown', onKeyDown)
    if (activeTween) activeTween.kill()
    clearCooldown()
  })

  return {
    index: readonly(index),
    target: readonly(target),
    current: readonly(current),
    progress: readonly(progress),
    isAnimating: readonly(isAnimating),
    isEntering: readonly(isEntering),
    isExiting: readonly(isExiting),
    inCooldown: readonly(inCooldown),
    canNavigate,
    direction: readonly(direction),
    next,
    prev,
    goTo,
    stageRef,
    offset,
  }
}

export type SlideNavigation = ReturnType<typeof useSlideNavigation>
