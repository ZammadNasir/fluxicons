import type { AnimationSpec } from "@/lib/animation-spec";

const refreshSpec: AnimationSpec = {
  elements: {
    arc: { id: "refresh-arc", description: "Circular refresh arrow" },
  },
  sequences: {
    trigger: [
      {
        element: "arc",
        property: "rotate",
        values: [0, 120, 240, 360],
        duration: 0.8,
        ease: "easeInOut",
        origin: { x: 12, y: 12 },
      },
    ],
  },
  defaultTrigger: "hover",
};

export default refreshSpec;
