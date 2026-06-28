import type { AnimationSpec, AnimationStep, IconPaths } from "@/lib/animation-spec";
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
  renderSvgElement,
  stepValues,
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
  if (input.size !== DEFAULT_ICON_PROPS.size) attrs.push(`:size="${input.size}"`);
  if (input.color !== DEFAULT_ICON_PROPS.color) {
    attrs.push(`color="${resolveColor(input.color)}"`);
  }
  if (input.strokeWidth !== DEFAULT_ICON_PROPS.strokeWidth) {
    attrs.push(`:${kebab("strokeWidth")}="${input.strokeWidth}"`);
  }
  if (input.trigger !== DEFAULT_ICON_PROPS.trigger) {
    attrs.push(`trigger="${input.trigger}"`);
  }
  if (input.speed !== DEFAULT_ICON_PROPS.speed) attrs.push(`:speed="${input.speed}"`);
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
  "scale",
  "translateX",
  "translateY",
]);

/** Build the CSS `transform`/`opacity`/`stroke-dashoffset` value for a step. */
function cssFrameValue(step: AnimationStep, value: number): string {
  switch (step.property) {
    case "rotate":
      return `transform: rotate(${value}deg);`;
    case "scale":
      return `transform: scale(${value});`;
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

/** Emit the `@keyframes` block + class for a single animation step. */
function buildStepCss(
  step: AnimationStep,
  className: string,
  continuous: boolean,
): string {
  const values = stepValues(step);
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
    isDraw ? "  stroke-dasharray: 1;" : null,
    `  animation-name: ${className};`,
    "  animation-fill-mode: forwards;",
    `  animation-timing-function: ${cssEasing(step.ease)};`,
    continuous || step.repeat ? "  animation-iteration-count: infinite;" : null,
  ].filter(Boolean);

  const keyframes = `@keyframes ${className} {\n${frames}\n}`;
  const classBlock = `.${className} {\n${lines.join("\n")}\n}`;
  return `${keyframes}\n\n${classBlock}`;
}

/**
 * A `:style` binding that sets the step's duration/delay at runtime, dividing
 * by the live `speed` prop. Output (for duration 0.6, no delay):
 *   :style="`animation-duration: ${0.6 / speed}s`"
 */
function vueDurationBinding(step: AnimationStep): string {
  const delay =
    step.delay && step.delay > 0
      ? `; animation-delay: \${${step.delay} / speed}s`
      : "";
  return `:style="\`animation-duration: \${${step.duration} / speed}s${delay}\`"`;
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
  const continuous = isContinuous(spec);

  const steps = [
    ...(spec.sequences.trigger ?? []),
    ...(spec.sequences.continuous ?? []),
  ].filter((s) => s.element === elementKey);

  // pathLength draws on the path element itself via the stroke-dash trick.
  const drawStep = steps.find((s) => s.property === "pathLength");
  let shapeAttrs = ` id="${id}"`;
  if (drawStep) {
    const className = `flux-${id}-draw`;
    cssBlocks.push(buildStepCss(drawStep, className, continuous));
    shapeAttrs += ` pathLength="1" :class="{ '${className}': isAnimating }" ${vueDurationBinding(drawStep)}`;
  }

  let markup = renderSvgElement(data, shapeAttrs);

  // Wrap transform/opacity steps in nested <g> so transforms compose.
  for (const step of steps.filter((s) => s.property !== "pathLength")) {
    const className = `flux-${id}-${step.property.toLowerCase()}`;
    cssBlocks.push(buildStepCss(step, className, continuous));
    markup = `<g :class="{ '${className}': isAnimating }" ${vueDurationBinding(step)}>\n        ${markup.split("\n").join("\n        ")}\n      </g>`;
  }

  return markup;
}

const VUE_PROPS_BLOCK = `interface Props {
  size?:        number
  color?:       string
  strokeWidth?: number
  trigger?:     'hover' | 'click' | 'inView' | 'autoplay' | 'none'
  speed?:       number
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
    const color = p.color === "currentColor" || !p.color ? "currentColor" : p.color;
    const strokeWidth = p.strokeWidth ?? DEFAULT_ICON_PROPS.strokeWidth;
    const trigger = p.trigger ?? spec.defaultTrigger;
    const speed = p.speed ?? DEFAULT_ICON_PROPS.speed;
    const continuous = isContinuous(spec);

    const cssBlocks: string[] = [];
    const body = Object.keys(paths)
      .map((key) => renderVueElement(key, paths, spec, cssBlocks))
      .join("\n      ");

    const autoStart = continuous || trigger === "autoplay";
    const styleBlock =
      cssBlocks.length > 0
        ? `\n\n<style scoped>\n${cssBlocks.join("\n\n")}\n</style>`
        : "";

    const code = `<script setup lang="ts">
import { ref, onMounted } from 'vue'

${VUE_PROPS_BLOCK}

const props = withDefaults(defineProps<Props>(), {
  size:        ${size},
  color:       '${color}',
  strokeWidth: ${strokeWidth},
  trigger:     '${trigger}',
  speed:       ${speed},
})

const isAnimating = ref(${autoStart ? "true" : "false"})

function play() {
  isAnimating.value = false
  requestAnimationFrame(() => {
    isAnimating.value = true
  })
}

function handleClick() {
  if (props.trigger === 'click') play()
}

function handleEnter() {
  if (props.trigger === 'hover') play()
}

onMounted(() => {
  if (props.trigger === 'autoplay'${continuous ? " || true" : ""}) play()
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    role="img"
    aria-label="${meta.name} icon"
    @mouseenter="handleEnter"
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
