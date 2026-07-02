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

## Triggers — how they work, and why they must work in EVERY framework

Every FluxIcon exposes a runtime `trigger` prop. `defaultTrigger` in the spec only picks the default — the icon must support ALL triggers, because a consumer can override `trigger` at runtime:

- `hover` — on pointer enter, play the full animation once, then settle back to rest. A one-shot; re-entering replays it.
- `hoverHold` — on pointer enter, animate to the PEAK and HOLD there for as long as the pointer stays; on leave, animate back to rest. (Press-and-hold feel — NOT the same as `hover`.)
- `click` — play once per click/activation. The root becomes a keyboard-accessible button.
- `inView` — play once, the first time the icon scrolls into view.
- `autoplay` — play on mount. Loops when the spec is continuous or `loop` is set.
- `none` — never animates.

**FluxIcons is framework-agnostic, and `animation.spec.ts` is the single source of truth.** The React `.tsx` you write is only ONE target: the Vue build (and any future framework) is generated automatically from the spec by the code generators. Every trigger's behavior — including `hoverHold` — is derived from the spec's `values`, in whatever framework the icon is emitted. So you must author the spec so it is correct for ALL triggers, not just `hover`:

- **Make each transform/opacity `values` array a round-trip: it must start and end at the resting value** (e.g. `[0, -12, 12, -9, 9, -5, 0]` — first and last are both `0`). Generators detect `values[0] === values[last]` to build the `hoverHold` "held at peak" pose (they drop the trailing return-to-rest frame) and its reverse (peak → rest on leave). If your values do NOT return to rest, `hoverHold` has no distinct hold pose and degrades to looking like `hover` — the exact bug to avoid. (Draw-style `pathLength` animations that end "complete" are the natural exception and need no return frame.)
- Your React `hold` variant must mirror this rule exactly (see the Rules below): it is the `animate` motion minus the trailing return-to-rest keyframe, with `repeat: 0`. The generators reproduce this derivation for other frameworks, so keeping `animate`/`hold` consistent here is what makes the icon behave identically everywhere.
- Never bake a single trigger's behavior into the geometry or timing. The `trigger` prop is switched at runtime; the same icon must be able to hover, hoverHold, click, autoplay, etc.

## Rules

- viewBox always "0 0 24 24", stroke-only icons (fill="none", stroke=currentColor via root), strokeLinecap/Linejoin round.
- Element keys must match across paths.ts, animation.spec.ts `elements`, and the `id` attrs in the component (kebab-case, prefixed with slug, e.g. `<slug>-<element>`).
- Naming: PascalCase component name, kebab-case slug, camelCase+`Paths`/`Spec` suffix for exports.
- Animation must fit the icon's real-world physics (pick the property: rotate/scale/scaleX-Y/translateX-Y/opacity/pathLength/rotateX-Y/strokeWidth) with `easeInOut` and shared EASE `[0.4,0,0.2,1]` in the component.
- Component always defines exactly 3 variants: `normal`, `animate`, `hold`. `normal` = the resting pose. `animate` = the full round-trip (starts and ends at rest), `repeat: loop ? Infinity : 0`. `hold` = the SAME motion as `animate` but with the trailing return-to-rest keyframe dropped so it ends at the peak and stays there, always `repeat: 0`. These three variants are the contract every framework relies on — see the Triggers section for why the round-trip and `hold` derivation matter across frameworks.
- Static (non-moving) sub-elements stay as plain `<path>`/`<circle>`/`<line>`, not `motion.*`.
- Duration always divided by `speed`; `delay` passed straight through; `defaultTrigger` is `"hover"` unless there's a strong reason otherwise.
- No comments in variants/JSX body; one JSDoc block above the component; no semicolons... wait, ignore that last one — use standard TS with semicolons as shown above.
- Output ONLY the 4 files (paths.ts, animation.spec.ts, <Name>.tsx, metadata.ts) in full, no extra commentary.

## Now generate this icon: **{ICON_NAME}**

(Provide slug, category, and any specific animation idea here if you have one — otherwise infer sensible ones.)
