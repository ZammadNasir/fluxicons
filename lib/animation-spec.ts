/**
 * What event starts an icon's animation.
 * - `hover`: plays while the parent is hovered
 * - `hoverHold`: plays on hover and holds the animated peak position; returns to rest on leave
 * - `click`: plays once per click (and via keyboard when focusable)
 * - `inView`: plays once when the icon scrolls into view
 * - `autoplay`: loops continuously
 * - `none`: static, no animation
 */
export type AnimationTrigger =
  | "hover"
  | "hoverHold"
  | "click"
  | "inView"
  | "autoplay"
  | "none";

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
  | "rotateX" // 3D rotation around the X axis (flip up/down); needs perspective
  | "rotateY" // 3D rotation around the Y axis (swing like a door); needs perspective
  | "scale"
  | "scaleX"
  | "scaleY"
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

  /**
   * Default value of the `loop` prop for this icon. Set `true` for ambient
   * icons that read better repeating (e.g. an `inView` or `autoplay` pulse), so
   * they loop in the gallery/playground without the consumer passing `loop`.
   * A consumer can still override it at runtime.
   */
  defaultLoop?: boolean;

  /** If true, the continuous sequence loops even after the trigger fires. */
  alwaysLoop?: boolean;

  /**
   * CSS perspective (in px) applied to the SVG root so 3D rotations
   * (`rotateX`/`rotateY`) render with depth. Defaults to 500 when an icon uses
   * a 3D rotation and this is omitted.
   */
  perspective?: number;
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
