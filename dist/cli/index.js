#!/usr/bin/env node
"use strict";

// cli/index.ts
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");

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

// lib/icon-sources.generated.ts
var ICON_SOURCES = {
  "bell": { paths: bellPaths, spec: animation_spec_default, metadata },
  "check": { paths: checkPaths, spec: animation_spec_default2, metadata: metadata2 },
  "clock": { paths: clockPaths, spec: animation_spec_default3, metadata: metadata3 },
  "download": { paths: downloadPaths, spec: animation_spec_default4, metadata: metadata4 },
  "heart": { paths: heartPaths, spec: animation_spec_default5, metadata: metadata5 },
  "loader": { paths: loaderPaths, spec: animation_spec_default6, metadata: metadata6 },
  "search": { paths: searchPaths, spec: animation_spec_default7, metadata: metadata7 }
};

// lib/icon-sources.ts
function getIconSource(slug) {
  return ICON_SOURCES[slug];
}
function listIconSlugs() {
  return Object.keys(ICON_SOURCES).sort();
}

// lib/utils.ts
function roundTo(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
function slugify(input) {
  return input.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
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

// lib/generators/shared.ts
function componentName(slug) {
  return toPascalCase(slug);
}
function snakeCase(slug) {
  return slug.replace(/-+/g, "_").toLowerCase();
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
function reanimatedEasing(ease) {
  switch (ease) {
    case "linear":
      return "Easing.linear";
    case "easeIn":
      return "Easing.in(Easing.ease)";
    case "easeOut":
      return "Easing.out(Easing.ease)";
    case "easeInOut":
      return "Easing.inOut(Easing.ease)";
    case "spring":
      return "Easing.out(Easing.back(2))";
    case "bounce":
      return "Easing.bounce";
  }
}
function flutterCurve(ease) {
  switch (ease) {
    case "linear":
      return "Curves.linear";
    case "easeIn":
      return "Curves.easeIn";
    case "easeOut":
      return "Curves.easeOut";
    case "easeInOut":
      return "Curves.easeInOut";
    case "spring":
      return "Curves.elasticOut";
    case "bounce":
      return "Curves.bounceOut";
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
function flutterColor(color) {
  const hex = color.replace("#", "").trim();
  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    return `const Color(0xFF${hex.toUpperCase()})`;
  }
  if (/^[0-9a-fA-F]{8}$/.test(hex)) {
    return `const Color(0x${hex.toUpperCase()})`;
  }
  return "Colors.black";
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

// lib/generators/react-native.ts
function mapTrigger(trigger) {
  if (trigger === "autoplay" || trigger === "inView") return "autoplay";
  if (trigger === "none") return "none";
  return "press";
}
var RN_PROP = {
  rotate: "rotation",
  scale: "scale",
  translateX: "translateX",
  translateY: "translateY",
  opacity: "opacity",
  pathLength: "strokeDashoffset"
};
var RN_DASH = 48;
function sharedName(elementKey, property) {
  const el = elementKey.replace(/[^a-zA-Z0-9]/g, "");
  return `${el}${property.charAt(0).toUpperCase()}${property.slice(1)}`;
}
function buildDriver(step) {
  const values = stepValues(step);
  const easing = reanimatedEasing(step.ease);
  const segments = values.slice(1).map(
    (v) => `withTiming(${v}, { duration: (${step.duration} / speed) * 1000 / ${values.length - 1}, easing: ${easing} })`
  );
  let expr = segments.length === 1 ? segments[0] : `withSequence(
      ${segments.join(",\n      ")},
    )`;
  if (step.repeat) expr = `withRepeat(${expr}, -1)`;
  if (step.delay && step.delay > 0) {
    expr = `withDelay((${step.delay} / speed) * 1000, ${expr})`;
  }
  return expr;
}
function svgTag(data, attrs) {
  switch (data.type) {
    case "path":
      return `Path${attrs} d="${data.d}"`;
    case "circle":
      return `Circle${attrs} cx={${data.cx}} cy={${data.cy}} r={${data.r}}`;
    case "line":
      return `Line${attrs} x1={${data.x1}} y1={${data.y1}} x2={${data.x2}} y2={${data.y2}}`;
    case "polyline":
      return `Polyline${attrs} points="${data.points}"`;
  }
}
function buildRnElement(elementKey, paths, spec) {
  const data = paths[elementKey];
  const steps = [
    ...spec.sequences.trigger ?? [],
    ...spec.sequences.continuous ?? []
  ].filter((s) => s.element === elementKey);
  const stroke = ` stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none"`;
  if (steps.length === 0) {
    return {
      markup: `        <${svgTag(data, stroke)} />`,
      shared: [],
      animatedProps: [],
      drivers: [],
      animated: false
    };
  }
  const shared = [];
  const drivers = [];
  const propEntries = [];
  let origin = DEFAULT_ORIGIN;
  let dash = "";
  for (const step of steps) {
    const sv = sharedName(elementKey, step.property);
    const initial = stepValues(step)[0];
    shared.push(`  const ${sv} = useSharedValue(${initial});`);
    drivers.push(`    ${sv}.value = ${buildDriver(step)};`);
    const rnProp = RN_PROP[step.property];
    propEntries.push(`${rnProp}: ${sv}.value`);
    if (step.origin) origin = step.origin;
    if (step.property === "pathLength") dash = ` strokeDasharray={${RN_DASH}}`;
  }
  const apName = `${elementKey.replace(/[^a-zA-Z0-9]/g, "")}Props`;
  const animatedProps = [
    `  const ${apName} = useAnimatedProps(() => ({ ${propEntries.join(", ")} }));`
  ];
  const isDraw = steps.some((s) => s.property === "pathLength");
  if (isDraw && data.type === "path") {
    return {
      markup: `        <AnimatedPath animatedProps={${apName}}${stroke}${dash} d="${data.d}" />`,
      shared,
      animatedProps,
      drivers,
      animated: true
    };
  }
  const originAttrs = ` originX={${origin.x}} originY={${origin.y}}`;
  return {
    markup: `        <AnimatedG animatedProps={${apName}}${originAttrs}>
          <${svgTag(data, stroke)} />
        </AnimatedG>`,
    shared,
    animatedProps,
    drivers,
    animated: true
  };
}
var reactNativeGenerator = {
  framework: "react-native",
  displayName: "React Native",
  fileExtension: "tsx",
  generate(spec, paths, meta, config) {
    const name = componentName(meta.slug);
    const p = config?.props ?? {};
    const size = p.size ?? DEFAULT_ICON_PROPS.size;
    const color = p.color && p.color !== "currentColor" ? p.color : "#000000";
    const strokeWidth = p.strokeWidth ?? DEFAULT_ICON_PROPS.strokeWidth;
    const trigger = mapTrigger(p.trigger ?? spec.defaultTrigger);
    const speed = p.speed ?? DEFAULT_ICON_PROPS.speed;
    const continuous = isContinuous(spec);
    const elements = Object.keys(paths).map(
      (key) => buildRnElement(key, paths, spec)
    );
    const usedTags = /* @__PURE__ */ new Set();
    for (const key of Object.keys(paths)) {
      const t = paths[key].type;
      usedTags.add(t.charAt(0).toUpperCase() + t.slice(1));
    }
    const shared = elements.flatMap((e) => e.shared);
    const animatedProps = elements.flatMap((e) => e.animatedProps);
    const drivers = elements.flatMap((e) => e.drivers);
    const markup = elements.map((e) => e.markup).join("\n");
    const usesG = markup.includes("AnimatedG");
    const usesPath = markup.includes("AnimatedPath");
    const needsG = usesG && !usedTags.has("G");
    const namedImports = [...Array.from(usedTags), needsG ? "G" : null].filter(
      Boolean
    );
    const svgImports = namedImports.join(", ");
    const animatedDecls = [
      usesG ? `const AnimatedG = Animated.createAnimatedComponent(G);` : null,
      usesPath ? `const AnimatedPath = Animated.createAnimatedComponent(Path);` : null
    ].filter(Boolean);
    const autoStart = continuous || trigger === "autoplay";
    const playEffect = autoStart ? `
  useEffect(() => {
    play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
` : "";
    const code = `import React${autoStart ? ", { useEffect }" : ""} from 'react';
import { Pressable } from 'react-native';
import Svg, { ${svgImports} } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withSequence,
  withRepeat,
  withDelay,
  Easing,
} from 'react-native-reanimated';

${animatedDecls.join("\n")}

interface ${name}Props {
  size?: number;
  color?: string;
  strokeWidth?: number;
  trigger?: 'press' | 'autoplay' | 'none';
  speed?: number;
}

export default function ${name}({
  size = ${size},
  color = '${color}',
  strokeWidth = ${strokeWidth},
  trigger = '${trigger}',
  speed = ${speed},
}: ${name}Props) {
${shared.join("\n")}

${animatedProps.join("\n")}

  function play() {
${drivers.join("\n")}
  }
${playEffect}
  return (
    <Pressable onPress={() => trigger === 'press' && play()}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
${markup}
      </Svg>
    </Pressable>
  );
}
`;
    const importStatement = `import ${name} from './components/icons/${name}';`;
    const usageSnippet = `<${name} size={32} />`;
    return {
      code,
      fileExtension: "tsx",
      importStatement,
      usageSnippet,
      dependencies: "npm install react-native-reanimated react-native-svg"
    };
  }
};

// lib/generators/flutter-path-parser.ts
var ARG_COUNT = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  T: 2,
  A: 7,
  Z: 0
};
function parseCommands(d) {
  const out = [];
  const n = d.length;
  let i = 0;
  const isCmd = (c) => /[a-zA-Z]/.test(c);
  const skipSep = () => {
    while (i < n && /[\s,]/.test(d[i])) i++;
  };
  const readNumber = () => {
    skipSep();
    const start = i;
    if (d[i] === "+" || d[i] === "-") i++;
    while (i < n && /[0-9]/.test(d[i])) i++;
    if (d[i] === ".") {
      i++;
      while (i < n && /[0-9]/.test(d[i])) i++;
    }
    if (d[i] === "e" || d[i] === "E") {
      i++;
      if (d[i] === "+" || d[i] === "-") i++;
      while (i < n && /[0-9]/.test(d[i])) i++;
    }
    return parseFloat(d.slice(start, i));
  };
  const readFlag = () => {
    skipSep();
    const c = d[i];
    i++;
    return c === "1" ? 1 : 0;
  };
  let lastCmd = "";
  while (i < n) {
    skipSep();
    if (i >= n) break;
    let cmd;
    if (isCmd(d[i])) {
      cmd = d[i];
      i++;
    } else {
      if (!lastCmd) break;
      cmd = lastCmd === "M" ? "L" : lastCmd === "m" ? "l" : lastCmd;
    }
    const up = cmd.toUpperCase();
    if (up === "Z") {
      out.push({ cmd, args: [] });
    } else if (up === "A") {
      const rx = readNumber();
      const ry = readNumber();
      const rot = readNumber();
      const large = readFlag();
      const sweep = readFlag();
      const x = readNumber();
      const y = readNumber();
      out.push({ cmd, args: [rx, ry, rot, large, sweep, x, y] });
    } else {
      const args = [];
      for (let k = 0; k < ARG_COUNT[up]; k++) args.push(readNumber());
      out.push({ cmd, args });
    }
    lastCmd = cmd;
  }
  return out;
}
function f(value) {
  return Number.isInteger(value) ? String(value) : String(roundTo(value, 4));
}
function svgPathToFlutter(d, pathVar = "path") {
  const commands = parseCommands(d);
  const out = [];
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  let prevCtrlX = 0;
  let prevCtrlY = 0;
  let prevUp = "";
  for (const { cmd, args } of commands) {
    const rel2 = cmd === cmd.toLowerCase() && cmd !== cmd.toUpperCase();
    const up = cmd.toUpperCase();
    switch (up) {
      case "M": {
        let [x, y] = args;
        if (rel2) {
          x += cx;
          y += cy;
        }
        cx = x;
        cy = y;
        sx = x;
        sy = y;
        out.push(`${pathVar}.moveTo(${f(x)}, ${f(y)});`);
        break;
      }
      case "L": {
        let [x, y] = args;
        if (rel2) {
          x += cx;
          y += cy;
        }
        cx = x;
        cy = y;
        out.push(`${pathVar}.lineTo(${f(x)}, ${f(y)});`);
        break;
      }
      case "H": {
        let x = args[0];
        if (rel2) x += cx;
        cx = x;
        out.push(`${pathVar}.lineTo(${f(cx)}, ${f(cy)});`);
        break;
      }
      case "V": {
        let y = args[0];
        if (rel2) y += cy;
        cy = y;
        out.push(`${pathVar}.lineTo(${f(cx)}, ${f(cy)});`);
        break;
      }
      case "C": {
        let [x1, y1, x2, y2, x, y] = args;
        if (rel2) {
          x1 += cx;
          y1 += cy;
          x2 += cx;
          y2 += cy;
          x += cx;
          y += cy;
        }
        out.push(
          `${pathVar}.cubicTo(${f(x1)}, ${f(y1)}, ${f(x2)}, ${f(y2)}, ${f(x)}, ${f(y)});`
        );
        prevCtrlX = x2;
        prevCtrlY = y2;
        cx = x;
        cy = y;
        break;
      }
      case "S": {
        let [x2, y2, x, y] = args;
        if (rel2) {
          x2 += cx;
          y2 += cy;
          x += cx;
          y += cy;
        }
        const reflect = prevUp === "C" || prevUp === "S";
        const x1 = reflect ? 2 * cx - prevCtrlX : cx;
        const y1 = reflect ? 2 * cy - prevCtrlY : cy;
        out.push(
          `${pathVar}.cubicTo(${f(x1)}, ${f(y1)}, ${f(x2)}, ${f(y2)}, ${f(x)}, ${f(y)});`
        );
        prevCtrlX = x2;
        prevCtrlY = y2;
        cx = x;
        cy = y;
        break;
      }
      case "Q": {
        let [x1, y1, x, y] = args;
        if (rel2) {
          x1 += cx;
          y1 += cy;
          x += cx;
          y += cy;
        }
        out.push(
          `${pathVar}.quadraticBezierTo(${f(x1)}, ${f(y1)}, ${f(x)}, ${f(y)});`
        );
        prevCtrlX = x1;
        prevCtrlY = y1;
        cx = x;
        cy = y;
        break;
      }
      case "T": {
        let [x, y] = args;
        if (rel2) {
          x += cx;
          y += cy;
        }
        const reflect = prevUp === "Q" || prevUp === "T";
        const x1 = reflect ? 2 * cx - prevCtrlX : cx;
        const y1 = reflect ? 2 * cy - prevCtrlY : cy;
        out.push(
          `${pathVar}.quadraticBezierTo(${f(x1)}, ${f(y1)}, ${f(x)}, ${f(y)});`
        );
        prevCtrlX = x1;
        prevCtrlY = y1;
        cx = x;
        cy = y;
        break;
      }
      case "A": {
        const [rx, ry, rot, large, sweep] = args;
        let x = args[5];
        let y = args[6];
        if (rel2) {
          x += cx;
          y += cy;
        }
        const rad = rot * Math.PI / 180;
        out.push(
          `${pathVar}.arcToPoint(Offset(${f(x)}, ${f(y)}), radius: Radius.elliptical(${f(rx)}, ${f(ry)}), rotation: ${f(rad)}, largeArc: ${large ? "true" : "false"}, clockwise: ${sweep ? "true" : "false"});`
        );
        cx = x;
        cy = y;
        break;
      }
      case "Z": {
        out.push(`${pathVar}.close();`);
        cx = sx;
        cy = sy;
        break;
      }
    }
    prevUp = up;
  }
  return out;
}

// lib/generators/flutter.ts
function num(value) {
  return Number.isInteger(value) ? `${value}.0` : String(value);
}
function fieldName(elementKey, property) {
  const el = elementKey.replace(/[^a-zA-Z0-9]/g, "");
  return `${el}${property.charAt(0).toUpperCase()}${property.slice(1)}`;
}
function buildAnimationInit(field, step, totalDuration) {
  const values = stepValues(step);
  const items = values.length === 2 ? `      TweenSequenceItem(tween: Tween(begin: ${num(values[0])}, end: ${num(values[1])}), weight: 1),` : values.slice(1).map(
    (v, i) => `      TweenSequenceItem(tween: Tween(begin: ${num(values[i])}, end: ${num(v)}), weight: 1),`
  ).join("\n");
  const delay = step.delay ?? 0;
  const start = totalDuration > 0 ? delay / totalDuration : 0;
  const end = totalDuration > 0 ? (delay + step.duration) / totalDuration : 1;
  const curve = start <= 0 && end >= 1 ? flutterCurve(step.ease) : `Interval(${round4(start)}, ${round4(end)}, curve: ${flutterCurve(step.ease)})`;
  return `    _${field} = TweenSequence<double>([
${items}
    ]).animate(CurvedAnimation(parent: _controller, curve: ${curve}));`;
}
function round4(n) {
  return String(Math.round(n * 1e4) / 1e4);
}
function buildPainterElement(elementKey, data, spec) {
  const steps = [
    ...spec.sequences.trigger ?? [],
    ...spec.sequences.continuous ?? []
  ].filter((s) => s.element === elementKey);
  const transforms = steps.filter(
    (s) => ["rotate", "scale", "translateX", "translateY"].includes(s.property)
  );
  const opacityStep = steps.find((s) => s.property === "opacity");
  const drawStep = steps.find((s) => s.property === "pathLength");
  const origin = transforms.find((s) => s.origin)?.origin ?? DEFAULT_ORIGIN;
  let paintVar = "paint";
  const lines = [];
  if (opacityStep) {
    paintVar = `${elementKey}Paint`;
    const field = fieldName(elementKey, "opacity");
    lines.push(
      `    final ${paintVar} = Paint()
      ..color = color.withOpacity(${field})
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;`
    );
  }
  const hasTransform = transforms.length > 0;
  if (hasTransform) {
    lines.push("    canvas.save();");
    lines.push(`    canvas.translate(${num(origin.x)}, ${num(origin.y)});`);
    for (const t of transforms) {
      const field = fieldName(elementKey, t.property);
      if (t.property === "rotate") {
        lines.push(`    canvas.rotate(${field} * math.pi / 180);`);
      } else if (t.property === "scale") {
        lines.push(`    canvas.scale(${field});`);
      }
    }
    lines.push(`    canvas.translate(${num(-origin.x)}, ${num(-origin.y)});`);
    for (const t of transforms) {
      const field = fieldName(elementKey, t.property);
      if (t.property === "translateX") {
        lines.push(`    canvas.translate(${field}, 0);`);
      } else if (t.property === "translateY") {
        lines.push(`    canvas.translate(0, ${field});`);
      }
    }
  }
  lines.push(...drawShape(elementKey, data, paintVar, drawStep));
  if (hasTransform) lines.push("    canvas.restore();");
  return lines.join("\n");
}
function drawShape(elementKey, data, paintVar, drawStep) {
  if (data.type === "path") {
    const pathVar2 = `${elementKey}Path`;
    const stmts2 = svgPathToFlutter(data.d, pathVar2).map((s) => `    ${s}`);
    const decl = [`    final ${pathVar2} = Path();`, ...stmts2];
    if (drawStep) {
      const field = fieldName(elementKey, "pathLength");
      decl.push(
        `    for (final metric in ${pathVar2}.computeMetrics()) {`,
        `      canvas.drawPath(metric.extractPath(0, metric.length * ${field}), ${paintVar});`,
        "    }"
      );
    } else {
      decl.push(`    canvas.drawPath(${pathVar2}, ${paintVar});`);
    }
    return decl;
  }
  if (data.type === "circle") {
    return [
      `    canvas.drawCircle(Offset(${num(data.cx)}, ${num(data.cy)}), ${num(data.r)}, ${paintVar});`
    ];
  }
  if (data.type === "line") {
    return [
      `    canvas.drawLine(Offset(${num(data.x1)}, ${num(data.y1)}), Offset(${num(data.x2)}, ${num(data.y2)}), ${paintVar});`
    ];
  }
  const pathVar = `${elementKey}Path`;
  const pts = data.points.trim().split(/\s+/).map((pair) => pair.split(",").map(Number));
  const stmts = pts.map(
    ([x, y], i) => i === 0 ? `    ${pathVar}.moveTo(${num(x)}, ${num(y)});` : `    ${pathVar}.lineTo(${num(x)}, ${num(y)});`
  );
  return [
    `    final ${pathVar} = Path();`,
    ...stmts,
    `    canvas.drawPath(${pathVar}, ${paintVar});`
  ];
}
var flutterGenerator = {
  framework: "flutter",
  displayName: "Flutter",
  fileExtension: "dart",
  generate(spec, paths, meta, config) {
    const name = `${componentName(meta.slug)}Icon`;
    const state = `_${name}State`;
    const painter = `_${componentName(meta.slug)}Painter`;
    const p = config?.props ?? {};
    const size = p.size ?? DEFAULT_ICON_PROPS.size;
    const colorLiteral = p.color && p.color !== "currentColor" ? flutterColor(p.color) : "Colors.black";
    const strokeWidth = p.strokeWidth ?? DEFAULT_ICON_PROPS.strokeWidth;
    const continuous = isContinuous(spec);
    const animSteps = [
      ...spec.sequences.trigger ?? [],
      ...spec.sequences.continuous ?? []
    ];
    const totalDuration = Math.max(
      1e-4,
      ...animSteps.map((s) => (s.delay ?? 0) + s.duration)
    );
    const totalMs = Math.round(totalDuration * 1e3);
    const fields = animSteps.map((s) => fieldName(s.element, s.property));
    const fieldDecls = fields.map((fld) => `  late Animation<double> _${fld};`).join("\n");
    const inits = animSteps.map((s) => buildAnimationInit(fieldName(s.element, s.property), s, totalDuration)).join("\n");
    const repeatOrIdle = continuous ? "    _controller.repeat();" : "    // Call _play() (e.g. on tap) to run the animation.";
    const painterFieldDecls = fields.map((fld) => `  final double ${fld};`).join("\n");
    const painterCtorArgs = ["color", "strokeWidth", ...fields].map((a) => `    required this.${a},`).join("\n");
    const painterCallArgs = [
      "              color: widget.color,",
      "              strokeWidth: widget.strokeWidth,",
      ...fields.map((fld) => `              ${fld}: _${fld}.value,`)
    ].join("\n");
    const shouldRepaint = ["color", "strokeWidth", ...fields].map((a) => `old.${a} != ${a}`).join(" ||\n      ");
    const painterBody = Object.keys(paths).map((key) => buildPainterElement(key, paths[key], spec)).join("\n\n");
    const code = `import 'package:flutter/material.dart';
import 'dart:math' as math;

/// ${meta.name} \u2014 ${meta.animationDescription}
class ${name} extends StatefulWidget {
  final double size;
  final Color color;
  final double strokeWidth;
  final double speed;

  const ${name}({
    super.key,
    this.size = ${num(size)},
    this.color = ${colorLiteral},
    this.strokeWidth = ${num(strokeWidth)},
    this.speed = 1.0,
  });

  @override
  State<${name}> createState() => ${state}();
}

class ${state} extends State<${name}> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
${fieldDecls}

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: (${totalMs} / widget.speed).round()),
    );
${inits}
${repeatOrIdle}
  }

  void _play() => _controller.forward(from: 0);

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _play,
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return CustomPaint(
            size: Size(widget.size, widget.size),
            painter: ${painter}(
${painterCallArgs}
            ),
          );
        },
      ),
    );
  }
}

class ${painter} extends CustomPainter {
  final Color color;
  final double strokeWidth;
${painterFieldDecls}

  ${painter}({
${painterCtorArgs}
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    canvas.scale(size.width / 24.0);

${painterBody}
  }

  @override
  bool shouldRepaint(${painter} old) =>
      ${shouldRepaint};
}
`;
    const file = snakeCase(meta.slug);
    return {
      code,
      fileExtension: "dart",
      importStatement: `import 'icons/${file}_icon.dart';`,
      usageSnippet: `${name}()`,
      dependencies: "none \u2014 uses Flutter AnimationController"
    };
  }
};

// lib/generators/index.ts
var ICON_GENERATORS = {
  react: reactGenerator,
  vue: vueGenerator,
  "react-native": reactNativeGenerator,
  flutter: flutterGenerator
};
function getIconGenerator(framework) {
  return ICON_GENERATORS[framework];
}

// cli/index.ts
var VERSION = true ? "0.1.0-beta.2" : "0.0.0";
var supportsColor = process.stdout.isTTY && process.env.NO_COLOR === void 0;
var paint = (code, s) => supportsColor ? `\x1B[${code}m${s}\x1B[0m` : s;
var green = (s) => paint("32", s);
var red = (s) => paint("31", s);
var cyan = (s) => paint("36", s);
var yellow = (s) => paint("33", s);
var dim = (s) => paint("2", s);
var bold = (s) => paint("1", s);
function fail(message) {
  console.error(red(`\u2717 ${message}`));
  process.exit(1);
}
function resolveFramework(input) {
  const key = input.trim().toLowerCase();
  const aliases = {
    react: "react",
    next: "react",
    "next.js": "react",
    nextjs: "react",
    vue: "vue",
    vue3: "vue",
    "react-native": "react-native",
    "react native": "react-native",
    reactnative: "react-native",
    rn: "react-native",
    flutter: "flutter",
    dart: "flutter"
  };
  return aliases[key];
}
function outputPath(slug, framework, ext, outDir) {
  const isFlutter = framework === "flutter";
  const fileBase = isFlutter ? `${slug.replace(/-+/g, "_")}_icon` : toPascalCase(slug);
  const dir = outDir ?? (isFlutter ? "lib/icons" : "components/icons");
  return (0, import_node_path.join)(process.cwd(), dir, `${fileBase}.${ext}`);
}
function rel(absPath) {
  return absPath.replace(`${process.cwd()}\\`, "").replace(`${process.cwd()}/`, "").replace(/\\/g, "/");
}
function parseArgs(argv) {
  const args = {
    icons: [],
    framework: "react",
    force: false,
    help: false,
    version: false
  };
  let frameworkRaw = "react";
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") args.help = true;
    else if (a === "--version" || a === "-v") args.version = true;
    else if (a === "--force") args.force = true;
    else if (a === "--framework" || a === "-f") frameworkRaw = argv[++i] ?? "";
    else if (a.startsWith("--framework=")) frameworkRaw = a.slice("--framework=".length);
    else if (a === "--out" || a === "-o") args.outDir = argv[++i];
    else if (a.startsWith("--out=")) args.outDir = a.slice("--out=".length);
    else if (a.startsWith("-")) fail(`Unknown option "${a}". Run \`fluxicons --help\`.`);
    else if (!args.command) args.command = a;
    else args.icons.push(a);
  }
  const resolved = resolveFramework(frameworkRaw);
  if (!resolved) {
    fail(
      `Unknown framework "${frameworkRaw}". Available: ${Object.keys(ICON_GENERATORS).join(", ")}.`
    );
  }
  args.framework = resolved;
  return args;
}
function printHelp() {
  console.log(`
${bold("FluxIcons")} ${dim(`v${VERSION}`)} \u2014 animated icons for every framework

${bold("Usage")}
  ${cyan("npx @zammadnasir/fluxicons add <icon...> [options]")}

${bold("Commands")}
  ${cyan("add <icon...>")}   Add one or more icons to your project
  ${cyan("list")}            List every available icon

${bold("Options")}
  ${cyan("-f, --framework")}   react | vue | react-native | flutter ${dim("(default: react)")}
  ${cyan("-o, --out")}         Output directory ${dim("(default: components/icons, or lib/icons for Flutter)")}
  ${cyan("    --force")}       Overwrite existing files
  ${cyan("-h, --help")}        Show this help
  ${cyan("-v, --version")}     Show the version

${bold("Examples")}
  ${dim("$")} npx @zammadnasir/fluxicons add bell
  ${dim("$")} npx @zammadnasir/fluxicons add clock heart --framework vue
  ${dim("$")} npx @zammadnasir/fluxicons add bell --framework flutter
  ${dim("$")} npx @zammadnasir/fluxicons add download --out src/icons
`);
}
function printList() {
  const slugs = listIconSlugs();
  console.log(`
${bold(`${slugs.length} icons available`)}
`);
  for (const slug of slugs) {
    const meta = ICON_SOURCES[slug].metadata;
    console.log(`  ${cyan(slug.padEnd(12))} ${dim(meta.description)}`);
  }
  console.log(`
${dim("Add one with:")} npx @zammadnasir/fluxicons add ${slugs[0]}
`);
}
function add(args) {
  if (args.icons.length === 0) {
    fail("No icon specified. Try `fluxicons add bell` or `fluxicons list`.");
  }
  const generator = getIconGenerator(args.framework);
  if (!generator) {
    fail(`Unknown framework "${args.framework}".`);
  }
  let written = 0;
  let depsNote = "";
  for (const name of args.icons) {
    const slug = slugify(name);
    const source = getIconSource(slug);
    if (!source) {
      console.error(
        red(`\u2717 Unknown icon "${name}".`) + dim(" Run `fluxicons list` to see what's available.")
      );
      continue;
    }
    const output = generator.generate(source.spec, source.paths, source.metadata);
    const dest = outputPath(slug, args.framework, output.fileExtension, args.outDir);
    if ((0, import_node_fs.existsSync)(dest) && !args.force) {
      console.log(
        yellow(`\u2022 Skipped ${rel(dest)}`) + dim(" (already exists \u2014 use --force to overwrite)")
      );
      continue;
    }
    (0, import_node_fs.mkdirSync)((0, import_node_path.dirname)(dest), { recursive: true });
    (0, import_node_fs.writeFileSync)(dest, output.code);
    console.log(green(`\u2713 ${rel(dest)}`) + dim(`  (${generator.displayName})`));
    written++;
    depsNote = output.dependencies;
  }
  if (written > 0) {
    console.log();
    console.log(dim("Dependencies: ") + depsNote);
    console.log(dim("Done.") + ` Added ${written} icon${written === 1 ? "" : "s"}.`);
  }
}
function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.version) {
    console.log(VERSION);
    return;
  }
  if (args.help || !args.command) {
    printHelp();
    return;
  }
  switch (args.command) {
    case "add":
      add(args);
      break;
    case "list":
    case "ls":
      printList();
      break;
    default:
      fail(`Unknown command "${args.command}". Run \`fluxicons --help\`.`);
  }
}
main();
