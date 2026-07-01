import type {
  AnimationSpec,
  AnimationStep,
  EasingName,
  Origin,
  PathData,
} from "@/lib/animation-spec";
import { roundTo, toPascalCase } from "@/lib/utils";

/** PascalCase component name from a slug, e.g. "arrow-right" → "ArrowRight". */
export function componentName(slug: string): string {
  return toPascalCase(slug);
}

/** The center of a 0–24 viewBox; used when a step omits its origin. */
export const DEFAULT_ORIGIN: Origin = { x: 12, y: 12 };

/** Resolve a step's keyframe values, normalizing from/to into an array. */
export function stepValues(step: AnimationStep): number[] {
  if (step.values && step.values.length > 0) return step.values;
  return [step.from ?? 0, step.to ?? 0];
}

/** Even keyframe stops across `count` values, e.g. 5 → [0, 25, 50, 75, 100]. */
export function distributePercentages(count: number): number[] {
  if (count <= 1) return [0];
  return Array.from({ length: count }, (_, i) =>
    roundTo((i / (count - 1)) * 100, 2),
  );
}

/** All steps across every sequence in a spec, in a stable order. */
export function allSteps(spec: AnimationSpec): AnimationStep[] {
  return [
    ...(spec.sequences.trigger ?? []),
    ...(spec.sequences.continuous ?? []),
    ...(spec.sequences.mount ?? []),
  ];
}

/** Steps that play on interaction/mount (everything except `continuous`). */
export function activeSteps(spec: AnimationSpec): AnimationStep[] {
  return [...(spec.sequences.trigger ?? []), ...(spec.sequences.mount ?? [])];
}

/** Whether a spec animates continuously (e.g. Loader). */
export function isContinuous(spec: AnimationSpec): boolean {
  return (spec.sequences.continuous?.length ?? 0) > 0;
}

/** Transform properties that rotate in 3D and therefore need a perspective. */
export const ROTATE_3D_PROPS = new Set(["rotateX", "rotateY"]);

/** Whether any step uses a 3D rotation (`rotateX`/`rotateY`). */
export function uses3DTransform(spec: AnimationSpec): boolean {
  return allSteps(spec).some((s) => ROTATE_3D_PROPS.has(s.property));
}

/** The perspective (px) for a 3D icon: the spec's value, or a sensible default. */
export function perspectiveFor(spec: AnimationSpec): number {
  return spec.perspective ?? 500;
}

/** CSS `animation-timing-function` value for a named easing. */
export function cssEasing(ease: EasingName): string {
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
      // A gentle overshoot approximating a spring settle.
      return "cubic-bezier(0.34, 1.56, 0.64, 1)";
    case "bounce":
      return "cubic-bezier(0.22, 1.2, 0.36, 1)";
  }
}

/** Framer Motion `ease` token for a named easing (cubic array for springs). */
export function framerEasing(ease: EasingName): string {
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

/** Render a {@link PathData} as an SVG element string (lowercase JSX/HTML). */
export function renderSvgElement(
  data: PathData,
  attrs: string,
  selfClose = true,
): string {
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
