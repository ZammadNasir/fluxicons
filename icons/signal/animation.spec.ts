import type { AnimationSpec } from "@/lib/animation-spec";

const signalSpec: AnimationSpec = {
  elements: {
    bar1: { id: "signal-bar1", description: "Signal bar 1 (shortest)" },
    bar2: { id: "signal-bar2", description: "Signal bar 2" },
    bar3: { id: "signal-bar3", description: "Signal bar 3" },
    bar4: { id: "signal-bar4", description: "Signal bar 4 (tallest)" },
  },
  sequences: {
    trigger: [
      {
        element: "bar1",
        property: "scaleY",
        values: [1, 0.4, 1],
        duration: 0.4,
        ease: "easeInOut",
        origin: { x: 4, y: 20 },
      },
      {
        element: "bar2",
        property: "scaleY",
        values: [1, 0.4, 1],
        duration: 0.5,
        ease: "easeInOut",
        origin: { x: 9, y: 20 },
      },
      {
        element: "bar3",
        property: "scaleY",
        values: [1, 0.4, 1],
        duration: 0.6,
        ease: "easeInOut",
        origin: { x: 14, y: 20 },
      },
      {
        element: "bar4",
        property: "scaleY",
        values: [1, 0.4, 1],
        duration: 0.7,
        ease: "easeInOut",
        origin: { x: 19, y: 20 },
      },
    ],
  },
  defaultTrigger: "hover",
};

export default signalSpec;
