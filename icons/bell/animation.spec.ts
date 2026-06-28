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
        values: [0, -20, 20, -10, 10, 0],
        duration: 0.6,
        ease: "easeInOut",
        origin: { x: 12, y: 4 },
      },
    ],
  },
  defaultTrigger: "hover",
};

export default bellSpec;
