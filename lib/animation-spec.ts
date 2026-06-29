import type { AnimationTrigger } from "@/lib/icon-registry";

/**
 * The framework-agnostic source of truth for an icon's animation.
 *
 * An `AnimationSpec` describes *intent* — what moves, by how much, over how
 * long — without referencing any framework's animation API. Generators read a
 * spec (plus the icon's {@link IconPaths}) and emit native code for React,
 * Vue, etc.
 */

/** A property that a generator knows how to animate. */
export type AnimatableProperty =
  | "rotate"
  | "scale"
  | "translateX"
  | "translateY"
  | "opacity"
  | "pathLength" // SVG path draw-on animations
  | "strokeWidth";

/** A named easing curve; each generator maps this to its native equivalent. */
export type EasingName =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "spring"
  | "bounce";

/** A transform pivot, in SVG user units (matching the icon's viewBox). */
export interface Origin {
  x: number;
  y: number;
}

/** A single animated step on a single element. */
export interface AnimationStep {
  /** References a key in {@link AnimationSpec.elements} (and {@link IconPaths}). */
  element: string;
  property: AnimatableProperty;
  /** Start value for a simple two-stop animation. */
  from?: number;
  /** End value for a simple two-stop animation. */
  to?: number;
  /** Multi-keyframe values, e.g. `[0, -20, 20, -10, 10, 0]`. Overrides from/to. */
  values?: number[];
  /** Duration in seconds (before the speed multiplier is applied). */
  duration: number;
  /** Delay in seconds before this step starts. Default 0. */
  delay?: number;
  ease: EasingName;
  /** Transform origin in SVG units (for rotate/scale). Default center (12,12). */
  origin?: Origin;
  /** Whether this step repeats indefinitely. */
  repeat?: boolean;
}

/** An element that participates in animation, identified by its SVG id. */
export interface AnimatedElement {
  /** Must match the `id` attribute on the rendered SVG element. */
  id: string;
  /** Optional human note, e.g. "the bell body". */
  description?: string;
}

/** The complete animation specification for one icon. */
export interface AnimationSpec {
  /** Named elements that animate, keyed the same as {@link IconPaths}. */
  elements: Record<string, AnimatedElement>;

  sequences: {
    /** Plays when the trigger fires (hover/click/inView). */
    trigger?: AnimationStep[];
    /** Plays continuously regardless of trigger (e.g. Loader). */
    continuous?: AnimationStep[];
    /** Plays once on mount. */
    mount?: AnimationStep[];
  };

  /** The icon's default trigger. */
  defaultTrigger: AnimationTrigger;

  /** If true, the continuous sequence loops even after the trigger fires. */
  alwaysLoop?: boolean;
}

/**
 * Pure SVG geometry for an icon — no framework dependencies. Each key names an
 * element that {@link AnimationSpec} can reference; the value describes the
 * shape to render.
 */
export interface IconPaths {
  [elementName: string]: PathData;
}

/** A renderable SVG primitive. */
export type PathData =
  | { type: "path"; d: string }
  | { type: "circle"; cx: number; cy: number; r: number }
  | { type: "line"; x1: number; y1: number; x2: number; y2: number }
  | { type: "polyline"; points: string };
