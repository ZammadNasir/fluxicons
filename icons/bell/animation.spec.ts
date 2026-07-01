import type { AnimationSpec } from "@/lib/animation-spec";

const bellSpec: AnimationSpec = {
  elements: {
    body: { id: "bell-body", description: "Bell body" },
    clapper: { id: "bell-clapper", description: "Bell clapper" },
  },
  sequences: {
    // The whole bell rocks around its top mount, so body AND clapper rotate
    // together around the same pivot (matching the React <g> wrapper).
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
