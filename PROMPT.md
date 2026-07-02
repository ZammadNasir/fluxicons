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
import bellSpec from "./animation.spec";
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
      trigger = bellSpec.defaultTrigger,
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

- A `values` array takes one of two shapes, and the generators derive `hoverHold` from whichever you use:
  - **Round-trip** (the common, versatile shape): `values` start and end at the resting value, e.g. `[0, -12, 12, -9, 9, -5, 0]` or Download's `[0, 3, 0]`. Generators detect `values[0] === values[last]`, drop the trailing rest frame to build the `hoverHold` held pose (`[0, -12, 12, -9, 9, -5]` / `[0, 3]`), and reverse it for the return on leave. This shape works for BOTH triggers — `hover` plays the full round-trip, `hoverHold` holds the trimmed peak — so it's the default choice (Download is a round-trip that defaults to `hoverHold`).
  - **Destination** (use only when a round-trip doesn't make sense): `values` end AT the pose you want to hold and do NOT return, e.g. CardFlip `[0, 180]`. `hoverHold` holds that final value and reverses it on leave; note `hover` would flip and stay rather than return, which is why this shape is reserved for hold-first icons.
  - Either way, the pose `hoverHold` freezes on must be intentional and readable. The failure case is a value array whose only non-rest content is a transient mid-gesture (freezing there looks broken) — keep that icon on `"hover"`. (Draw-style `pathLength` animations that end "complete" are naturally destination-shaped and need no return frame.)
- Your React `hold` variant must match the values the generators would produce: for a return-to-rest gesture, `animate` minus the trailing rest keyframe; for a destination, the same values as `animate`. Always `repeat: 0`. Keeping `animate`/`hold` consistent is what makes the icon behave identically in every framework.
- Never bake a single trigger's behavior into the geometry or timing. The `trigger` prop is switched at runtime; the same icon must be able to hover, hoverHold, click, autoplay, etc.

## Rules

- viewBox always "0 0 24 24", stroke-only icons (fill="none", stroke=currentColor via root), strokeLinecap/Linejoin round.
- Element keys must match across paths.ts, animation.spec.ts `elements`, and the `id` attrs in the component (kebab-case, prefixed with slug, e.g. `<slug>-<element>`).
- Naming: PascalCase component name, kebab-case slug, camelCase+`Paths`/`Spec` suffix for exports.
- Animation must fit the icon's real-world physics (pick the property: rotate/scale/scaleX-Y/translateX-Y/opacity/pathLength/rotateX-Y/strokeWidth) with `easeInOut` and shared EASE `[0.4,0,0.2,1]` in the component.
- Component always defines exactly 3 variants: `normal`, `animate`, `hold`. `normal` = the resting pose. `animate` = the motion (a round-trip back to rest for gesture icons, or ending at the destination for hold icons), `repeat: loop ? Infinity : 0`. `hold` = the pose `hoverHold` freezes on: `animate` minus the trailing return-to-rest keyframe for a round-trip, or the same values as `animate` for a destination — always `repeat: 0`. These three variants are the contract every framework relies on — see the Triggers section for the two value shapes and how `hold` is derived across frameworks.
- Static (non-moving) sub-elements stay as plain `<path>`/`<circle>`/`<line>`, not `motion.*`.
- Duration always divided by `speed`; `delay` passed straight through.
- `defaultTrigger` lives ONLY in `animation.spec.ts` — it is the single source of truth. The component must derive its default from it (`import <slug>Spec from "./animation.spec"` and `trigger = <slug>Spec.defaultTrigger`), never hardcode a literal like `trigger = "hover"`. The website registry reads the same spec field, so the whole system stays in sync.
- Choosing `defaultTrigger` (see the Triggers section for the full rule): use `"hover"` for gesture motions whose point is the round-trip (bell rock, heart beat, bounce, spin). Use `"hoverHold"` when the animation settles at a meaningful, stable pose worth holding (an arrow that lands, a door that opens, a card that flips to its back). The `values` shape is independent of this choice — a round-trip like Download's `[0, 3, 0]` (trimmed to the held pose) works for `hoverHold` just as well as a destination like CardFlip's `[0, 180]`; what matters is that the held pose reads well.
- No comments in variants/JSX body; one JSDoc block above the component; no semicolons... wait, ignore that last one — use standard TS with semicolons as shown above.
- Output ONLY the 4 files (paths.ts, animation.spec.ts, <Name>.tsx, metadata.ts) in full, no extra commentary.

## Now generate this icon: **{ICON_NAME}**

(Provide slug, category, and any specific animation idea here if you have one — otherwise infer sensible ones.)
