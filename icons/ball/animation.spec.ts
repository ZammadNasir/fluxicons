import type { AnimationSpec } from "@/lib/animation-spec";

const ballSpec: AnimationSpec = {
  elements: {
    ball: { id: "ball", description: "The ball that squashes and stretches." },
    ground: { id: "ground", description: "The static ground line." },
  },
  sequences: {
    // Non-uniform scale around the ball's base (12,15): it widens + flattens on
    // impact, then stretches tall before settling. No perspective involved.
    trigger: [
      {
        element: "ball",
        property: "scaleY",
        values: [1, 0.78, 1.08, 1],
        duration: 0.55,
        ease: "easeOut",
        origin: { x: 12, y: 15 },
      },
      {
        element: "ball",
        property: "scaleX",
        values: [1, 1.22, 0.96, 1],
        duration: 0.55,
        ease: "easeOut",
        origin: { x: 12, y: 15 },
      },
    ],
  },
  defaultTrigger: "hover",
};

export default ballSpec;
