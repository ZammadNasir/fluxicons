"use client";

import { forwardRef } from "react";
import { motion, type Variants } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { useIconControls } from "@/lib/icons/use-icon-controls";
import { userPaths } from "./paths";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const ORIGIN = {
  transformBox: "view-box",
  transformOrigin: "12px 12px",
} as const;

const User = forwardRef<SVGSVGElement, IconProps>(
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
      "aria-label": ariaLabel = "User icon",
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

    // TODO: design this icon's animation. Keep element ids in sync with
    // animation.spec.ts so the other framework generators stay accurate.
    const shape: Variants = {
      normal: {
        scale: 1,
        rotate: 0,
      },

      animate: {
        scale: [1, 1.08, 1],
        rotate: [0, -3, 3, 0],
        transition: {
          duration: 0.6 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
        },
      },
      hold: {
        scale: [1, 1.08, 1.03],
        rotate: [0, -3, 3, 1.5],
        transition: {
          duration: 0.6 / speed,
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
        <motion.path
          id="user-shape"
          d={userPaths.shape.d}
          variants={shape}
          style={ORIGIN}
        />
      </motion.svg>
    );
  },
);

User.displayName = "User";
export default User;
