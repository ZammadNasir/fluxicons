"use client";

import { forwardRef } from "react";
import { motion, type Variants } from "motion/react";
import type { IconProps } from "@/lib/icon-registry";
import { useIconControls } from "@/lib/icons/use-icon-controls";
import ballSpec from "./animation.spec";
import { ballPaths } from "./paths";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

const ORIGIN = {
  transformBox: "view-box",
  transformOrigin: "12px 15px",
} as const;

/**
 * Ball — a squash-and-stretch ball.
 * Animation: non-uniform `scaleX`/`scaleY` around the ball's base, with no
 * perspective — the classic squash-and-stretch.
 */
const Ball = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 24,
      color = "currentColor",
      strokeWidth = 1.5,
      trigger = ballSpec.defaultTrigger,
      speed = 1,
      loop = false,
      delay = 0,
      onAnimationStart,
      onAnimationComplete,
      className,
      style,
      "aria-label": ariaLabel = "Ball icon",
    },
    ref,
  ) => {
    const { ref: mergedRef, controls, rootProps } = useIconControls(ref, {
      trigger,
      onAnimationStart,
      onAnimationComplete,
    });

    const squash: Variants = {
      normal: { scaleX: 1, scaleY: 1 },
      animate: {
        scaleX: [1, 1.22, 0.96, 1],
        scaleY: [1, 0.78, 1.08, 1],
        transition: {
          duration: 0.55 / speed,
          ease: EASE,
          delay,
          repeat: loop ? Infinity : 0,
        },
      },
      hold: {
        scaleX: [1, 1.22, 0.96, 1.05],
        scaleY: [1, 0.78, 1.08, 0.95],
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
        <motion.circle
          id="ball"
          cx={ballPaths.ball.cx}
          cy={ballPaths.ball.cy}
          r={ballPaths.ball.r}
          variants={squash}
          style={ORIGIN}
        />
        <line
          id="ground"
          x1={ballPaths.ground.x1}
          y1={ballPaths.ground.y1}
          x2={ballPaths.ground.x2}
          y2={ballPaths.ground.y2}
        />
      </motion.svg>
    );
  },
);

Ball.displayName = "Ball";
export default Ball;
