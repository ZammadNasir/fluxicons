You are generating one icon for "Rehover", a framework-agnostic animated icon library. Each icon is a folder with 4 files. Study the example below (icon: Bell) and produce the SAME 4 files for the NEW icon, matching every convention exactly (naming, types, style, structure).

The real work is three files — `paths.ts` (geometry), `animation.spec.ts` (the animation, and the single source of truth for every framework), and `metadata.ts`. The `<Name>.tsx` is a fixed boilerplate wrapper with zero animation code. Do NOT put animation logic in the component; it all lives in the spec.

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

**Bell.tsx** — a FIXED wrapper. It contains NO animation code: it just hands the paths + spec to the shared `FluxIcon` renderer, which builds the SVG and drives the animation. Copy this verbatim for every icon, changing only the three identifiers (component name, `bellPaths`/`bellSpec` imports, and the `name=` string).

```typescript
"use client";

import { forwardRef } from "react";
import type { IconProps } from "@/lib/icon-registry";
import { FluxIcon } from "@/lib/runtime/react/flux-icon";
import bellSpec from "./animation.spec";
import { bellPaths } from "./paths";

/**
 * Bell — bell body with a clapper.
 * Animation: the whole bell rocks back and forth around its top mount, settling to center.
 */
const Bell = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <FluxIcon ref={ref} name="Bell" paths={bellPaths} spec={bellSpec} {...props} />
));

Bell.displayName = "Bell";
export default Bell;
```

> There are no per-icon animation variants, no `motion.*`, no easing constants, and no hand-written SVG markup. `FluxIcon` compiles `animation.spec.ts` into keyframes at build time and runs them with a tiny shared runtime — the same compiler the Vue/Svelte/Angular/Astro generators use, so all frameworks stay identical. **The entire animation is authored in `animation.spec.ts`. The `.tsx` never changes shape.**

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

Every Rehover icon exposes a runtime `trigger` prop. `defaultTrigger` in the spec only picks the default — the icon must support ALL triggers, because a consumer can override `trigger` at runtime:

- `hover` — on pointer enter, play the full animation once, then settle back to rest. A one-shot; re-entering replays it.
- `hoverHold` — on pointer enter, animate to the PEAK and HOLD there for as long as the pointer stays; on leave, animate back to rest. (Press-and-hold feel — NOT the same as `hover`.)
- `click` — play once per click/activation. The root becomes a keyboard-accessible button.
- `inView` — play once, the first time the icon scrolls into view.
- `autoplay` — play on mount. Loops when the spec is continuous or `loop` is set.
- `none` — never animates.

**Rehover is framework-agnostic, and `animation.spec.ts` is the single source of truth.** You never hand-write animation code. A shared compiler turns the spec into keyframes, and a shared runtime plays them; React (`FluxIcon`), Vue, and every future framework all consume that one compiler, so they animate identically. Every trigger's behavior — including `hoverHold` — is derived automatically from the spec's `values`. So you must author the spec so it is correct for ALL triggers, not just `hover`:

- A `values` array takes one of two shapes, and the generators derive `hoverHold` from whichever you use:
  - **Round-trip** (the common, versatile shape): `values` start and end at the resting value, e.g. `[0, -12, 12, -9, 9, -5, 0]` or Download's `[0, 3, 0]`. Generators detect `values[0] === values[last]`, drop the trailing rest frame to build the `hoverHold` held pose (`[0, -12, 12, -9, 9, -5]` / `[0, 3]`), and reverse it for the return on leave. This shape works for BOTH triggers — `hover` plays the full round-trip, `hoverHold` holds the trimmed peak — so it's the default choice (Download is a round-trip that defaults to `hoverHold`).
  - **Destination** (use only when a round-trip doesn't make sense): `values` end AT the pose you want to hold and do NOT return, e.g. CardFlip `[0, 180]`. `hoverHold` holds that final value and reverses it on leave; note `hover` would flip and stay rather than return, which is why this shape is reserved for hold-first icons.
  - Either way, the pose `hoverHold` freezes on must be intentional and readable. The failure case is a value array whose only non-rest content is a transient mid-gesture (freezing there looks broken) — keep that icon on `"hover"`. (Draw-style `pathLength` animations that end "complete" are naturally destination-shaped and need no return frame.)
- You do NOT write the hold pose — the compiler derives it from your `values`: it drops a round-trip's trailing rest frame (so `hoverHold` settles at the peak) and reverses that for the return on leave; a destination holds its final value. Your only job is to choose the right `values` shape so that derived pose reads well.
- Never bake a single trigger's behavior into the geometry or timing. The `trigger` prop is switched at runtime; the same icon must be able to hover, hoverHold, click, autoplay, etc.

## Rules

- viewBox always "0 0 24 24"; stroke-only geometry (the renderer sets `fill="none"`, `stroke="currentColor"`, and round line caps/joins on the root — your paths just describe the strokes).
- Element keys must match across `paths.ts` and `animation.spec.ts` `elements`. Each element's `id` is set once in `elements` as `<slug>-<elementKey>` (kebab-case); the renderer applies it. Only elements that appear in a `sequences` step animate — the rest render static automatically. You never write SVG markup or `id` attributes by hand.
- Naming: PascalCase component name, kebab-case slug, camelCase+`Paths`/`Spec` suffix for exports.
- Animation must fit the icon's real-world physics. Per step choose: the `property` (rotate/scale/scaleX-Y/translateX-Y/opacity/pathLength/rotateX-Y/strokeWidth), the `values` (see the Triggers section for the round-trip vs destination shapes), `duration` (seconds), a named `ease` (usually `"easeInOut"`), and `origin` for rotate/scale. Add `perspective` on the spec for 3D (`rotateX`/`rotateY`).
- The `.tsx` is a fixed `FluxIcon` wrapper (copy the Bell example, changing only the name and the two imports). Write NO animation code, variants, easing constants, or markup in it.
- Do NOT account for `speed`, `delay`, or `loop` yourself — the runtime applies those props. Just set the step's `duration` (and optional per-step `delay`) in seconds. For an icon that should loop, use a `continuous` sequence or set `repeat: true` on the step.
- `defaultTrigger` lives ONLY in `animation.spec.ts` — it is the single source of truth. `FluxIcon` reads it as the trigger default, and the website registry reads the same field, so the wrapper hardcodes nothing.
- Choosing `defaultTrigger` (see the Triggers section for the full rule): use `"hover"` for gesture motions whose point is the round-trip (bell rock, heart beat, bounce, spin). Use `"hoverHold"` when the animation settles at a meaningful, stable pose worth holding (an arrow that lands, a door that opens, an eyelid that lowers half-closed). Use `"inView"` with `loop` where it feels useful for ambient icons (Globe, Server, Brain). The `values` shape is independent of this choice — a round-trip like Download's `[0, 3, 0]` (trimmed to the held pose) works for `hoverHold` just as well as a destination like CardFlip's `[0, 180]`; what matters is that the held pose reads well.
- One JSDoc block above the wrapper; standard TS with semicolons as shown above.
- Output ONLY the 4 files (paths.ts, animation.spec.ts, <Name>.tsx, metadata.ts) in full, no extra commentary.

## Now generate this icon: **{ICON_NAME}**

## Minimal animation description: **{{DESCRIPTION}}**

(Provide slug, category, and any specific animation idea here if you have one — otherwise infer sensible ones.)
