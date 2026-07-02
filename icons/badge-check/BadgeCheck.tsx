"use client";

import { forwardRef } from "react";
import { motion, type Variants } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { useIconControls } from "@/lib/icons/use-icon-controls";
import badgeCheckSpec from "./animation.spec";
import { badgeCheckPaths } from "./paths";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

/**
 * BadgeCheck — award badge with a verification check.
 * Animation: the badge gently pops while the checkmark draws itself into place.
 */
const BadgeCheck = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 24,
      color = "currentColor",
      strokeWidth = 1.5,
      trigger = badgeCheckSpec.defaultTrigger,
      speed = 1,
      loop = false,
      delay = 0,
      onAnimationStart,
      onAnimationComplete,
      className,
      style,
      "aria-label": ariaLabel = "Badge check icon",
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

    const badge: Variants = {
      normal: { scale: 1 },
      animate: {
        scale: [1, 1.08, 0.98, 1],
        transition: {
          duration: 0.5 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 0.5 / speed : 0,
        },
      },
      hold: {
        scale: [1, 1.08, 0.98],
        transition: {
          duration: 0.5 / speed,
          ease: EASE,
          delay,
          repeat: 0,
        },
      },
    };

    const check: Variants = {
      normal: {
        pathLength: 1,
      },
      animate: {
        pathLength: [0, 1],
        transition: {
          duration: 0.4 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
          repeatDelay: loop ? 0.5 / speed : 0,
        },
      },
      hold: {
        pathLength: [0, 1],
        transition: {
          duration: 0.4 / speed,
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
        {/* <motion.path
          id="badge-check-badge"
          d={badgeCheckPaths.badge.d}
          variants={badge}
        />
        <motion.path
          id="badge-check-check"
          d={badgeCheckPaths.check.d}
          variants={check}
        /> */}
        <motion.g variants={badge}>
          <path id="badge-check-badge" d={badgeCheckPaths.badge.d} />
          <path id="badge-check-check" d={badgeCheckPaths.check.d} />
        </motion.g>
      </motion.svg>
    );
  },
);

BadgeCheck.displayName = "BadgeCheck";
export default BadgeCheck;
