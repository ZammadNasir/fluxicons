"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAnimationControls, useInView } from "motion/react";
import type { AnimationTrigger } from "@/lib/icon-registry";

type AnimationControls = ReturnType<typeof useAnimationControls>;

/** Variant name for an icon's resting pose. */
export const REST = "normal" as const;
/** Variant name for an icon's active/animated pose. */
export const ACTIVE = "animate" as const;
/** Variant name for an icon's hover-hold pose (ends at peak, not rest). */
export const HOLD = "hold" as const;

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null): void {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    (ref as React.RefObject<T | null>).current = value;
  }
}

interface UseIconControlsArgs {
  trigger: AnimationTrigger;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

interface IconRootProps {
  role: "img" | "button";
  tabIndex?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

interface UseIconControls {
  /** Callback ref to attach to the `motion.svg` (merges the forwarded ref). */
  ref: (node: SVGSVGElement | null) => void;
  /** Motion controls to wire as `animate={controls}` on the `motion.svg`. */
  controls: AnimationControls;
  /** Props (events + a11y) to spread on the `motion.svg`. */
  rootProps: IconRootProps;
}

/**
 * Shared trigger + accessibility plumbing for every Rehover icon.
 *
 * This intentionally contains NO animation definitions — each icon owns its
 * own variants (`normal`/`animate`/`hold`) and timing. This hook only decides
 * *when* to move between those poses based on the `trigger`, and wires the
 * correct ARIA role / keyboard handling for interactive (`click`) icons.
 */
export function useIconControls(
  forwardedRef: React.Ref<SVGSVGElement> | undefined,
  { trigger, onAnimationStart, onAnimationComplete }: UseIconControlsArgs,
): UseIconControls {
  const controls = useAnimationControls();
  const innerRef = useRef<SVGSVGElement | null>(null);
  const isAnimating = useRef(false);
  const hasPlayedInView = useRef(false);
  const inView = useInView(innerRef, { amount: 0.5 });

  const ref = useCallback(
    (node: SVGSVGElement | null) => {
      innerRef.current = node;
      assignRef(forwardedRef, node);
    },
    [forwardedRef],
  );

  // Plays the active sequence once, guarding against overlapping runs.
  const play = useCallback(async () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    onAnimationStart?.();
    try {
      await controls.start(ACTIVE);
    } finally {
      isAnimating.current = false;
      onAnimationComplete?.();
    }
  }, [controls, onAnimationStart, onAnimationComplete]);

  // Holds the active pose (used while hovered).
  const enter = useCallback(() => {
    onAnimationStart?.();
    controls.start(ACTIVE);
  }, [controls, onAnimationStart]);

  const leave = useCallback(() => {
    controls.start(REST).then(() => onAnimationComplete?.());
  }, [controls, onAnimationComplete]);

  // Plays the hold variant (ends at peak) on hover — used by hoverHold trigger.
  const holdEnter = useCallback(() => {
    onAnimationStart?.();
    controls.start(HOLD);
  }, [controls, onAnimationStart]);

  const holdLeave = useCallback(() => {
    controls.start(REST).then(() => onAnimationComplete?.());
  }, [controls, onAnimationComplete]);

  // autoplay: loop continuously from mount (loop handled in the icon's variant).
  useEffect(() => {
    if (trigger === "autoplay") {
      onAnimationStart?.();
      controls.start(ACTIVE);
    }
    // Re-run only when the trigger flips.
  }, [trigger, controls, onAnimationStart]);

  // inView: play exactly once when the icon scrolls into view.
  useEffect(() => {
    if (trigger === "inView" && inView && !hasPlayedInView.current) {
      hasPlayedInView.current = true;
      void play();
    }
  }, [trigger, inView, play]);

  let rootProps: IconRootProps = { role: "img" };

  if (trigger === "hover") {
    rootProps = {
      role: "img",
      onMouseEnter: enter,
      onMouseLeave: leave,
      onFocus: enter,
      onBlur: leave,
    };
  } else if (trigger === "hoverHold") {
    rootProps = {
      role: "img",
      onMouseEnter: holdEnter,
      onMouseLeave: holdLeave,
      onFocus: holdEnter,
      onBlur: holdLeave,
    };
  } else if (trigger === "click") {
    rootProps = {
      role: "button",
      tabIndex: 0,
      onClick: () => void play(),
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          void play();
        }
      },
    };
  }

  return { ref, controls, rootProps };
}
