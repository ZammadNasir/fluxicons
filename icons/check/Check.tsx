"use client";

import { forwardRef } from "react";
import { motion, type Variants } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { useIconControls } from "@/lib/icons/use-icon-controls";
import checkSpec from "./animation.spec";
import { checkPaths } from "./paths";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

/**
 * Check — a checkmark.
 * Animation: the stroke draws itself from the bottom-left corner up to the
 * top-right using `pathLength`.
 */
const Check = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 24,
      color = "currentColor",
      strokeWidth = 1.5,
      trigger = checkSpec.defaultTrigger,
      speed = 1,
      loop = false,
      delay = 0,
      onAnimationStart,
      onAnimationComplete,
      className,
      style,
      "aria-label": ariaLabel = "Check icon",
    },
    ref,
  ) => {
    const { ref: mergedRef, controls, rootProps } = useIconControls(ref, {
      trigger,
      onAnimationStart,
      onAnimationComplete,
    });

    const draw: Variants = {
      normal: { pathLength: 1, opacity: 1 },
      animate: {
        pathLength: [0, 1],
        opacity: [0, 1, 1],
        transition: {
          pathLength: {
            duration: 0.5 / speed,
            ease: EASE,
            delay,
            repeat: loop ? Infinity : 0,
            repeatDelay: loop ? 0.6 / speed : 0,
          },
          opacity: { duration: 0.1 / speed, delay },
        },
      },
      hold: {
        pathLength: [0, 1],
        opacity: [0, 1, 1],
        transition: {
          pathLength: {
            duration: 0.5 / speed,
            ease: EASE,
            delay,
            repeat: 0,
          },
          opacity: { duration: 0.1 / speed, delay },
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
        <motion.path id="check-path" d={checkPaths.checkmark.d} variants={draw} />
      </motion.svg>
    );
  },
);

Check.displayName = "Check";
export default Check;
