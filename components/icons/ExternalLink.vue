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
    aria-label="ExternalLink icon"
    @mouseenter="handleEnter"
    @click="handleClick"
  >
      <path id="external-link-box" d="M13 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
      <g :class="{ 'flux-external-link-arrow-translatey': isAnimating }" :style="stepStyle(0.4, 0, false)">
        <g :class="{ 'flux-external-link-arrow-translatex': isAnimating }" :style="stepStyle(0.4, 0, false)">
                <path id="external-link-arrow" d="M10 14L20 4" />
              </g>
      </g>
      <g :class="{ 'flux-external-link-arrow-head-translatey': isAnimating }" :style="stepStyle(0.4, 0, false)">
        <g :class="{ 'flux-external-link-arrow-head-translatex': isAnimating }" :style="stepStyle(0.4, 0, false)">
                <path id="external-link-arrow-head" d="M15 4h5v5" />
              </g>
      </g>
  </svg>
</template>

<style scoped>
@keyframes flux-external-link-arrow-translatex {
  0% { transform: translateX(0px); }
  50% { transform: translateX(1.5px); }
  100% { transform: translateX(0px); }
}

.flux-external-link-arrow-translatex {
  transform-box: view-box;
  transform-origin: 12px 12px;
  animation-name: flux-external-link-arrow-translatex;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}

@keyframes flux-external-link-arrow-translatey {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-1.5px); }
  100% { transform: translateY(0px); }
}

.flux-external-link-arrow-translatey {
  transform-box: view-box;
  transform-origin: 12px 12px;
  animation-name: flux-external-link-arrow-translatey;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}

@keyframes flux-external-link-arrow-head-translatex {
  0% { transform: translateX(0px); }
  50% { transform: translateX(1.5px); }
  100% { transform: translateX(0px); }
}

.flux-external-link-arrow-head-translatex {
  transform-box: view-box;
  transform-origin: 12px 12px;
  animation-name: flux-external-link-arrow-head-translatex;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}

@keyframes flux-external-link-arrow-head-translatey {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-1.5px); }
  100% { transform: translateY(0px); }
}

.flux-external-link-arrow-head-translatey {
  transform-box: view-box;
  transform-origin: 12px 12px;
  animation-name: flux-external-link-arrow-head-translatey;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}
</style>
