import type {
  AnimationSpec,
  AnimationStep,
  IconPaths,
} from "@/lib/animation-spec";
import type { IconMetadata } from "@/lib/icon-registry";
import { toPascalCase } from "@/lib/utils";
import {
  COLOR_VARIABLE_MAP,
  DEFAULT_ICON_PROPS,
  type GeneratedFile,
  type GeneratorConfig,
  type GeneratorInput,
  type GeneratorInterface,
  type GeneratorOutput,
  type IconGenerator,
} from "./types";
import {
  componentName,
  cssEasing,
  DEFAULT_ORIGIN,
  distributePercentages,
  isContinuous,
  perspectiveFor,
  renderSvgElement,
  stepValues,
  uses3DTransform,
} from "./shared";

const DEFAULT_VUE_IMPORT_PATH = "@/components/icons";

/* -------------------------------------------------------------------------- */
/* Usage snippet (playground code panel)                                      */
/* -------------------------------------------------------------------------- */

function resolveColor(color: string): string {
  return COLOR_VARIABLE_MAP[color.toLowerCase()] ?? color;
}

function kebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function buildUsageAttributes(input: GeneratorInput): string[] {
  const attrs: string[] = [];
  if (input.size !== DEFAULT_ICON_PROPS.size)
    attrs.push(`:size="${input.size}"`);
  if (input.color !== DEFAULT_ICON_PROPS.color) {
    attrs.push(`color="${resolveColor(input.color)}"`);
  }
  if (input.strokeWidth !== DEFAULT_ICON_PROPS.strokeWidth) {
    attrs.push(`:${kebab("strokeWidth")}="${input.strokeWidth}"`);
  }
  if (input.trigger !== DEFAULT_ICON_PROPS.trigger) {
    attrs.push(`trigger="${input.trigger}"`);
  }
  if (input.speed !== DEFAULT_ICON_PROPS.speed)
    attrs.push(`:speed="${input.speed}"`);
  if (input.loop !== DEFAULT_ICON_PROPS.loop) {
    attrs.push(input.loop ? "loop" : ':loop="false"');
  }
  if (input.delay !== DEFAULT_ICON_PROPS.delay)
    attrs.push(`:delay="${input.delay}"`);
  return attrs;
}

function renderUsageTemplate(name: string, attrs: string[]): string {
  if (attrs.length === 0) return `<${name} />`;
  if (attrs.length === 1) return `<${name} ${attrs[0]} />`;
  const lines = attrs.map((a) => `    ${a}`).join("\n");
  return `<${name}\n${lines}\n  />`;
}

/** Generate a copy-ready Vue usage snippet for the playground. */
export function generateVueCode(input: GeneratorInput): GeneratorOutput {
  const name = toPascalCase(input.slug);
  const importPath = input.importPath ?? DEFAULT_VUE_IMPORT_PATH;
  const attrs = buildUsageAttributes(input);

  const importLine = `import ${name} from "${importPath}/${name}.vue";`;
  const jsxLine = renderUsageTemplate(name, attrs);
  const code = `<script setup lang="ts">\n${importLine}\n</script>\n\n<template>\n  ${jsxLine}\n</template>`;
  return { code, importLine, jsxLine };
}

/** Vue usage-snippet descriptor for the playground code panel. */
export const vueUsage: GeneratorInterface = {
  id: "vue",
  label: "Vue 3",
  language: "vue",
  dependencies: "none — uses CSS keyframe animations.",
  generate: generateVueCode,
};

/* -------------------------------------------------------------------------- */
/* Full-source generator (CLI)                                                */
/* -------------------------------------------------------------------------- */

const TRANSFORM_PROPS = new Set([
  "rotate",
  "rotateX",
  "rotateY",
  "scale",
  "scaleX",
  "scaleY",
  "translateX",
  "translateY",
]);

/** Build the CSS `transform`/`opacity`/`stroke-dashoffset` value for a step. */
function cssFrameValue(step: AnimationStep, value: number): string {
  switch (step.property) {
    case "rotate":
      return `transform: rotate(${value}deg);`;
    case "rotateX":
      return `transform: rotateX(${value}deg);`;
    case "rotateY":
      return `transform: rotateY(${value}deg);`;
    case "scale":
      return `transform: scale(${value});`;
    case "scaleX":
      return `transform: scaleX(${value});`;
    case "scaleY":
      return `transform: scaleY(${value});`;
    case "translateX":
      return `transform: translateX(${value}px);`;
    case "translateY":
      return `transform: translateY(${value}px);`;
    case "opacity":
      return `opacity: ${value};`;
    case "strokeWidth":
      return `stroke-width: ${value};`;
    case "pathLength":
      // 1 = fully hidden (dash offset), 0 = fully drawn.
      return `stroke-dashoffset: ${1 - value};`;
  }
}

/** Which keyframe pose a step is being emitted for. */
type StepVariant = "normal" | "holdIn" | "holdOut";

