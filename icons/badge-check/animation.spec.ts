import type { AnimationSpec } from "@/lib/animation-spec";

const badgeCheckSpec: AnimationSpec = {
  elements: {
    badge: { id: "badge", description: "The badge disc that flips in 3D." },
    check: { id: "badge-check-check", description: "The checkmark that draws on." },
  },
  sequences: {
    // The disc flips a full turn around the Y axis (coin flip). The checkmark
    // flips with it AND draws itself on — so its path sits inside a 3D wrapper
    // (preserve-3d) while also running a pathLength draw.
    trigger: [
      {
        element: "badge",
        property: "rotateY",
        values: [0, 360],
        duration: 0.8,
        ease: "easeInOut",
        origin: { x: 12, y: 12 },
      },
      {
        element: "check",
        property: "rotateY",
        values: [0, 360],
        duration: 0.8,
        ease: "easeInOut",
        origin: { x: 12, y: 12 },
      },
      {
        element: "check",
        property: "pathLength",
        from: 0,
        to: 1,
        duration: 0.5,
        delay: 0.3,
        ease: "easeOut",
      },
    ],
  },
  defaultTrigger: "hover",
  perspective: 600,
};

export default badgeCheckSpec;
