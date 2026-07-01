import type { AnimationSpec } from "@/lib/animation-spec";

const cardFlipSpec: AnimationSpec = {
  elements: {
    card: { id: "card", description: "The card body." },
    line: { id: "card-line", description: "The content line on the card." },
  },
  sequences: {
    // Both elements rotate identically around the card's center, so the whole
    // card flips forward as one rigid surface (3D rotation around the X axis).
    trigger: [
      {
        element: "card",
        property: "rotateX",
        values: [0, 180, 360],
        duration: 0.7,
        ease: "easeInOut",
        origin: { x: 12, y: 12 },
      },
      {
        element: "line",
        property: "rotateX",
        values: [0, 180, 360],
        duration: 0.7,
        ease: "easeInOut",
        origin: { x: 12, y: 12 },
      },
    ],
  },
  defaultTrigger: "hover",
  perspective: 500,
};

export default cardFlipSpec;
