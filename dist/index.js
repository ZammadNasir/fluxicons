"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// cli/api.ts
var api_exports = {};
__export(api_exports, {
  GENERATORS: () => GENERATORS,
  ICON_GENERATORS: () => ICON_GENERATORS,
  ICON_SOURCES: () => ICON_SOURCES,
  generateReactCode: () => generateReactCode,
  generateVueCode: () => generateVueCode,
  getIconGenerator: () => getIconGenerator,
  getIconSource: () => getIconSource,
  listIconSlugs: () => listIconSlugs,
  reactGenerator: () => reactGenerator,
  vueGenerator: () => vueGenerator
});
module.exports = __toCommonJS(api_exports);

// lib/utils.ts
function roundTo(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
function toPascalCase(input) {
  return input.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("");
}

// lib/generators/types.ts
var DEFAULT_ICON_PROPS = {
  size: 24,
  color: "currentColor",
  strokeWidth: 1.5,
  trigger: "hover",
  speed: 1,
  loop: false,
  delay: 0
};
var DEFAULT_IMPORT_PATH = "@/components/icons";
var COLOR_VARIABLE_MAP = {
  "#6366f1": "var(--brand)"
};

// lib/generators/shared.ts
function componentName(slug) {
  return toPascalCase(slug);
}
var DEFAULT_ORIGIN = { x: 12, y: 12 };
function stepValues(step) {
  if (step.values && step.values.length > 0) return step.values;
  return [step.from ?? 0, step.to ?? 0];
}
function distributePercentages(count) {
  if (count <= 1) return [0];
  return Array.from(
    { length: count },
    (_, i) => roundTo(i / (count - 1) * 100, 2)
  );
}
function isContinuous(spec) {
  return (spec.sequences.continuous?.length ?? 0) > 0;
}
function cssEasing(ease) {
  switch (ease) {
    case "linear":
      return "linear";
    case "easeIn":
      return "ease-in";
    case "easeOut":
      return "ease-out";
    case "easeInOut":
      return "ease-in-out";
    case "spring":
      return "cubic-bezier(0.34, 1.56, 0.64, 1)";
    case "bounce":
      return "cubic-bezier(0.22, 1.2, 0.36, 1)";
  }
}
function framerEasing(ease) {
  switch (ease) {
    case "spring":
    case "bounce":
      return `[0.34, 1.56, 0.64, 1]`;
    case "easeIn":
      return `"easeIn"`;
    case "easeOut":
      return `"easeOut"`;
    case "easeInOut":
      return `"easeInOut"`;
    case "linear":
      return `"linear"`;
  }
}
function renderSvgElement(data, attrs, selfClose = true) {
  const end = selfClose ? " />" : ">";
  switch (data.type) {
    case "path":
      return `<path${attrs} d="${data.d}"${end}`;
    case "circle":
      return `<circle${attrs} cx="${data.cx}" cy="${data.cy}" r="${data.r}"${end}`;
    case "line":
      return `<line${attrs} x1="${data.x1}" y1="${data.y1}" x2="${data.x2}" y2="${data.y2}"${end}`;
    case "polyline":
      return `<polyline${attrs} points="${data.points}"${end}`;
  }
}

// lib/generators/react.ts
function resolveColor(color) {
  return COLOR_VARIABLE_MAP[color.toLowerCase()] ?? color;
}
function buildAttributes(input) {
  const attrs = [];
  if (input.size !== DEFAULT_ICON_PROPS.size) {
    attrs.push({ key: "size", value: `{${input.size}}` });
  }
  if (input.color !== DEFAULT_ICON_PROPS.color) {
    attrs.push({ key: "color", value: `"${resolveColor(input.color)}"` });
  }
  if (input.strokeWidth !== DEFAULT_ICON_PROPS.strokeWidth) {
    attrs.push({ key: "strokeWidth", value: `{${input.strokeWidth}}` });
  }
  if (input.trigger !== DEFAULT_ICON_PROPS.trigger) {
    attrs.push({ key: "trigger", value: `"${input.trigger}"` });
  }
  if (input.speed !== DEFAULT_ICON_PROPS.speed) {
    attrs.push({ key: "speed", value: `{${input.speed}}` });
  }
  if (input.loop !== DEFAULT_ICON_PROPS.loop) {
    attrs.push({ key: "loop", value: input.loop ? "" : "{false}" });
  }
  if (input.delay !== DEFAULT_ICON_PROPS.delay) {
    attrs.push({ key: "delay", value: `{${input.delay}}` });
  }
  return attrs;
}
function attrText(a) {
  return a.value === "" ? a.key : `${a.key}=${a.value}`;
}
function renderJsx(name, attrs) {
  if (attrs.length === 0) return `<${name} />`;
  if (attrs.length === 1) {
    return `<${name} ${attrText(attrs[0])} />`;
  }
  const lines = attrs.map((a) => `  ${attrText(a)}`).join("\n");
  return `<${name}
${lines}
/>`;
}
function generateReactCode(input) {
  const name = toPascalCase(input.slug);
  const importPath = input.importPath ?? DEFAULT_IMPORT_PATH;
  const attrs = buildAttributes(input);
  const importLine = `import ${name} from "${importPath}/${name}";`;
  const jsxLine = renderJsx(name, attrs);
  const code = `${importLine}

export function Example() {
  return (
${jsxLine.split("\n").map((line) => `    ${line}`).join("\n")}
  );
}`;
  return { code, importLine, jsxLine };
}
var reactUsage = {
  id: "react",
  label: "React",
  language: "tsx",
  dependencies: "npm install motion",
  generate: generateReactCode
};
var FRAMER_PROP = {
  rotate: "rotate",
  scale: "scale",
  translateX: "x",
  translateY: "y",
  opacity: "opacity",
  pathLength: "pathLength",
  strokeWidth: "strokeWidth"
};
var TRANSFORM_PROPS = /* @__PURE__ */ new Set(["rotate", "scale", "translateX", "translateY"]);
function restValue(step) {
  if (step.property === "pathLength") return step.to ?? 1;
  return stepValues(step)[0];
}
function animateTarget(step) {
  const values = stepValues(step);
  return `[${values.join(", ")}]`;
}
function buildVariants(elementKey, steps, continuous) {
  const rest = [];
  const active = [];
  const transitions = [];
  for (const step of steps) {
    const prop = FRAMER_PROP[step.property];
    rest.push(`${prop}: ${restValue(step)}`);
    active.push(`${prop}: ${animateTarget(step)}`);
    const repeat = continuous || step.repeat ? "Infinity" : "0";
    const delay = step.delay ? `, delay: ${step.delay} / speed` : "";
    transitions.push(
      `${prop}: { duration: ${step.duration} / speed, ease: ${framerEasing(step.ease)}, repeat: ${repeat}${delay} }`
    );
  }
  return `  const ${elementKey}Variants: Variants = {
    rest: { ${rest.join(", ")} },
    active: {
      ${active.join(",\n      ")},
      transition: { ${transitions.join(", ")} },
    },
  };`;
}
function originStyle(steps) {
  const transform = steps.find((s) => TRANSFORM_PROPS.has(s.property));
  if (!transform) return "";
  const o = transform.origin ?? DEFAULT_ORIGIN;
  return ` style={{ transformBox: "view-box", transformOrigin: "${o.x}px ${o.y}px" } as React.CSSProperties}`;
}
function motionElement(data, id, variantsVar, style) {
  const tag = data.type;
  const motionTag = variantsVar ? `motion.${tag}` : tag;
  const variants = variantsVar ? ` variants={${variantsVar}}${style}` : "";
  const geom = data.type === "path" ? `d="${data.d}"` : data.type === "circle" ? `cx={${data.cx}} cy={${data.cy}} r={${data.r}}` : data.type === "line" ? `x1={${data.x1}} y1={${data.y1}} x2={${data.x2}} y2={${data.y2}}` : `points="${data.points}"`;
  return `        <${motionTag} id="${id}" ${geom}${variants} />`;
}
var reactGenerator = {
  framework: "react",
  displayName: "React",
  fileExtension: "tsx",
  generate(spec, paths, meta, config) {
    const name = componentName(meta.slug);
    const p = config?.props ?? {};
    const size = p.size ?? DEFAULT_ICON_PROPS.size;
    const color = p.color ?? "currentColor";
    const strokeWidth = p.strokeWidth ?? DEFAULT_ICON_PROPS.strokeWidth;
    const trigger = p.trigger ?? spec.defaultTrigger;
    const speed = p.speed ?? DEFAULT_ICON_PROPS.speed;
    const continuous = isContinuous(spec);
    const animSteps = [
      ...spec.sequences.trigger ?? [],
      ...spec.sequences.continuous ?? []
    ];
    const variantDecls = [];
    const elementMarkup = Object.keys(paths).map((key) => {
      const data = paths[key];
      const id = spec.elements[key]?.id ?? key;
      const steps = animSteps.filter((s) => s.element === key);
      if (steps.length === 0) return motionElement(data, id, null, "");
      variantDecls.push(buildVariants(key, steps, continuous));
      return motionElement(data, id, `${key}Variants`, originStyle(steps));
    });
    const autoActive = continuous || trigger === "autoplay";
    const animateExpr = autoActive ? '"active"' : 'trigger === "click" && clicked ? "active" : "rest"';
    const code = `"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";

interface ${name}Props {
  size?: number;
  color?: string;
  strokeWidth?: number;
  trigger?: "hover" | "click" | "inView" | "autoplay" | "none";
  speed?: number;
}

/** ${meta.name} \u2014 ${meta.animationDescription} */
export default function ${name}({
  size = ${size},
  color = "${color}",
  strokeWidth = ${strokeWidth},
  trigger = "${trigger}",
  speed = ${speed},
}: ${name}Props) {
  const [clicked, setClicked] = useState(false);

${variantDecls.join("\n\n")}

  const animateState = ${animateExpr};

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="${meta.name} icon"
      initial="rest"
      animate={animateState}
      whileHover={trigger === "hover" ? "active" : undefined}
      whileInView={trigger === "inView" ? "active" : undefined}
      viewport={trigger === "inView" ? { once: true } : undefined}
      onClick={() => trigger === "click" && setClicked((c) => !c)}
    >
${elementMarkup.join("\n")}
    </motion.svg>
  );
}
`;
    const importPath = config?.importPath ?? DEFAULT_IMPORT_PATH;
    return {
      code,
      fileExtension: "tsx",
      importStatement: `import ${name} from "${importPath}/${name}";`,
      usageSnippet: `<${name} />`,
      dependencies: "npm install motion"
    };
  }
};

// lib/generators/vue.ts
var DEFAULT_VUE_IMPORT_PATH = "@/components/icons";
function resolveColor2(color) {
  return COLOR_VARIABLE_MAP[color.toLowerCase()] ?? color;
}
function kebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
function buildUsageAttributes(input) {
  const attrs = [];
  if (input.size !== DEFAULT_ICON_PROPS.size) attrs.push(`:size="${input.size}"`);
  if (input.color !== DEFAULT_ICON_PROPS.color) {
    attrs.push(`color="${resolveColor2(input.color)}"`);
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
function renderUsageTemplate(name, attrs) {
  if (attrs.length === 0) return `<${name} />`;
  if (attrs.length === 1) return `<${name} ${attrs[0]} />`;
  const lines = attrs.map((a) => `    ${a}`).join("\n");
  return `<${name}
${lines}
  />`;
}
function generateVueCode(input) {
  const name = toPascalCase(input.slug);
  const importPath = input.importPath ?? DEFAULT_VUE_IMPORT_PATH;
  const attrs = buildUsageAttributes(input);
  const importLine = `import ${name} from "${importPath}/${name}.vue";`;
  const jsxLine = renderUsageTemplate(name, attrs);
  const code = `<script setup lang="ts">
${importLine}
</script>

<template>
  ${jsxLine}
</template>`;
  return { code, importLine, jsxLine };
}
var vueUsage = {
  id: "vue",
  label: "Vue 3",
  language: "vue",
  dependencies: "none \u2014 uses CSS keyframe animations.",
  generate: generateVueCode
};
var TRANSFORM_PROPS2 = /* @__PURE__ */ new Set([
  "rotate",
  "scale",
  "translateX",
  "translateY"
]);
function cssFrameValue(step, value) {
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
      return `stroke-dashoffset: ${1 - value};`;
  }
}
function buildStepCss(step, className, continuous) {
  const values = stepValues(step);
  const percents = distributePercentages(values.length);
  const frames = values.map((v, i) => `  ${percents[i]}% { ${cssFrameValue(step, v)} }`).join("\n");
  const origin = step.origin ?? DEFAULT_ORIGIN;
  const isTransform = TRANSFORM_PROPS2.has(step.property);
  const isDraw = step.property === "pathLength";
  const lines = [
    isTransform ? "  transform-box: view-box;" : null,
    isTransform ? `  transform-origin: ${origin.x}px ${origin.y}px;` : null,
    isDraw ? "  stroke-dasharray: 1;" : null,
    `  animation-name: ${className};`,
    "  animation-fill-mode: forwards;",
    `  animation-timing-function: ${cssEasing(step.ease)};`,
    continuous || step.repeat ? "  animation-iteration-count: infinite;" : null
  ].filter(Boolean);
  const keyframes = `@keyframes ${className} {
${frames}
}`;
  const classBlock = `.${className} {
${lines.join("\n")}
}`;
  return `${keyframes}

${classBlock}`;
}
function vueDurationBinding(step) {
  const delay = step.delay && step.delay > 0 ? `; animation-delay: \${${step.delay} / speed}s` : "";
  return `:style="\`animation-duration: \${${step.duration} / speed}s${delay}\`"`;
}
function renderVueElement(elementKey, paths, spec, cssBlocks) {
  const data = paths[elementKey];
  const id = spec.elements[elementKey]?.id ?? elementKey;
  const continuous = isContinuous(spec);
  const steps = [
    ...spec.sequences.trigger ?? [],
    ...spec.sequences.continuous ?? []
  ].filter((s) => s.element === elementKey);
  const drawStep = steps.find((s) => s.property === "pathLength");
  let shapeAttrs = ` id="${id}"`;
  if (drawStep) {
    const className = `flux-${id}-draw`;
    cssBlocks.push(buildStepCss(drawStep, className, continuous));
    shapeAttrs += ` pathLength="1" :class="{ '${className}': isAnimating }" ${vueDurationBinding(drawStep)}`;
  }
  let markup = renderSvgElement(data, shapeAttrs);
  for (const step of steps.filter((s) => s.property !== "pathLength")) {
    const className = `flux-${id}-${step.property.toLowerCase()}`;
    cssBlocks.push(buildStepCss(step, className, continuous));
    markup = `<g :class="{ '${className}': isAnimating }" ${vueDurationBinding(step)}>
        ${markup.split("\n").join("\n        ")}
      </g>`;
  }
  return markup;
}
var VUE_PROPS_BLOCK = `interface Props {
  size?:        number
  color?:       string
  strokeWidth?: number
  trigger?:     'hover' | 'click' | 'inView' | 'autoplay' | 'none'
  speed?:       number
}`;
var vueGenerator = {
  framework: "vue",
  displayName: "Vue 3",
  fileExtension: "vue",
  generate(spec, paths, meta, config) {
    const name = componentName(meta.slug);
    const p = config?.props ?? {};
    const size = p.size ?? DEFAULT_ICON_PROPS.size;
    const color = p.color === "currentColor" || !p.color ? "currentColor" : p.color;
    const strokeWidth = p.strokeWidth ?? DEFAULT_ICON_PROPS.strokeWidth;
    const trigger = p.trigger ?? spec.defaultTrigger;
    const speed = p.speed ?? DEFAULT_ICON_PROPS.speed;
    const continuous = isContinuous(spec);
    const cssBlocks = [];
    const body = Object.keys(paths).map((key) => renderVueElement(key, paths, spec, cssBlocks)).join("\n      ");
    const autoStart = continuous || trigger === "autoplay";
    const styleBlock = cssBlocks.length > 0 ? `

<style scoped>
${cssBlocks.join("\n\n")}
</style>` : "";
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
      dependencies: "none \u2014 uses CSS animations only"
    };
  }
};

// lib/generators/index.ts
var GENERATORS = [
  reactUsage,
  vueUsage
];
var ICON_GENERATORS = {
  react: reactGenerator,
  vue: vueGenerator
};
function getIconGenerator(framework) {
  return ICON_GENERATORS[framework];
}

// icons/bell/paths.ts
var bellPaths = {
  body: { type: "path", d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" },
  clapper: { type: "path", d: "M10.3 21a1.94 1.94 0 0 0 3.4 0" }
};

// icons/bell/animation.spec.ts
var bellSpec = {
  elements: {
    body: { id: "bell-body", description: "Bell body" },
    clapper: { id: "bell-clapper", description: "Bell clapper" }
  },
  sequences: {
    trigger: [
      {
        element: "body",
        property: "rotate",
        values: [0, -20, 20, -10, 10, 0],
        duration: 0.6,
        ease: "easeInOut",
        origin: { x: 12, y: 4 }
      }
    ]
  },
  defaultTrigger: "hover"
};
var animation_spec_default = bellSpec;

// icons/bell/metadata.ts
var metadata = {
  name: "Bell",
  slug: "bell",
  category: "Notification",
  tags: ["bell", "notification", "alert", "ring", "alarm"],
  featured: true,
  description: "A notification bell with a swinging ring.",
  animationDescription: "The bell rocks back and forth around its top mount, settling to center."
};

// icons/check/paths.ts
var checkPaths = {
  checkmark: { type: "path", d: "M5 12.5l4.5 4.5L19 7" }
};

// icons/check/animation.spec.ts
var checkSpec = {
  elements: {
    checkmark: { id: "check-path", description: "Checkmark path" }
  },
  sequences: {
    trigger: [
      {
        element: "checkmark",
        property: "pathLength",
        from: 0,
        to: 1,
        duration: 0.4,
        ease: "easeOut"
      }
    ],
    mount: [
      {
        element: "checkmark",
        property: "pathLength",
        from: 0,
        to: 1,
        duration: 0.4,
        ease: "easeOut"
      }
    ]
  },
  defaultTrigger: "click"
};
var animation_spec_default2 = checkSpec;

// icons/check/metadata.ts
var metadata2 = {
  name: "Check",
  slug: "check",
  category: "Status",
  tags: ["check", "done", "success", "confirm", "tick", "complete"],
  featured: true,
  description: "A checkmark for success and confirmation states.",
  animationDescription: "The stroke draws itself from the bottom-left up to the top-right."
};

// icons/clock/paths.ts
var clockPaths = {
  face: { type: "circle", cx: 12, cy: 12, r: 9 },
  minuteHand: { type: "line", x1: 12, y1: 12, x2: 12, y2: 7.5 },
  hourHand: { type: "line", x1: 12, y1: 12, x2: 14.5, y2: 12 }
};

// icons/clock/animation.spec.ts
var clockSpec = {
  elements: {
    hourHand: { id: "clock-hour-hand", description: "Hour hand" },
    minuteHand: { id: "clock-minute-hand", description: "Minute hand" }
  },
  sequences: {
    trigger: [
      {
        element: "minuteHand",
        property: "rotate",
        values: [0, 360],
        duration: 0.8,
        ease: "easeInOut",
        origin: { x: 12, y: 12 }
      },
      {
        element: "hourHand",
        property: "rotate",
        values: [0, 30],
        duration: 0.8,
        ease: "easeInOut",
        origin: { x: 12, y: 12 }
      }
    ]
  },
  defaultTrigger: "hover"
};
var animation_spec_default3 = clockSpec;

// icons/clock/metadata.ts
var metadata3 = {
  name: "Clock",
  slug: "clock",
  category: "Time",
  tags: ["time", "watch", "schedule", "clock", "hour", "alarm"],
  featured: true,
  description: "A clock face with sweeping hour and minute hands.",
  animationDescription: "Both hands sweep a full rotation, the minute hand faster than the hour hand."
};

// icons/download/paths.ts
var downloadPaths = {
  // Arrow shaft + head as a single two-subpath stroke.
  arrow: { type: "path", d: "M12 3v12 M7 10l5 5 5-5" },
  baseline: { type: "path", d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }
};

// icons/download/animation.spec.ts
var downloadSpec = {
  elements: {
    arrow: { id: "download-arrow", description: "Download arrow" },
    baseline: { id: "download-baseline", description: "Baseline" }
  },
  sequences: {
    trigger: [
      {
        element: "arrow",
        property: "translateY",
        values: [0, 3, 0],
        duration: 0.4,
        ease: "easeInOut"
      },
      {
        element: "baseline",
        property: "opacity",
        values: [1, 0.3, 1],
        duration: 0.4,
        ease: "easeInOut"
      }
    ]
  },
  defaultTrigger: "hover"
};
var animation_spec_default4 = downloadSpec;

// icons/download/metadata.ts
var metadata4 = {
  name: "Download",
  slug: "download",
  category: "Interface",
  tags: ["download", "save", "import", "arrow", "export"],
  featured: false,
  description: "A download arrow with a baseline tray.",
  animationDescription: "The arrow dips down and bounces back while the baseline pulses."
};

// icons/heart/paths.ts
var heartPaths = {
  heart: {
    type: "path",
    d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z"
  }
};

// icons/heart/animation.spec.ts
var heartSpec = {
  elements: {
    heart: { id: "heart-shape", description: "Heart shape" }
  },
  sequences: {
    trigger: [
      {
        element: "heart",
        property: "scale",
        values: [1, 1.2, 0.95, 1.1, 1],
        duration: 0.5,
        ease: "spring",
        origin: { x: 12, y: 12 }
      }
    ]
  },
  defaultTrigger: "hover"
};
var animation_spec_default5 = heartSpec;

// icons/heart/metadata.ts
var metadata5 = {
  name: "Heart",
  slug: "heart",
  category: "Social",
  tags: ["heart", "like", "love", "favorite", "save"],
  featured: true,
  description: "A heart for likes, favorites, and saves.",
  animationDescription: "A springy heartbeat pulse while the stroke briefly thickens."
};

// icons/loader/paths.ts
var loaderPaths = {
  arc: { type: "path", d: "M21 12a9 9 0 1 1-6.219-8.56" }
};

// icons/loader/animation.spec.ts
var loaderSpec = {
  elements: {
    arc: { id: "loader-arc", description: "Spinning arc" }
  },
  sequences: {
    continuous: [
      {
        element: "arc",
        property: "rotate",
        from: 0,
        to: 360,
        duration: 1,
        ease: "linear",
        repeat: true,
        origin: { x: 12, y: 12 }
      }
    ]
  },
  defaultTrigger: "autoplay",
  alwaysLoop: true
};
var animation_spec_default6 = loaderSpec;

// icons/loader/metadata.ts
var metadata6 = {
  name: "Loader",
  slug: "loader",
  category: "Status",
  tags: ["loader", "loading", "spinner", "progress", "wait"],
  featured: true,
  description: "A spinner for loading and pending states.",
  animationDescription: "Continuously rotates; hovering doubles the spin speed."
};

// icons/search/paths.ts
var searchPaths = {
  lens: { type: "circle", cx: 11, cy: 11, r: 7 },
  handle: { type: "line", x1: 21, y1: 21, x2: 16.65, y2: 16.65 }
};

// icons/search/animation.spec.ts
var searchSpec = {
  elements: {
    lens: { id: "search-lens", description: "Search lens circle" },
    handle: { id: "search-handle", description: "Search handle line" }
  },
  sequences: {
    trigger: [
      {
        element: "lens",
        property: "scale",
        values: [1, 1.1, 1],
        duration: 0.2,
        ease: "easeOut",
        origin: { x: 11, y: 11 }
      },
      {
        element: "lens",
        property: "translateX",
        values: [0, -2, 2, -1, 0],
        duration: 0.4,
        delay: 0.15,
        ease: "easeInOut"
      }
    ]
  },
  defaultTrigger: "hover"
};
var animation_spec_default7 = searchSpec;

// icons/search/metadata.ts
var metadata7 = {
  name: "Search",
  slug: "search",
  category: "Interface",
  tags: ["search", "find", "magnifier", "lookup", "explore"],
  featured: false,
  description: "A magnifying glass for search and discovery.",
  animationDescription: "The lens pulses, then the whole glass jiggles left-right once."
};

// icons/user/paths.ts
var userPaths = {
  shape: {
    type: "path",
    d: "M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6Z"
  }
};

// icons/user/animation.spec.ts
var userSpec = {
  elements: {
    shape: { id: "user-shape", description: "TODO: describe this element" }
  },
  sequences: {
    trigger: [
      {
        element: "shape",
        property: "scale",
        values: [1, 1.12, 1],
        duration: 0.5,
        ease: "easeInOut",
        origin: { x: 12, y: 12 }
      }
    ]
  },
  defaultTrigger: "hover"
};
var animation_spec_default8 = userSpec;

// icons/user/metadata.ts
var metadata8 = {
  name: "User",
  slug: "user",
  category: "Uncategorized",
  tags: [],
  featured: false,
  description: "TODO: one-line description for User.",
  animationDescription: "TODO: describe what the animation does."
};

// lib/icon-sources.generated.ts
var ICON_SOURCES = {
  "bell": { paths: bellPaths, spec: animation_spec_default, metadata },
  "check": { paths: checkPaths, spec: animation_spec_default2, metadata: metadata2 },
  "clock": { paths: clockPaths, spec: animation_spec_default3, metadata: metadata3 },
  "download": { paths: downloadPaths, spec: animation_spec_default4, metadata: metadata4 },
  "heart": { paths: heartPaths, spec: animation_spec_default5, metadata: metadata5 },
  "loader": { paths: loaderPaths, spec: animation_spec_default6, metadata: metadata6 },
  "search": { paths: searchPaths, spec: animation_spec_default7, metadata: metadata7 },
  "user": { paths: userPaths, spec: animation_spec_default8, metadata: metadata8 }
};

// lib/icon-sources.ts
function getIconSource(slug) {
  return ICON_SOURCES[slug];
}
function listIconSlugs() {
  return Object.keys(ICON_SOURCES).sort();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GENERATORS,
  ICON_GENERATORS,
  ICON_SOURCES,
  generateReactCode,
  generateVueCode,
  getIconGenerator,
  getIconSource,
  listIconSlugs,
  reactGenerator,
  vueGenerator
});
