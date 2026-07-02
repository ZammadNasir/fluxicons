"use client";

import { forwardRef } from "react";
import { motion, type Variants } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { useIconControls } from "@/lib/icons/use-icon-controls";
import signalSpec from "./animation.spec";
import { signalPaths } from "./paths";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const PIVOT_1 = {
  transformBox: "view-box",
  transformOrigin: "4px 20px",
} as const;
const PIVOT_2 = {
  transformBox: "view-box",
  transformOrigin: "9px 20px",
} as const;
const PIVOT_3 = {
  transformBox: "view-box",
  transformOrigin: "14px 20px",
} as const;
const PIVOT_4 = {
  transformBox: "view-box",
  transformOrigin: "19px 20px",
} as const;

/**
 * Signal — four ascending signal-strength bars.
 * Animation: the bars compress and spring back in a staggered cascade, like a pulse sweeping across the signal.
 */
const Signal = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 24,
      color = "currentColor",
      strokeWidth = 1.5,
      trigger = signalSpec.defaultTrigger,
      speed = 1,
      loop = false,
      delay = 0,
      onAnimationStart,
      onAnimationComplete,
      className,
      style,
      "aria-label": ariaLabel = "Signal icon",
    },
    ref,
  ) => {
    const {
      ref: mergedRef,
      controls,
      rootProps,
    } = useIconControls(ref, {
      trigger,
      onAnimationStart,
      onAnimationComplete,
    });

    const bar1: Variants = {
      normal: { scaleY: 1 },
      animate: {
        scaleY: [1, 0.4, 1],
        transition: {
          duration: 0.4 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 0.5 / speed : 0,
        },
      },
      hold: {
        scaleY: [1, 0.4],
        transition: { duration: 0.4 / speed, ease: EASE, delay, repeat: 0 },
      },
    };

    const bar2: Variants = {
      normal: { scaleY: 1 },
      animate: {
        scaleY: [1, 0.4, 1],
        transition: {
          duration: 0.5 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 0.5 / speed : 0,
        },
      },
      hold: {
        scaleY: [1, 0.4],
        transition: { duration: 0.5 / speed, ease: EASE, delay, repeat: 0 },
      },
    };

    const bar3: Variants = {
      normal: { scaleY: 1 },
      animate: {
        scaleY: [1, 0.4, 1],
        transition: {
          duration: 0.6 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 0.5 / speed : 0,
        },
      },
      hold: {
        scaleY: [1, 0.4],
        transition: { duration: 0.6 / speed, ease: EASE, delay, repeat: 0 },
      },
    };

    const bar4: Variants = {
      normal: { scaleY: 1 },
      animate: {
        scaleY: [1, 0.4, 1],
        transition: {
          duration: 0.7 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 0.5 / speed : 0,
        },
      },
      hold: {
        scaleY: [1, 0.4],
        transition: { duration: 0.7 / speed, ease: EASE, delay, repeat: 0 },
      },
    };

    return (
      <motion.svg
        ref={mergedRef}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
        aria-label={ariaLabel}
        focusable={trigger === "click" ? undefined : false}
        initial="normal"
        animate={controls}
        {...rootProps}
      >
        <motion.path
          id="signal-bar1"
          d={signalPaths.bar1.d}
          variants={bar1}
          style={PIVOT_1}
        />
        <motion.path
          id="signal-bar2"
          d={signalPaths.bar2.d}
          variants={bar2}
          style={PIVOT_2}
        />
        <motion.path
          id="signal-bar3"
          d={signalPaths.bar3.d}
          variants={bar3}
          style={PIVOT_3}
        />
        <motion.path
          id="signal-bar4"
          d={signalPaths.bar4.d}
          variants={bar4}
          style={PIVOT_4}
        />
      </motion.svg>
    );
  },
);

Signal.displayName = "Signal";
export default Signal;
