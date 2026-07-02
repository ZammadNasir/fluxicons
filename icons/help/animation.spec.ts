import type { AnimationSpec } from "@/lib/animation-spec";

const helpSpec: AnimationSpec = {
  elements: {
    question: { id: "help-question", description: "Question mark" },
    dot: { id: "help-dot", description: "Question mark dot" },
    circle: { id: "help-circle", description: "Outer circle" },
  },
  sequences: {
    trigger: [
      {
        element: "question",
        property: "scale",
        values: [1, 1.12, 0.96, 1.06, 1],
        duration: 0.55,
        ease: "easeInOut",
        origin: { x: 12, y: 12 },
      },
      {
        element: "dot",
        property: "translateY",
        values: [0, -1.5, 0],
        duration: 0.55,
        ease: "easeInOut",
      },
    ],
  },
  defaultTrigger: "hover",
};

export default helpSpec;
