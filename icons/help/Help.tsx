"use client";

import { forwardRef } from "react";
import { motion, type Variants } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { useIconControls } from "@/lib/icons/use-icon-controls";
import { helpPaths } from "./paths";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const CENTER = {
  transformBox: "view-box",
  transformOrigin: "12px 12px",
} as const;

/**
 * Help — a circled question mark.
 * Animation: the question mark gently pops while its dot bounces upward before settling.
 */
const Help = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 24,
      color = "currentColor",
      strokeWidth = 1.5,
      trigger = "hover",
      speed = 1,
      loop = false,
      delay = 0,
      onAnimationStart,
      onAnimationComplete,
      className,
      style,
      "aria-label": ariaLabel = "Help icon",
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

    const question: Variants = {
      normal: { scale: 1 },
      animate: {
        scale: [1, 1.12, 0.96, 1.06, 1],
        transition: {
          duration: 0.55 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 0.5 / speed : 0,
        },
      },
      hold: {
        scale: [1, 1.12, 0.96, 1.06],
        transition: {
          duration: 0.55 / speed,
          ease: EASE,
          delay,
          repeat: 0,
        },
      },
    };

    const dot: Variants = {
      normal: { y: 0 },
      animate: {
        y: [0, -1.5, 0],
        transition: {
          duration: 0.55 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 0.5 / speed : 0,
        },
      },
      hold: {
        y: [0, -1.5],
        transition: {
          duration: 0.55 / speed,
          ease: EASE,
          delay,
          repeat: 0,
        },
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
        <path id="help-circle" d={helpPaths.circle.d} />
        <motion.path
          id="help-question"
          d={helpPaths.question.d}
          variants={question}
          style={CENTER}
        />
        <motion.path id="help-dot" d={helpPaths.dot.d} variants={dot} />
      </motion.svg>
    );
  },
);

Help.displayName = "Help";
export default Help;
