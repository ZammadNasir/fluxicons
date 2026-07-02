"use client";

import { forwardRef } from "react";
import { motion, type Variants } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { useIconControls } from "@/lib/icons/use-icon-controls";
import eyeSpec from "./animation.spec";
import { eyePaths } from "./paths";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

const PIVOT = {
  transformBox: "view-box",
  transformOrigin: "12px 12px",
} as const;

/**
 * Eye — blinking eye icon.
 * Upper lid starts hidden above the eye and slides down/up on trigger.
 */
const Eye = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 24,
      color = "currentColor",
      strokeWidth = 1.5,
      trigger = eyeSpec.defaultTrigger,
      speed = 1,
      loop = false,
      delay = 0,
      onAnimationStart,
      onAnimationComplete,
      className,
      style,
      "aria-label": ariaLabel = "Eye icon",
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

    const upperLid: Variants = {
      normal: {
        y: -18,
      },
      animate: {
        y: [-18, 0, -18],
        transition: {
          duration: 0.45 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 1.2 / speed : 0,
        },
      },
      hold: {
        y: 0,
      },
    };

    const pupil: Variants = {
      normal: {
        scale: 1,
      },
      animate: {
        scale: [1, 0.88, 1],
        transition: {
          duration: 0.45 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 1.2 / speed : 0,
        },
      },
      hold: {
        scale: 0.88,
        transition: {
          duration: 0.2 / speed,
          ease: EASE,
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
        <defs>
          <clipPath id="eye-clip">
            <path d={eyePaths.outline.d} />
          </clipPath>
        </defs>

        {/* Eye outline */}
        <path id="eye-outline" d={eyePaths.outline.d} />

        {/* Pupil */}
        <g style={PIVOT}>
          <motion.circle
            id="eye-pupil"
            cx={eyePaths.pupil.cx}
            cy={eyePaths.pupil.cy}
            r={eyePaths.pupil.r}
            variants={pupil}
          />
        </g>

        {/* Upper eyelid */}
        <g clipPath="url(#eye-clip)">
          <motion.path
            id="eye-upperLid"
            d={eyePaths.upperLid.d}
            stroke={color}
            strokeWidth={strokeWidth * 2}
            strokeLinecap="round"
            fill="none"
            variants={upperLid}
          />
        </g>
      </motion.svg>
    );
  },
);

Eye.displayName = "Eye";

export default Eye;
