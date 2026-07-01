import type { AnimationSpec } from "@/lib/animation-spec";

const userSpec: AnimationSpec = {
  elements: {
    shape: { id: "user-shape", description: "The user silhouette." },
  },
  sequences: {
    // A gentle pop with a side-to-side wobble (scale + rotate around center),
    // matching the React component.
    trigger: [
      {
        element: "shape",
        property: "scale",
        values: [1, 1.08, 1],
        duration: 0.6,
        ease: "easeInOut",
        origin: { x: 12, y: 12 },
      },
      {
        element: "shape",
        property: "rotate",
        values: [0, -3, 3, 0],
        duration: 0.6,
        ease: "easeInOut",
        origin: { x: 12, y: 12 },
      },
    ],
  },
  defaultTrigger: "hover",
};

export default userSpec;
