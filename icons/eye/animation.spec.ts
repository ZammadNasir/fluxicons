import type { AnimationSpec } from "@/lib/animation-spec";

const eyeSpec: AnimationSpec = {
  elements: {
    outline: { id: "eye-outline", description: "Eye outline" },
    pupil: { id: "eye-pupil", description: "Eye pupil" },
    upperLid: { id: "eye-upperLid", description: "Upper eyelid blink motion" },
  },
  sequences: {
    trigger: [
      {
        element: "upperLid",
        property: "translateY",
        values: [-6, 0, -6],
        duration: 0.45,
        ease: "easeInOut",
      },
      {
        element: "pupil",
        property: "scale",
        values: [1, 0.88, 1],
        duration: 0.45,
        ease: "easeInOut",
        origin: { x: 12, y: 12 },
      },
    ],
  },
  defaultTrigger: "hoverHold",
};

export default eyeSpec;
