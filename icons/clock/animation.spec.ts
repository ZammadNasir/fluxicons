import type { AnimationSpec } from "@/lib/animation-spec";

const clockSpec: AnimationSpec = {
  elements: {
    hourHand: { id: "clock-hour-hand", description: "Hour hand" },
    minuteHand: { id: "clock-minute-hand", description: "Minute hand" },
  },
  sequences: {
    trigger: [
      {
        element: "minuteHand",
        property: "rotate",
        values: [0, 360],
        duration: 0.8,
        ease: "easeInOut",
        origin: { x: 12, y: 12 },
      },
      {
        element: "hourHand",
        property: "rotate",
        values: [0, 30],
        duration: 0.8,
        ease: "easeInOut",
        origin: { x: 12, y: 12 },
      },
    ],
  },
  defaultTrigger: "hover",
};

export default clockSpec;
