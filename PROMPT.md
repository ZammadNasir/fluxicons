You are generating one icon for "FluxIcons", a framework-agnostic animated icon library. Each icon is a folder with 4 files. Study the example below (icon: Bell) and produce the SAME 4 files for the NEW icon, matching every convention exactly (naming, types, style, structure). Only the content (geometry, animation, metadata) changes.

## Example icon: Bell

**paths.ts**

```typescript
import type { IconPaths } from "@/lib/animation-spec";

export const bellPaths = {
  body: { type: "path", d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" },
  clapper: { type: "path", d: "M10.3 21a1.94 1.94 0 0 0 3.4 0" },
} satisfies IconPaths;

export const viewBox = "0 0 24 24";
```

**animation.spec.ts**

```typescript
import type { AnimationSpec } from "@/lib/animation-spec";

const bellSpec: AnimationSpec = {
  elements: {
    body: { id: "bell-body", description: "Bell body" },
    clapper: { id: "bell-clapper", description: "Bell clapper" },
  },
  sequences: {
    trigger: [
      {
        element: "body",
        property: "rotate",
        values: [0, -12, 12, -9, 9, -5, 0],
        duration: 0.7,
        ease: "easeInOut",
        origin: { x: 12, y: 3 },
      },
      {
        element: "clapper",
        property: "rotate",
        values: [0, -12, 12, -9, 9, -5, 0],
        duration: 0.7,
        ease: "easeInOut",
        origin: { x: 12, y: 3 },
      },
    ],
  },
  defaultTrigger: "hover",
};

export default bellSpec;
```

**Bell.tsx**

```typescript
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
 * Animation: the whole bell rocks back and forth around its top mount, settling to center.
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
    const { ref: mergedRef, controls, rootProps } = useIconControls(ref, { trigger, onAnimationStart, onAnimationComplete });

    const ring: Variants = {
      normal: { rotate: 0 },
      animate: {
        rotate: [0, -12, 12, -9, 9, -5, 0],
        transition: { duration: 0.7 / speed, ease: EASE, delay, repeat: loop ? Infinity : 0, repeatDelay: loop ? 0.5 / speed : 0 },
      },
      hold: {
        rotate: [0, -12, 12, -9, 9, -5],
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
```

**metadata.ts**

```typescript
import type { IconMetadata } from "@/lib/icon-registry";

export const metadata: IconMetadata = {
  name: "Bell",
  slug: "bell",
  category: "Notification",
  tags: ["bell", "notification", "alert", "ring", "alarm"],
  featured: false,
  description: "A notification bell with a swinging ring.",
  animationDescription:
    "The bell rocks back and forth around its top mount, settling to center.",
};
```

## Rules

- viewBox always "0 0 24 24", stroke-only icons (fill="none", stroke=currentColor via root), strokeLinecap/Linejoin round.
- Element keys must match across paths.ts, animation.spec.ts `elements`, and the `id` attrs in the component (kebab-case, prefixed with slug, e.g. `<slug>-<element>`).
- Naming: PascalCase component name, kebab-case slug, camelCase+`Paths`/`Spec` suffix for exports.
- Animation must fit the icon's real-world physics (pick the property: rotate/scale/scaleX-Y/translateX-Y/opacity/pathLength/rotateX-Y/strokeWidth) with `easeInOut` and shared EASE `[0.4,0,0.2,1]` in the component.
- Component always defines exactly 3 variants: `normal`, `animate`, `hold`. `hold` = same motion as `animate` but ends at the peak position (drop the trailing return-to-rest keyframe) and always `repeat: 0`. `animate` uses `repeat: loop ? Infinity : 0`.
- Static (non-moving) sub-elements stay as plain `<path>`/`<circle>`/`<line>`, not `motion.*`.
- Duration always divided by `speed`; `delay` passed straight through; `defaultTrigger` is `"hover"` unless there's a strong reason otherwise.
- No comments in variants/JSX body; one JSDoc block above the component; no semicolons... wait, ignore that last one — use standard TS with semicolons as shown above.
- Output ONLY the 4 files (paths.ts, animation.spec.ts, <Name>.tsx, metadata.ts) in full, no extra commentary.

## Now generate this icon: **{ICON_NAME}**

(Provide slug, category, and any specific animation idea here if you have one — otherwise infer sensible ones.)
