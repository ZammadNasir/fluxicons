/**
 * Rehover animation runtime — framework-agnostic, dependency-free, and safe to
 * copy into your project. Every generated icon (Vue/Svelte/Angular/Astro) ships
 * its SVG markup with `data-flux` targets plus a compiled `plan`, then calls
 * `animateIcon(root, plan, props)` from here. All trigger behavior lives in this
 * one file, so it is identical across frameworks.
 *
 * This file has no imports on purpose: it is emitted verbatim next to your icons
 * (as `flux-runtime.ts`) so nothing has to be installed. Tweak it freely.
 */

/** What event starts an icon's animation. */
export type AnimationTrigger =
  | "hover"
  | "hoverHold"
  | "click"
  | "inView"
  | "autoplay"
  | "none";

/** One element's compiled animation, keyed by its `data-flux` target. */
export interface StepAnimation {
  /** Matches the `data-flux` attribute on the element this animates. */
  key: string;
  /** Full keyframes (round-trip or destination) for hover/click/inView/autoplay. */
  active: Keyframe[];
  /** Rest → peak keyframes for `hoverHold` (the return is the reverse of this). */
  hold: Keyframe[];
  /** Base duration in seconds (before the `speed` prop divides it). */
  duration: number;
  /** Base delay in seconds (before `speed`; the `delay` prop is added at runtime). */
  delay: number;
  /** CSS timing-function string. */
  easing: string;
  /** Loops regardless of the `loop` prop (continuous/`repeat` steps). */
  alwaysLoop: boolean;
}

/** What the runtime needs from a compiled plan. */
export interface RuntimePlan {
  /** Per-element animations. */
  animations: StepAnimation[];
  /** Whether the icon autostarts (continuous specs). */
  continuous: boolean;
}

/** The runtime-tunable props that map to the icon's public API. */
export interface IconRuntimeProps {
  trigger: AnimationTrigger;
  speed: number;
  loop: boolean;
  delay: number;
}

/** Handle returned by {@link animateIcon} for prop updates and teardown. */
export interface IconController {
  /** Re-wire for new props (e.g. the playground changing `trigger`). */
  update(props: IconRuntimeProps): void;
  /** Remove all listeners/observers and cancel running animations. */
  destroy(): void;
}

type Variant = "active" | "hold";

interface Bound {
  anim: StepAnimation;
  el: Element;
}

/** Attach the animation runtime to an already-rendered icon root. */
export function animateIcon(
  root: SVGSVGElement,
  plan: RuntimePlan,
  initialProps: IconRuntimeProps,
): IconController {
  let props = initialProps;

  // Resolve each animation's DOM target once.
  const bound: Bound[] = [];
  for (const anim of plan.animations) {
    const el = root.querySelector(`[data-flux="${anim.key}"]`);
    if (el) bound.push({ anim, el });
  }

  // The currently-playing Animation per target (for restart/reverse).
  const current = new Map<string, Animation>();
  const cleanups: Array<() => void> = [];
  let observer: IntersectionObserver | null = null;

  function makeAnimation(b: Bound, variant: Variant): Animation {
    const { anim } = b;
    const keyframes = variant === "hold" ? anim.hold : anim.active;
    const loops = variant === "active" && (anim.alwaysLoop || props.loop);
    return b.el.animate(keyframes, {
      duration: (anim.duration / props.speed) * 1000,
      delay: ((anim.delay + props.delay) / props.speed) * 1000,
      easing: anim.easing,
      fill: "forwards",
      iterations: loops ? Infinity : 1,
    });
  }

  /** (Re)start a variant on every target, cancelling any in-flight run. */
  function play(variant: Variant): void {
    for (const b of bound) {
      current.get(b.anim.key)?.cancel();
      current.set(b.anim.key, makeAnimation(b, variant));
    }
  }

  /** Reverse the held pose back to rest (smooth, from the current position). */
  function reverseToRest(): void {
    for (const b of bound) {
      const running = current.get(b.anim.key);
      if (running) running.reverse();
    }
  }

  function on(type: string, handler: EventListener): void {
    root.addEventListener(type, handler);
    cleanups.push(() => root.removeEventListener(type, handler));
  }

  /** Tear down listeners/observers and stop animations (keeps final pose). */
  function teardown(): void {
    for (const c of cleanups) c();
    cleanups.length = 0;
    observer?.disconnect();
    observer = null;
  }

  function setup(): void {
    teardown();

    // Accessibility reflects interactivity and stays in sync with `trigger`.
    if (props.trigger === "click") {
      root.setAttribute("role", "button");
      root.setAttribute("tabindex", "0");
    } else {
      root.setAttribute("role", "img");
      root.removeAttribute("tabindex");
    }

    // Continuous specs and autoplay start immediately.
    if (plan.continuous || props.trigger === "autoplay") play("active");

    switch (props.trigger) {
      case "hover":
        on("mouseenter", () => play("active"));
        on("focus", () => play("active"));
        break;
      case "hoverHold":
        on("mouseenter", () => play("hold"));
        on("mouseleave", () => reverseToRest());
        on("focus", () => play("hold"));
        on("blur", () => reverseToRest());
        break;
      case "click":
        on("click", () => play("active"));
        on("keydown", (e) => {
          const key = (e as KeyboardEvent).key;
          if (key === "Enter" || key === " ") {
            e.preventDefault();
            play("active");
          }
        });
        break;
      case "inView":
        observer = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              play("active");
              observer?.disconnect();
              observer = null;
            }
          },
          { threshold: 0.5 },
        );
        observer.observe(root);
        break;
    }
  }

  setup();

  return {
    update(next: IconRuntimeProps) {
      props = next;
      // Reset every target to rest before re-wiring for the new props.
      for (const a of current.values()) a.cancel();
      current.clear();
      setup();
    },
    destroy() {
      teardown();
      for (const a of current.values()) a.cancel();
      current.clear();
    },
  };
}
