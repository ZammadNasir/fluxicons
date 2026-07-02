import type { AnimationSpec } from "@/lib/animation-spec";

const layersSpec: AnimationSpec = {
  elements: {
    base: { id: "layers-base", description: "Bottom layer" },
    middle: { id: "layers-middle", description: "Middle layer" },
    top: { id: "layers-top", description: "Top layer" },
  },
  sequences: {
    trigger: [
      {
        element: "base",
        property: "translateY",
        values: [0, 0, 0],
        duration: 0.7,
        ease: "easeInOut",
      },
      {
        element: "middle",
        property: "translateY",
        values: [0, -4, 0],
        duration: 0.7,
        ease: "easeInOut",
      },
      {
        element: "top",
        property: "translateY",
        values: [0, -8, 0],
        duration: 0.7,
        ease: "easeInOut",
      },
      {
        element: "middle",
        property: "scale",
        values: [1, 1.03, 1],
        duration: 0.7,
        ease: "easeInOut",
      },
      {
        element: "top",
        property: "scale",
        values: [1, 1.06, 1],
        duration: 0.7,
        ease: "easeInOut",
      },
    ],
  },
  defaultTrigger: "hover",
};

export default layersSpec;
