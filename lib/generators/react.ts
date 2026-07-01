import type { AnimationSpec, AnimationStep, IconPaths, PathData } from "@/lib/animation-spec";
import type { IconMetadata } from "@/lib/icon-registry";
import { toPascalCase } from "@/lib/utils";
import {
  COLOR_VARIABLE_MAP,
  DEFAULT_ICON_PROPS,
  DEFAULT_IMPORT_PATH,
  type GeneratedFile,
  type GeneratorConfig,
  type GeneratorInput,
  type GeneratorInterface,
  type GeneratorOutput,
  type IconGenerator,
} from "./types";
import {
  componentName,
  DEFAULT_ORIGIN,
  framerEasing,
  isContinuous,
  perspectiveFor,
  stepValues,
  uses3DTransform,
} from "./shared";

/* -------------------------------------------------------------------------- */
/* Usage snippet (playground code panel)                                      */
/* -------------------------------------------------------------------------- */

function resolveColor(color: string): string {
  return COLOR_VARIABLE_MAP[color.toLowerCase()] ?? color;
}

type Attr = { key: string; value: string };

function buildAttributes(input: GeneratorInput): Attr[] {
  const attrs: Attr[] = [];
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

/** `size={48}`, `color="…"`, or bare `loop` for a true boolean shorthand. */
function attrText(a: Attr): string {
  return a.value === "" ? a.key : `${a.key}=${a.value}`;
}

function renderJsx(name: string, attrs: Attr[]): string {
  if (attrs.length === 0) return `<${name} />`;
  if (attrs.length === 1) {
    return `<${name} ${attrText(attrs[0])} />`;
  }
  const lines = attrs.map((a) => `  ${attrText(a)}`).join("\n");
  return `<${name}\n${lines}\n/>`;
}

/** Generate a copy-ready React usage snippet for the playground. */
export function generateReactCode(input: GeneratorInput): GeneratorOutput {
  const name = toPascalCase(input.slug);
  const importPath = input.importPath ?? DEFAULT_IMPORT_PATH;
  const attrs = buildAttributes(input);

  const importLine = `import ${name} from "${importPath}/${name}";`;
  const jsxLine = renderJsx(name, attrs);
  const code = `${importLine}\n\nexport function Example() {\n  return (\n${jsxLine
    .split("\n")
    .map((line) => `    ${line}`)
    .join("\n")}\n  );\n}`;
  return { code, importLine, jsxLine };
}

/** React usage-snippet descriptor for the playground code panel. */
export const reactUsage: GeneratorInterface = {
  id: "react",
  label: "React",
  language: "tsx",
  dependencies: "npm install motion",
  generate: generateReactCode,
};

/* -------------------------------------------------------------------------- */
/* Full-source generator (CLI)                                                */
/* -------------------------------------------------------------------------- */

/** Framer Motion property name for an animatable property. */
const FRAMER_PROP: Record<string, string> = {
  rotate: "rotate",
  rotateX: "rotateX",
  rotateY: "rotateY",
  scale: "scale",
  scaleX: "scaleX",
  scaleY: "scaleY",
  translateX: "x",
  translateY: "y",
  opacity: "opacity",
  pathLength: "pathLength",
  strokeWidth: "strokeWidth",
};

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

/** The resting value for a property (drawn paths rest "complete"). */
function restValue(step: AnimationStep): number {
  if (step.property === "pathLength") return step.to ?? 1;
  return stepValues(step)[0];
}

/** JSX literal for an animate target (keyframe array or single value). */
function animateTarget(step: AnimationStep): string {
  const values = stepValues(step);
  return `[${values.join(", ")}]`;
}

/** Build the `${name}Variants` declaration for one element's steps. */
function buildVariants(
  elementKey: string,
  steps: AnimationStep[],
  continuous: boolean,
): string {
  const rest: string[] = [];
  const active: string[] = [];
  const transitions: string[] = [];

  for (const step of steps) {
    const prop = FRAMER_PROP[step.property];
    rest.push(`${prop}: ${restValue(step)}`);
    active.push(`${prop}: ${animateTarget(step)}`);
    const repeat = continuous || step.repeat ? "Infinity" : "0";
    const delay = step.delay ? `, delay: ${step.delay} / speed` : "";
    transitions.push(
      `${prop}: { duration: ${step.duration} / speed, ease: ${framerEasing(step.ease)}, repeat: ${repeat}${delay} }`,
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

/** Origin style for a transform element, or "" when none applies. */
function originStyle(steps: AnimationStep[]): string {
  const transform = steps.find((s) => TRANSFORM_PROPS.has(s.property));
  if (!transform) return "";
  const o = transform.origin ?? DEFAULT_ORIGIN;
  return ` style={{ transformBox: "view-box", transformOrigin: "${o.x}px ${o.y}px" } as React.CSSProperties}`;
}

/** A `motion.<tag>` (or plain tag) element string. */
function motionElement(
  data: PathData,
  id: string,
  variantsVar: string | null,
  style: string,
): string {
  const tag = data.type;
  const motionTag = variantsVar ? `motion.${tag}` : tag;
  const variants = variantsVar
    ? ` variants={${variantsVar}}${style}`
    : "";
  const geom =
    data.type === "path"
      ? `d="${data.d}"`
      : data.type === "circle"
        ? `cx={${data.cx}} cy={${data.cy}} r={${data.r}}`
        : data.type === "line"
          ? `x1={${data.x1}} y1={${data.y1}} x2={${data.x2}} y2={${data.y2}}`
          : `points="${data.points}"`;
  return `        <${motionTag} id="${id}" ${geom}${variants} />`;
}

/** Full React (Framer Motion) generator. */
export const reactGenerator: IconGenerator = {
  framework: "react",
  displayName: "React",
  fileExtension: "tsx",

  generate(
    spec: AnimationSpec,
    paths: IconPaths,
    meta: IconMetadata,
    config?: GeneratorConfig,
  ): GeneratedFile {
    const name = componentName(meta.slug);
    const p = config?.props ?? {};
    const size = p.size ?? DEFAULT_ICON_PROPS.size;
    const color = p.color ?? "currentColor";
    const strokeWidth = p.strokeWidth ?? DEFAULT_ICON_PROPS.strokeWidth;
    const trigger = p.trigger ?? spec.defaultTrigger;
    const speed = p.speed ?? DEFAULT_ICON_PROPS.speed;
    const continuous = isContinuous(spec);
    const is3D = uses3DTransform(spec);

    const animSteps = [
      ...(spec.sequences.trigger ?? []),
      ...(spec.sequences.continuous ?? []),
    ];

    const variantDecls: string[] = [];
    const elementMarkup = Object.keys(paths).map((key) => {
      const data = paths[key];
      const id = spec.elements[key]?.id ?? key;
      const steps = animSteps.filter((s) => s.element === key);
      if (steps.length === 0) return motionElement(data, id, null, "");
      variantDecls.push(buildVariants(key, steps, continuous));
      return motionElement(data, id, `${key}Variants`, originStyle(steps));
    });

    const autoActive = continuous || trigger === "autoplay";
    const animateExpr = autoActive
      ? '"active"'
      : 'trigger === "click" && clicked ? "active" : "rest"';
    // 3D rotations need a perspective on the SVG root to render with depth.
    const perspectiveStyle = is3D
      ? `\n      style={{ perspective: "${perspectiveFor(spec)}px" }}`
      : "";
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

/** ${meta.name} — ${meta.animationDescription} */
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
      aria-label="${meta.name} icon"${perspectiveStyle}
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
      dependencies: "npm install motion",
    };
  },
};
