<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  size?:        number
  color?:       string
  strokeWidth?: number
  trigger?:     'hover' | 'hoverHold' | 'click' | 'inView' | 'autoplay' | 'none'
  speed?:       number
  loop?:        boolean
  delay?:       number
}

const props = withDefaults(defineProps<Props>(), {
  size:        24,
  color:       'currentColor',
  strokeWidth: 1.5,
  trigger:     'hoverHold',
  speed:       1,
  loop:        false,
  delay:       0,
})

const rootRef = ref<SVGSVGElement | null>(null)
const isAnimating = ref(false)
// hoverHold pose: 'idle' (rest) → 'in' (settles at peak, holds) → 'out' (returns).
const holdPhase = ref<'idle' | 'in' | 'out'>('idle')

/**
 * Inline timing for one animation step, reacting to the speed/delay/loop props.
 * `alwaysLoop` is true for continuous/repeating steps that must loop no matter
 * what the `loop` prop is. `hoverHold` never loops — it settles and holds.
 */
function stepStyle(duration: number, stepDelay: number, alwaysLoop: boolean) {
  const loop = props.trigger !== 'hoverHold' && (alwaysLoop || props.loop)
  return {
    animationDuration: `${duration / props.speed}s`,
    animationDelay: `${(stepDelay + props.delay) / props.speed}s`,
    animationIterationCount: loop ? 'infinite' : '1',
  }
}

/**
 * Which keyframe class an element's wrapper wears right now. `hoverHold` drives
 * the `-hold`/`-hold-out` poses off `holdPhase`; every other trigger toggles the
 * round-trip class with `isAnimating`.
 */
function stepCls(base: string) {
  if (props.trigger === 'hoverHold') {
    if (holdPhase.value === 'in') return { [`${base}-hold`]: true }
    if (holdPhase.value === 'out') return { [`${base}-hold-out`]: true }
    return {}
  }
  return isAnimating.value ? { [base]: true } : {}
}

function play() {
  // Restart the CSS animation: drop the class, let the browser paint at least
  // one frame without it (a single rAF isn't enough — Vue's DOM flush and the
  // re-add can coalesce into the same frame), then re-add it.
  isAnimating.value = false
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      isAnimating.value = true
    })
  })
}

function handleClick() {
  if (props.trigger === 'click') play()
}

function handleEnter() {
  if (props.trigger === 'hover') play()
  else if (props.trigger === 'hoverHold') holdPhase.value = 'in'
}

function handleLeave() {
  if (props.trigger === 'hoverHold' && holdPhase.value !== 'idle') holdPhase.value = 'out'
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (props.trigger === 'autoplay') play()

  if (props.trigger === 'inView' && rootRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          play()
          observer?.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(rootRef.value)
  }
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <svg
    ref="rootRef"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    role="img"
    aria-label="Eye icon"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
    @click="handleClick"
  >
      <path id="eye-outline" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <g :class="stepCls('flux-eye-pupil-scale')" :style="stepStyle(0.45, 0, false)">
        <circle id="eye-pupil" cx="12" cy="12" r="2.5" />
      </g>
      <g :class="stepCls('flux-eye-upperLid-translatey')" :style="stepStyle(0.45, 0, false)">
        <path id="eye-upperLid" d="M2 12s3.5-7 10-7 10 7 10 7" />
      </g>
  </svg>
</template>

<style scoped>
@keyframes flux-eye-pupil-scale {
  0% { transform: scale(1); }
  50% { transform: scale(0.88); }
  100% { transform: scale(1); }
}

.flux-eye-pupil-scale {
  transform-box: view-box;
  transform-origin: 12px 12px;
  animation-name: flux-eye-pupil-scale;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}

@keyframes flux-eye-pupil-scale-hold {
  0% { transform: scale(1); }
  100% { transform: scale(0.88); }
}

.flux-eye-pupil-scale-hold {
  transform-box: view-box;
  transform-origin: 12px 12px;
  animation-name: flux-eye-pupil-scale-hold;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}

@keyframes flux-eye-pupil-scale-hold-out {
  0% { transform: scale(0.88); }
  100% { transform: scale(1); }
}

.flux-eye-pupil-scale-hold-out {
  transform-box: view-box;
  transform-origin: 12px 12px;
  animation-name: flux-eye-pupil-scale-hold-out;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}

@keyframes flux-eye-upperLid-translatey {
  0% { transform: translateY(-6px); }
  50% { transform: translateY(0px); }
  100% { transform: translateY(-6px); }
}

.flux-eye-upperLid-translatey {
  transform-box: view-box;
  transform-origin: 12px 12px;
  animation-name: flux-eye-upperLid-translatey;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}

@keyframes flux-eye-upperLid-translatey-hold {
  0% { transform: translateY(-6px); }
  100% { transform: translateY(0px); }
}

.flux-eye-upperLid-translatey-hold {
  transform-box: view-box;
  transform-origin: 12px 12px;
  animation-name: flux-eye-upperLid-translatey-hold;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}

@keyframes flux-eye-upperLid-translatey-hold-out {
  0% { transform: translateY(0px); }
  100% { transform: translateY(-6px); }
}

.flux-eye-upperLid-translatey-hold-out {
  transform-box: view-box;
  transform-origin: 12px 12px;
  animation-name: flux-eye-upperLid-translatey-hold-out;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}
</style>
