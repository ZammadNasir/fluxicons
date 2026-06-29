import type { AnimationSpec } from "@/lib/animation-spec";

const userSpec: AnimationSpec = {
  elements: {
    shape: { id: "user-shape", description: "TODO: describe this element" },
  },
  sequences: {
    trigger: [
      {
        element: "shape",
        property: "scale",
        values: [1, 1.12, 1],
        duration: 0.5,
        ease: "easeInOut",
        origin: { x: 12, y: 12 },
      },
    ],
  },
  defaultTrigger: "hover",
};

export default userSpec;