/**
 * Emit the `@keyframes` block + class for a single animation step. Timing
 * (duration, delay, iteration count) is bound inline via `stepStyle()` so the
 * `speed`, `delay`, and `loop` props can drive it at runtime.
 *
 * `variant` selects the pose: `normal` is the full round-trip used by
 * hover/click/inView/autoplay; the `hold*` poses back the `hoverHold` trigger —
 * `holdIn` drops the trailing return-to-rest frame so the icon settles at its
 * peak and stays there, and `holdOut` plays that in reverse (peak → rest) when
 * the pointer leaves.
 */
function buildStepCss(
  step: AnimationStep,
  className: string,
  preserve3D: boolean,
  variant: StepVariant = "normal",
): string {
  let values = stepValues(step);
  const roundTrip =
    values.length > 1 && values[0] === values[values.length - 1];
  if (variant !== "normal" && roundTrip) values = values.slice(0, -1);
  if (variant === "holdOut") values = [...values].reverse();
  const percents = distributePercentages(values.length);
  const frames = values
    .map((v, i) => `  ${percents[i]}% { ${cssFrameValue(step, v)} }`)
    .join("\n");

  const origin = step.origin ?? DEFAULT_ORIGIN;
  const isTransform = TRANSFORM_PROPS.has(step.property);
  const isDraw = step.property === "pathLength";
  const lines = [
    isTransform ? "  transform-box: view-box;" : null,
    isTransform ? `  transform-origin: ${origin.x}px ${origin.y}px;` : null,
    // Keep the 3D rendering context alive down the wrapper chain so the SVG
    // root's perspective reaches nested 3D rotations.
    isTransform && preserve3D ? "  transform-style: preserve-3d;" : null,
    isDraw ? "  stroke-dasharray: 1;" : null,
    `  animation-name: ${className};`,
    "  animation-fill-mode: forwards;",
    `  animation-timing-function: ${cssEasing(step.ease)};`,
  ].filter(Boolean);

  const keyframes = `@keyframes ${className} {\n${frames}\n}`;
  const classBlock = `.${className} {\n${lines.join("\n")}\n}`;
  return `${keyframes}\n\n${classBlock}`;
}

/**
 * A `:style` binding that calls the component's `stepStyle()` helper, passing
 * the step's duration, its intrinsic delay, and whether it must loop regardless
 * of the `loop` prop (continuous/repeating steps always loop).
 */
function vueStepStyleBinding(step: AnimationStep, alwaysLoop: boolean): string {
  return `:style="stepStyle(${step.duration}, ${step.delay ?? 0}, ${alwaysLoop})"`;
}

/**
 * Emit every keyframe pose a step can be driven with at runtime: the `normal`
 * round-trip (hover/click/inView/autoplay) plus the `hoverHold` poses
 * (`-hold` = rest → peak held, `-hold-out` = peak → rest on leave). The runtime
 * `stepCls()` helper picks the right one from the live `trigger` prop, so a
 * shipped component behaves correctly for whatever `trigger` a consumer passes —
 * not just the one it was generated with.
 */
function pushStepVariants(
  cssBlocks: string[],
  step: AnimationStep,
  base: string,
  preserve3D: boolean,
): void {
  cssBlocks.push(buildStepCss(step, base, preserve3D, "normal"));
  cssBlocks.push(buildStepCss(step, `${base}-hold`, preserve3D, "holdIn"));
  cssBlocks.push(buildStepCss(step, `${base}-hold-out`, preserve3D, "holdOut"));
}

/** Render one element (with its animation wrappers) and collect its CSS. */
function renderVueElement(
  elementKey: string,
  paths: IconPaths,
  spec: AnimationSpec,
  cssBlocks: string[],
): string {
  const data = paths[elementKey];
  const id = spec.elements[elementKey]?.id ?? elementKey;
  const preserve3D = uses3DTransform(spec);

  // Tag each step with whether it must loop on its own: continuous-sequence
  // steps and steps flagged `repeat` always loop; trigger steps loop only when
  // the user passes `loop`.
  const steps = [
    ...(spec.sequences.trigger ?? [])
      .filter((s) => s.element === elementKey)
      .map((step) => ({ step, alwaysLoop: Boolean(step.repeat) })),
    ...(spec.sequences.continuous ?? [])
      .filter((s) => s.element === elementKey)
      .map((step) => ({ step, alwaysLoop: true })),
  ];

  // pathLength draws on the path element itself via the stroke-dash trick.
  const draw = steps.find((s) => s.step.property === "pathLength");
  let shapeAttrs = ` id="${id}"`;
  if (draw) {
    const base = `flux-${id}-draw`;
    pushStepVariants(cssBlocks, draw.step, base, preserve3D);
    shapeAttrs += ` pathLength="1" :class="stepCls('${base}')" ${vueStepStyleBinding(draw.step, draw.alwaysLoop)}`;
  }

  let markup = renderSvgElement(data, shapeAttrs);

  // Wrap transform/opacity steps in nested <g> so transforms compose.
  for (const { step, alwaysLoop } of steps.filter(
    (s) => s.step.property !== "pathLength",
  )) {
    const base = `flux-${id}-${step.property.toLowerCase()}`;
    pushStepVariants(cssBlocks, step, base, preserve3D);
    markup = `<g :class="stepCls('${base}')" ${vueStepStyleBinding(step, alwaysLoop)}>\n        ${markup.split("\n").join("\n        ")}\n      </g>`;
  }

  return markup;
}

