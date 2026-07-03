import type {
  AnimationSpec,
  AnimationStep,
  IconPaths,
  PathData,
} from "../animation-spec";
import {
  cssEasing,
  DEFAULT_ORIGIN,
  isContinuous,
  perspectiveFor,
  stepValues,
  uses3DTransform,
} from "@/lib/generators/shared";
// StepAnimation is defined in the (import-free) runtime so it can ship verbatim
// next to icons; the compiler produces it and re-exports it for convenience.
import type { StepAnimation } from "./animate-icon";

export type { StepAnimation };

/**
 * The framework-agnostic compiler: turns an {@link AnimationSpec} into a plan
 * that both the runtime driver ({@link file:./animate-icon.ts}) and the code
 * generators consume. This is the *single source of truth* for an icon's
 * keyframes, timing, and DOM structure — every framework renders the same plan,
 * so they cannot drift.
 */

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

/** The CSS `transform` function for a transform property + value. */
function transformValue(property: string, v: number): string {
  switch (property) {
    case "rotate":
      return `rotate(${v}deg)`;
    case "rotateX":
      return `rotateX(${v}deg)`;
    case "rotateY":
      return `rotateY(${v}deg)`;
    case "scale":
      return `scale(${v})`;
    case "scaleX":
      return `scaleX(${v})`;
    case "scaleY":
      return `scaleY(${v})`;
    case "translateX":
      return `translateX(${v}px)`;
    case "translateY":
      return `translateY(${v}px)`;
    default:
      return "";
  }
}

/** One keyframe object (WAAPI shape) for a property at a given value. */
function keyframeFor(property: string, v: number): Keyframe {
  if (TRANSFORM_PROPS.has(property)) return { transform: transformValue(property, v) };
  if (property === "opacity") return { opacity: v };
  if (property === "strokeWidth") return { strokeWidth: v };
  // pathLength: 1 = fully drawn, 0 = hidden. dashoffset is the inverse.
  if (property === "pathLength") return { strokeDashoffset: 1 - v };
  return {};
}

/** A rendered SVG shape (leaf), optionally carrying a draw animation. */
export interface RenderShape {
  kind: "shape";
  data: PathData;
  /** The SVG `id` attribute. */
  id: string;
  /** Present when this shape has a `pathLength` draw animation. */
  drawKey?: string;
}

/** A transform/opacity wrapper `<g>` around its child. */
export interface RenderGroup {
  kind: "group";
  /** The `data-flux` target the runtime animates. */
  key: string;
  /** Static inline styles (transform-box/-origin, preserve-3d). */
  style: Record<string, string>;
  child: RenderNode;
}

export type RenderNode = RenderGroup | RenderShape;

/** The complete, framework-agnostic plan for one icon. */
export interface AnimationPlan {
  /** One render tree per element, in `paths` order — siblings under the svg. */
  elements: RenderNode[];
  /** Every element's animation, in a stable order. */
  animations: StepAnimation[];
  /** Whether the spec animates continuously (autostarts and loops). */
  continuous: boolean;
  /** Whether any step is a 3D rotation (needs perspective on the root). */
  is3D: boolean;
  /** Perspective (px) for the root svg when `is3D`, else null. */
  perspective: number | null;
}

/** Tagged steps for one element: the step plus whether it must always loop. */
interface TaggedStep {
  step: AnimationStep;
  alwaysLoop: boolean;
}

/** Build the active + hold keyframe arrays for a step. */
function buildKeyframes(step: AnimationStep): { active: Keyframe[]; hold: Keyframe[] } {
  const values = stepValues(step);
  // A round-trip (starts and ends at rest) yields a `hold` pose by dropping the
  // trailing rest frame, so `hoverHold` settles at the peak. A destination
  // (doesn't return) holds its final value as-is.
  const roundTrip = values.length > 1 && values[0] === values[values.length - 1];
  const holdValues = roundTrip ? values.slice(0, -1) : values;
  return {
    active: values.map((v) => keyframeFor(step.property, v)),
    hold: holdValues.map((v) => keyframeFor(step.property, v)),
  };
}

/** Static style for a transform wrapper `<g>`. */
function groupStyle(step: AnimationStep, is3D: boolean): Record<string, string> {
  const origin = step.origin ?? DEFAULT_ORIGIN;
  const style: Record<string, string> = {
    "transform-box": "view-box",
    "transform-origin": `${origin.x}px ${origin.y}px`,
  };
  // Keep the 3D context alive down the wrapper chain so the root's perspective
  // reaches nested 3D rotations.
  if (is3D) style["transform-style"] = "preserve-3d";
  return style;
}

/**
 * Compile a spec (+ paths) into an {@link AnimationPlan}. Pure and
 * deterministic — the same input always yields the same plan, which is what the
 * parity test relies on.
 */
export function compileSpec(spec: AnimationSpec, paths: IconPaths): AnimationPlan {
  const continuous = isContinuous(spec);
  const is3D = uses3DTransform(spec);
  const animations: StepAnimation[] = [];
  const elements: RenderNode[] = [];

  for (const elementKey of Object.keys(paths)) {
    const id = spec.elements[elementKey]?.id ?? elementKey;
    const steps: TaggedStep[] = [
      ...(spec.sequences.trigger ?? [])
        .filter((s) => s.element === elementKey)
        .map((step) => ({ step, alwaysLoop: Boolean(step.repeat) })),
      ...(spec.sequences.continuous ?? [])
        .filter((s) => s.element === elementKey)
        .map((step) => ({ step, alwaysLoop: true })),
    ];

    // The draw (pathLength) animation lives on the shape itself.
    const draw = steps.find((s) => s.step.property === "pathLength");
    let node: RenderNode = {
      kind: "shape",
      data: paths[elementKey],
      id,
      drawKey: draw ? `${id}-draw` : undefined,
    };
    if (draw) {
      const kf = buildKeyframes(draw.step);
      animations.push({
        key: `${id}-draw`,
        active: kf.active,
        hold: kf.hold,
        duration: draw.step.duration,
        delay: draw.step.delay ?? 0,
        easing: cssEasing(draw.step.ease),
        alwaysLoop: draw.alwaysLoop,
      });
    }

    // Transform/opacity steps each wrap the shape in a `<g>` (earlier = inner)
    // so transforms compose.
    for (const { step, alwaysLoop } of steps.filter(
      (s) => s.step.property !== "pathLength",
    )) {
      const key = `${id}-${step.property.toLowerCase()}`;
      const kf = buildKeyframes(step);
      animations.push({
        key,
        active: kf.active,
        hold: kf.hold,
        duration: step.duration,
        delay: step.delay ?? 0,
        easing: cssEasing(step.ease),
        alwaysLoop,
      });
      node = { kind: "group", key, style: groupStyle(step, is3D), child: node };
    }

    elements.push(node);
  }

  return {
    elements,
    animations,
    continuous,
    is3D,
    perspective: is3D ? perspectiveFor(spec) : null,
  };
}
