import type { AnimationSpec, IconPaths } from "@/lib/animation-spec";
import type { IconMetadata } from "@/lib/icon-registry";
import { toPascalCase } from "@/lib/utils";
import {
  compileSpec,
  type RenderNode,
  type RenderShape,
} from "@/lib/runtime/compile";
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
import { componentName } from "./shared";
import { FLUX_RUNTIME_TS } from "./runtime-template.generated";

const DEFAULT_VUE_IMPORT_PATH = "@/components/icons";

/** The co-located runtime file the emitted SFC imports (written by the CLI). */
const RUNTIME_FILENAME = "rehover-runtime";

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
  dependencies: "none — self-contained (drops a local rehover-runtime.ts).",
  generate: generateVueCode,
};

/* -------------------------------------------------------------------------- */
/* Full-source generator (CLI)                                                */
/* -------------------------------------------------------------------------- */
/*
 * The emitted SFC is a thin wrapper: it renders static SVG markup with
 * `data-flux` targets and hands the root to the shared `animateIcon` runtime.
 * The keyframes + timing come from `compileSpec` — the exact same compiler the
 * React renderer uses — so Vue and React animate identically by construction.
 */

/** An inline `style="..."` attribute from a kebab-case style record. */
function styleAttr(style: Record<string, string>): string {
  const s = Object.entries(style)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");
  return s ? ` style="${s}"` : "";
}

/** Serialize a leaf shape to SVG markup (with draw attrs when it animates). */
function shapeMarkup(node: RenderShape): string {
  const draw = node.drawKey
    ? ` data-flux="${node.drawKey}" pathLength="1" style="stroke-dasharray: 1"`
    : "";
  const d = node.data;
  switch (d.type) {
    case "path":
      return `<path id="${node.id}" d="${d.d}"${draw} />`;
    case "circle":
      return `<circle id="${node.id}" cx="${d.cx}" cy="${d.cy}" r="${d.r}"${draw} />`;
    case "line":
      return `<line id="${node.id}" x1="${d.x1}" y1="${d.y1}" x2="${d.x2}" y2="${d.y2}"${draw} />`;
    case "polyline":
      return `<polyline id="${node.id}" points="${d.points}"${draw} />`;
  }
}

/** Serialize a render node (nested `<g>` wrappers + shape) to template markup. */
function nodeMarkup(node: RenderNode, indent: string): string {
  if (node.kind === "shape") return shapeMarkup(node);
  const child = nodeMarkup(node.child, `${indent}  `);
  return `<g data-flux="${node.key}"${styleAttr(node.style)}>\n${indent}  ${child}\n${indent}</g>`;
}

/** Full Vue 3 SFC generator: declarative spec → thin SFC over the runtime. */
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
    const loop = p.loop ?? spec.defaultLoop ?? DEFAULT_ICON_PROPS.loop;
    const delay = p.delay ?? DEFAULT_ICON_PROPS.delay;
    const runtimeImport = `./${RUNTIME_FILENAME}`;

    const plan = compileSpec(spec, paths);
    const body = plan.elements
      .map((el) => nodeMarkup(el, "      "))
      .join("\n      ");

    // 3D rotations need a perspective on the root to render with depth.
    const perspectiveAttr =
      plan.perspective != null
        ? `\n    style="perspective: ${plan.perspective}px"`
        : "";

    // Only what the runtime needs — the keyframes + whether it autostarts.
    const runtimePlan = JSON.stringify(
      { continuous: plan.continuous, animations: plan.animations },
      null,
      2,
    );

    const code = `<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { animateIcon, type RuntimePlan } from '${runtimeImport}'

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
  size:        ${size},
  color:       '${color}',
  strokeWidth: ${strokeWidth},
  trigger:     '${trigger}',
  speed:       ${speed},
  loop:        ${loop},
  delay:       ${delay},
})

// Keyframes + timing compiled from the icon's animation spec. Identical across
// every framework because they come from the one shared compiler.
const plan: RuntimePlan = ${runtimePlan}

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
    aria-label="${meta.name} icon"${perspectiveAttr}
  >
      ${body}
  </svg>
</template>
`;

    return {
      code,
      fileExtension: "vue",
      importStatement: `import ${name} from '@/components/icons/${name}.vue';`,
      usageSnippet: `<${name} />`,
      dependencies: "none — self-contained (no npm install)",
      runtime: { filename: `${RUNTIME_FILENAME}.ts`, code: FLUX_RUNTIME_TS },
    };
  },
};
