import type { AnimationSpec } from "@/lib/animation-spec";

const eyeSpec: AnimationSpec = {
  elements: {
    outline: { id: "eye-outline", description: "Eye outline" },
    pupil: { id: "eye-pupil", description: "Eye pupil" },
    upperLid: { id: "eye-upperLid", description: "Upper eyelid blink motion" },
  },
  sequences: {
    // The upper lid lowers down over the eye to roughly the centre and back.
    // Round-trip values (0 → 7 → 0): `hoverHold` trims the return frame to hold
    // the lid half-closed (lifting on leave), while `hover`/`click`/`inView`
    // play the full drop-and-lift as a one-shot half-blink.
    trigger: [
      {
        element: "upperLid",
        property: "translateY",
        values: [0, 7, 0],
        duration: 0.4,
        ease: "easeInOut",
      },
    ],
  },
  defaultTrigger: "hoverHold",
};

export default eyeSpec;
