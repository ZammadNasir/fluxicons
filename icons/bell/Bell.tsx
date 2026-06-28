"use client";

import { forwardRef } from "react";
import { motion, type Variants } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { useIconControls } from "@/lib/icons/use-icon-controls";
import { bellPaths } from "./paths";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const PIVOT = { transformBox: "view-box", transformOrigin: "12px 3px" } as const;

/**
 * Bell — bell body with a clapper.
 * Animation: the whole bell rocks back and forth around its top mount,
 * settling to center, like a ring.
 */
const Bell = forwardRef<SVGSVGElement, IconProps>(
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
      "aria-label": ariaLabel = "Bell icon",
    },
    ref,
  ) => {
    const { ref: mergedRef, controls, rootProps } = useIconControls(ref, {
      trigger,
      onAnimationStart,
      onAnimationComplete,
    });

    const ring: Variants = {
      normal: { rotate: 0 },
      animate: {
        rotate: [0, -12, 12, -9, 9, -5, 0],
        transition: {
          duration: 0.7 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 0.5 / speed : 0,
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
        <motion.g variants={ring} style={PIVOT}>
          <path id="bell-body" d={bellPaths.body.d} />
          <path id="bell-clapper" d={bellPaths.clapper.d} />
        </motion.g>
      </motion.svg>
    );
  },
);

Bell.displayName = "Bell";
export default Bell;
