<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { animateIcon, type RuntimePlan } from './flux-runtime'

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

// Keyframes + timing compiled from the icon's animation spec. Identical across
// every framework because they come from the one shared compiler.
const plan: RuntimePlan = {
  "continuous": false,
  "animations": [
    {
      "key": "download-shaft-translatey",
      "active": [
        {
          "transform": "translateY(0px)"
        },
        {
          "transform": "translateY(3px)"
        },
        {
          "transform": "translateY(0px)"
        }
      ],
      "hold": [
        {
          "transform": "translateY(0px)"
        },
        {
          "transform": "translateY(3px)"
        }
      ],
      "duration": 0.55,
      "delay": 0,
      "easing": "ease-in-out",
      "alwaysLoop": false
    },
    {
      "key": "download-arrowhead-translatey",
      "active": [
        {
          "transform": "translateY(0px)"
        },
        {
          "transform": "translateY(3px)"
        },
        {
          "transform": "translateY(0px)"
        }
      ],
      "hold": [
        {
          "transform": "translateY(0px)"
        },
        {
          "transform": "translateY(3px)"
        }
      ],
      "duration": 0.55,
      "delay": 0,
      "easing": "ease-in-out",
      "alwaysLoop": false
    },
    {
      "key": "download-tray-scalex",
      "active": [
        {
          "transform": "scaleX(1)"
        },
        {
          "transform": "scaleX(1.08)"
        },
        {
          "transform": "scaleX(1)"
        }
      ],
      "hold": [
        {
          "transform": "scaleX(1)"
        },
        {
          "transform": "scaleX(1.08)"
        }
      ],
      "duration": 0.25,
      "delay": 0,
      "easing": "ease-in-out",
      "alwaysLoop": false
    }
  ]
}

const rootRef = ref<SVGSVGElement | null>(null)
let controller: ReturnType<typeof animateIcon> | null = null

function runtimeProps() {
  return {
    trigger: props.trigger,
    speed: props.speed,
    loop: props.loop,
    delay: props.delay,
  }
}

onMounted(() => {
  if (rootRef.value) controller = animateIcon(rootRef.value, plan, runtimeProps())
})

// Re-wire when an animation-affecting prop changes (e.g. the playground).
watch(
  () => [props.trigger, props.speed, props.loop, props.delay],
  () => controller?.update(runtimeProps()),
)

onUnmounted(() => controller?.destroy())
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
    aria-label="Download icon"
  >
      <g data-flux="download-shaft-translatey" style="transform-box: view-box; transform-origin: 12px 12px">
        <path id="download-shaft" d="M12 3v11" />
      </g>
      <g data-flux="download-arrowhead-translatey" style="transform-box: view-box; transform-origin: 12px 12px">
        <path id="download-arrowhead" d="m8 10 4 4 4-4" />
      </g>
      <g data-flux="download-tray-scalex" style="transform-box: view-box; transform-origin: 12px 12px">
        <path id="download-tray" d="M4 19h16" />
      </g>
  </svg>
</template>
