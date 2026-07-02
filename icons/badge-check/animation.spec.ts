import type { AnimationSpec } from "@/lib/animation-spec";

const badgeCheckSpec: AnimationSpec = {
  elements: {
    badge: { id: "badge-check-badge", description: "Award badge" },
    check: { id: "badge-check-check", description: "Verification checkmark" },
  },
  sequences: {
    trigger: [
      {
        element: "badge",
        property: "scale",
        values: [1, 1.08, 0.98, 1],
        duration: 0.5,
        ease: "easeInOut",
      },
      {
        element: "check",
        property: "pathLength",
        values: [0, 1],
        duration: 0.4,
        ease: "easeInOut",
      },
    ],
  },
  defaultTrigger: "hover",
};

export default badgeCheckSpec;