const VUE_PROPS_BLOCK = `interface Props {
  size?:        number
  color?:       string
  strokeWidth?: number
  trigger?:     'hover' | 'hoverHold' | 'click' | 'inView' | 'autoplay' | 'none'
  speed?:       number
  loop?:        boolean
  delay?:       number
}`;

/** Full Vue 3 SFC generator: declarative spec → \`<script setup>\` + CSS. */
export const vueGenerator: IconGenerator = {
  framework: "vue",
  displayName: "Vue 3",
  fileExtension: "vue",

  generate(
    spec: AnimationSpec,
    paths: IconPaths,
    meta: IconMetadata,
    config?: GeneratorConfig,
  ): GeneratedFile {
    const name = componentName(meta.slug);
    const p = config?.props ?? {};
    const size = p.size ?? DEFAULT_ICON_PROPS.size;
    const color =
      p.color === "currentColor" || !p.color ? "currentColor" : p.color;
    const strokeWidth = p.strokeWidth ?? DEFAULT_ICON_PROPS.strokeWidth;
    const trigger = p.trigger ?? spec.defaultTrigger;
    const speed = p.speed ?? DEFAULT_ICON_PROPS.speed;
    const loop = p.loop ?? DEFAULT_ICON_PROPS.loop;
    const delay = p.delay ?? DEFAULT_ICON_PROPS.delay;
    const continuous = isContinuous(spec);
    const is3D = uses3DTransform(spec);

    const cssBlocks: string[] = [];
    const body = Object.keys(paths)
      .map((key) => renderVueElement(key, paths, spec, cssBlocks))
      .join("\n      ");

    // 3D rotations need a perspective on an ancestor to render with depth.
    const perspectiveAttr = is3D
      ? `\n    style="perspective: ${perspectiveFor(spec)}px"`
      : "";
    const autoStart = continuous || trigger === "autoplay";
    const styleBlock =
      cssBlocks.length > 0
        ? `\n\n<style scoped>\n${cssBlocks.join("\n\n")}\n</style>`
        : "";

    const code = `<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

${VUE_PROPS_BLOCK}

const props = withDefaults(defineProps<Props>(), {
  size:        ${size},
  color:       '${color}',
  strokeWidth: ${strokeWidth},
  trigger:     '${trigger}',
  speed:       ${speed},
  loop:        ${loop},
  delay:       ${delay},
})

const rootRef = ref<SVGSVGElement | null>(null)
const isAnimating = ref(${autoStart ? "true" : "false"})
// hoverHold pose: 'idle' (rest) → 'in' (settles at peak, holds) → 'out' (returns).
const holdPhase = ref<'idle' | 'in' | 'out'>('idle')

/**
 * Inline timing for one animation step, reacting to the speed/delay/loop props.
 * \`alwaysLoop\` is true for continuous/repeating steps that must loop no matter
 * what the \`loop\` prop is. \`hoverHold\` never loops — it settles and holds.
 */
function stepStyle(duration: number, stepDelay: number, alwaysLoop: boolean) {
  const loop = props.trigger !== 'hoverHold' && (alwaysLoop || props.loop)
  return {
    animationDuration: \`\${duration / props.speed}s\`,
    animationDelay: \`\${(stepDelay + props.delay) / props.speed}s\`,
    animationIterationCount: loop ? 'infinite' : '1',
  }
}

/**
 * Which keyframe class an element's wrapper wears right now. \`hoverHold\` drives
 * the \`-hold\`/\`-hold-out\` poses off \`holdPhase\`; every other trigger toggles the
 * round-trip class with \`isAnimating\`.
 */
function stepCls(base: string) {
  if (props.trigger === 'hoverHold') {
    if (holdPhase.value === 'in') return { [\`\${base}-hold\`]: true }
    if (holdPhase.value === 'out') return { [\`\${base}-hold-out\`]: true }
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
  if (props.trigger === 'autoplay'${continuous ? " || true" : ""}) play()

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
    aria-label="${meta.name} icon"${perspectiveAttr}
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
    @click="handleClick"
  >
      ${body}
  </svg>
</template>${styleBlock}
`;

    const importStatement = `import ${name} from '@/components/icons/${name}.vue';`;
    const usageSnippet = `<${name} />`;
    return {
      code,
      fileExtension: "vue",
      importStatement,
      usageSnippet,
      dependencies: "none — uses CSS animations only",
    };
  },
};
