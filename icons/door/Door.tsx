"use client";

import { forwardRef } from "react";
import { motion, type Variants } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { useIconControls } from "@/lib/icons/use-icon-controls";
import doorSpec from "./animation.spec";
import { doorPaths } from "./paths";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

const PANEL_ORIGIN = {
  transformBox: "view-box",
  transformOrigin: "7px 12px",
} as const;

const Door = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 24,
      color = "currentColor",
      strokeWidth = 1.5,
      trigger = doorSpec.defaultTrigger,
      speed = 1,
      loop = false,
      delay = 0,
      onAnimationStart,
      onAnimationComplete,
      className,
      style,
      "aria-label": ariaLabel = "Door icon",
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

    const panel: Variants = {
      normal: {
        rotateY: 0,
        scaleX: 1,
      },
      animate: {
        rotateY: [0, -55, 0],
        scaleX: [1, 0.85, 1],
        transition: {
          duration: 0.6 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
        },
      },
      hold: {
        rotateY: [0, -55],
        scaleX: [1, 0.85],
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
        style={{
          ...style,
          perspective: "500px",
        }}
        aria-label={ariaLabel}
        focusable={trigger === "click" ? undefined : false}
        initial="normal"
        animate={controls}
        {...rootProps}
      >
        <path d={doorPaths.frame.d} />

        <motion.path
          id="door-panel"
          d={doorPaths.panel.d}
          variants={panel}
          style={PANEL_ORIGIN}
        />

        <circle
          cx={doorPaths.knob.cx}
          cy={doorPaths.knob.cy}
          r={doorPaths.knob.r}
          fill={color}
          stroke="none"
        />
      </motion.svg>
    );
  },
);

Door.displayName = "Door";

export default Door;
