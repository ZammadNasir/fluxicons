import type { AnimationSpec, AnimationStep, IconPaths } from "@/lib/animation-spec";
import type { AnimationTrigger, IconMetadata } from "@/lib/icon-registry";
import { toPascalCase } from "@/lib/utils";
import {
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
  isContinuous,
  reanimatedEasing,
  stepValues,
} from "./shared";

/** Hover/click don't exist on native; both map to `press`. */
function mapTrigger(trigger: AnimationTrigger): "press" | "autoplay" | "none" {
  if (trigger === "autoplay" || trigger === "inView") return "autoplay";
  if (trigger === "none") return "none";
  return "press";
}

/* -------------------------------------------------------------------------- */
/* Usage snippet (playground code panel)                                      */
/* -------------------------------------------------------------------------- */

function buildUsageAttrs(input: GeneratorInput): string[] {
  const attrs: string[] = [];
  if (input.size !== DEFAULT_ICON_PROPS.size) attrs.push(`size={${input.size}}`);
  if (input.color !== DEFAULT_ICON_PROPS.color) {
    // Native has no `currentColor`; emit the chosen color (default is "#000000").
    attrs.push(`color="${input.color}"`);
  }
  if (input.strokeWidth !== DEFAULT_ICON_PROPS.strokeWidth) {
    attrs.push(`strokeWidth={${input.strokeWidth}}`);
  }
  const trigger = mapTrigger(input.trigger);
  if (trigger !== "press") attrs.push(`trigger="${trigger}"`);
  if (input.speed !== DEFAULT_ICON_PROPS.speed) attrs.push(`speed={${input.speed}}`);
  return attrs;
}

/** Generate a copy-ready React Native usage snippet for the playground. */
export function generateReactNativeCode(input: GeneratorInput): GeneratorOutput {
  const name = toPascalCase(input.slug);
  const importPath = input.importPath ?? DEFAULT_IMPORT_PATH;
  const importLine = `import ${name} from "${importPath}/${name}";`;
  const attrs = buildUsageAttrs(input);

  const jsxLine =
    attrs.length === 0
      ? `<${name} />`
      : attrs.length === 1
        ? `<${name} ${attrs[0]} />`
        : `<${name}\n${attrs.map((a) => `  ${a}`).join("\n")}\n/>`;

  const code = `${importLine}\n\nexport function Example() {\n  return (\n${jsxLine
    .split("\n")
    .map((l) => `    ${l}`)
    .join("\n")}\n  );\n}`;
  return { code, importLine, jsxLine };
}

/** React Native usage-snippet descriptor for the playground code panel. */
export const reactNativeUsage: GeneratorInterface = {
  id: "react-native",
  label: "React Native",
  language: "tsx",
  dependencies: "npm install react-native-reanimated react-native-svg",
  generate: generateReactNativeCode,
};

/* -------------------------------------------------------------------------- */
/* Full-source generator (CLI)                                                */
/* -------------------------------------------------------------------------- */

/** Map an animatable property to its react-native-svg animated prop name. */
const RN_PROP: Record<string, string> = {
  rotate: "rotation",
  scale: "scale",
  translateX: "translateX",
  translateY: "translateY",
  opacity: "opacity",
  pathLength: "strokeDashoffset",
};

/** A safe constant dash length for the RN draw-on approximation. */
const RN_DASH = 48;

/** Camel name for a per-element shared value, e.g. ("body","rotate") → bodyRotate. */
function sharedName(elementKey: string, property: string): string {
  const el = elementKey.replace(/[^a-zA-Z0-9]/g, "");
  return `${el}${property.charAt(0).toUpperCase()}${property.slice(1)}`;
}

/** Build a `withSequence(...)` (or `withRepeat`) call driving one shared value. */
function buildDriver(step: AnimationStep): string {
  const values = stepValues(step);
  const easing = reanimatedEasing(step.ease);
  const segments = values
    .slice(1)
    .map(
      (v) =>
        `withTiming(${v}, { duration: (${step.duration} / speed) * 1000 / ${values.length - 1}, easing: ${easing} })`,
    );
  let expr =
    segments.length === 1 ? segments[0] : `withSequence(\n      ${segments.join(",\n      ")},\n    )`;
  if (step.repeat) expr = `withRepeat(${expr}, -1)`;
  if (step.delay && step.delay > 0) {
    expr = `withDelay((${step.delay} / speed) * 1000, ${expr})`;
  }
  return expr;
}

interface RnElement {
  /** Markup for the (possibly animated) element. */
  markup: string;
  /** Shared-value declarations, e.g. `const bodyRotate = useSharedValue(0);`. */
  shared: string[];
  /** `useAnimatedProps` declarations. */
  animatedProps: string[];
  /** Statements run inside `play()`. */
  drivers: string[];
  /** Whether this element needs an animated wrapper. */
  animated: boolean;
}

function svgTag(data: IconPaths[string], attrs: string): string {
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

function buildRnElement(
  elementKey: string,
  paths: IconPaths,
  spec: AnimationSpec,
): RnElement {
  const data = paths[elementKey];
  const steps = [
    ...(spec.sequences.trigger ?? []),
    ...(spec.sequences.continuous ?? []),
  ].filter((s) => s.element === elementKey);

  const stroke = ` stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none"`;

  if (steps.length === 0) {
    return {
      markup: `        <${svgTag(data, stroke)} />`,
      shared: [],
      animatedProps: [],
      drivers: [],
      animated: false,
    };
  }

  const shared: string[] = [];
  const drivers: string[] = [];
  const propEntries: string[] = [];
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
    `  const ${apName} = useAnimatedProps(() => ({ ${propEntries.join(", ")} }));`,
  ];

  // pathLength animates the Path directly; transforms/opacity use AnimatedG.
  const isDraw = steps.some((s) => s.property === "pathLength");
  if (isDraw && data.type === "path") {
    return {
      markup: `        <AnimatedPath animatedProps={${apName}}${stroke}${dash} d="${data.d}" />`,
      shared,
      animatedProps,
      drivers,
      animated: true,
    };
  }

  const originAttrs = ` originX={${origin.x}} originY={${origin.y}}`;
  return {
    markup: `        <AnimatedG animatedProps={${apName}}${originAttrs}>\n          <${svgTag(data, stroke)} />\n        </AnimatedG>`,
    shared,
    animatedProps,
    drivers,
    animated: true,
  };
}

/** Full React Native (Reanimated) generator. */
export const reactNativeGenerator: IconGenerator = {
  framework: "react-native",
  displayName: "React Native",
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
    const color = p.color && p.color !== "currentColor" ? p.color : "#000000";
    const strokeWidth = p.strokeWidth ?? DEFAULT_ICON_PROPS.strokeWidth;
    const trigger = mapTrigger(p.trigger ?? spec.defaultTrigger);
    const speed = p.speed ?? DEFAULT_ICON_PROPS.speed;
    const continuous = isContinuous(spec);

    const elements = Object.keys(paths).map((key) =>
      buildRnElement(key, paths, spec),
    );
    const usedTags = new Set<string>();
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
      Boolean,
    );
    const svgImports = namedImports.join(", ");
    const animatedDecls = [
      usesG ? `const AnimatedG = Animated.createAnimatedComponent(G);` : null,
      usesPath
        ? `const AnimatedPath = Animated.createAnimatedComponent(Path);`
        : null,
    ].filter(Boolean);

    const autoStart = continuous || trigger === "autoplay";
    const playEffect = autoStart
      ? `\n  useEffect(() => {\n    play();\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, []);\n`
      : "";

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
      dependencies: "npm install react-native-reanimated react-native-svg",
    };
  },
};
