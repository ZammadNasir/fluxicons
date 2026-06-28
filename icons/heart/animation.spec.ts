import type { AnimationSpec } from "@/lib/animation-spec";

const heartSpec: AnimationSpec = {
  elements: {
    heart: { id: "heart-shape", description: "Heart shape" },
  },
  sequences: {
    trigger: [
      {
        element: "heart",
        property: "scale",
        values: [1, 1.2, 0.95, 1.1, 1],
        duration: 0.5,
        ease: "spring",
        origin: { x: 12, y: 12 },
      },
    ],
  },
  defaultTrigger: "hover",
};

export default heartSpec;
