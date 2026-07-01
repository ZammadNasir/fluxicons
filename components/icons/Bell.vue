<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  size?:        number
  color?:       string
  strokeWidth?: number
  trigger?:     'hover' | 'click' | 'inView' | 'autoplay' | 'none'
  speed?:       number
  loop?:        boolean
  delay?:       number
}

const props = withDefaults(defineProps<Props>(), {
  size:        24,
  color:       'currentColor',
  strokeWidth: 1.5,
  trigger:     'hover',
  speed:       1,
  loop:        false,
  delay:       0,
})

const rootRef = ref<SVGSVGElement | null>(null)
const isAnimating = ref(false)

/**
 * Inline timing for one animation step, reacting to the speed/delay/loop props.
 * `alwaysLoop` is true for continuous/repeating steps that must loop no matter
 * what the `loop` prop is.
 */
function stepStyle(duration: number, stepDelay: number, alwaysLoop: boolean) {
  return {
    animationDuration: `${duration / props.speed}s`,
    animationDelay: `${(stepDelay + props.delay) / props.speed}s`,
    animationIterationCount: alwaysLoop || props.loop ? 'infinite' : '1',
  }
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
    aria-label="Bell icon"
    @mouseenter="handleEnter"
    @click="handleClick"
  >
      <g :class="{ 'flux-bell-body-rotate': isAnimating }" :style="stepStyle(0.7, 0, false)">
        <path id="bell-body" d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      </g>
      <g :class="{ 'flux-bell-clapper-rotate': isAnimating }" :style="stepStyle(0.7, 0, false)">
        <path id="bell-clapper" d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </g>
  </svg>
</template>

<style scoped>
@keyframes flux-bell-body-rotate {
  0% { transform: rotate(0deg); }
  16.67% { transform: rotate(-12deg); }
  33.33% { transform: rotate(12deg); }
  50% { transform: rotate(-9deg); }
  66.67% { transform: rotate(9deg); }
  83.33% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
}

.flux-bell-body-rotate {
  transform-box: view-box;
  transform-origin: 12px 3px;
  animation-name: flux-bell-body-rotate;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}

@keyframes flux-bell-clapper-rotate {
  0% { transform: rotate(0deg); }
  16.67% { transform: rotate(-12deg); }
  33.33% { transform: rotate(12deg); }
  50% { transform: rotate(-9deg); }
  66.67% { transform: rotate(9deg); }
  83.33% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
}

.flux-bell-clapper-rotate {
  transform-box: view-box;
  transform-origin: 12px 3px;
  animation-name: flux-bell-clapper-rotate;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}
</style>
