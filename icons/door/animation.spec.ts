import type { AnimationSpec } from "@/lib/animation-spec";

const doorSpec: AnimationSpec = {
  elements: {
    panel: {
      id: "door-panel",
      description: "The door swings open in 3D around its left hinge.",
    },
  },
  sequences: {
    trigger: [
      {
        element: "panel",
        property: "rotateY",
        values: [0, -55, 0],
        duration: 0.6,
        ease: "easeInOut",
        origin: { x: 7, y: 12 }, // left edge (hinge)
      },
      {
        element: "panel",
        property: "scaleX",
        values: [1, 0.85, 1],
        duration: 0.6,
        ease: "easeInOut",
        origin: { x: 7, y: 12 }, // foreshorten toward the hinge as it swings
      },
    ],
  },
  defaultTrigger: "hoverHold",
  perspective: 500,
};

export default doorSpec;
