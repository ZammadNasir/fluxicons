import type { AnimationSpec } from "@/lib/animation-spec";

const wifiSpec: AnimationSpec = {
  elements: {
    outer: { id: "wifi-outer", description: "Outer wifi signal arc" },
    middle: { id: "wifi-middle", description: "Middle wifi signal arc" },
    inner: { id: "wifi-inner", description: "Wifi signal dot" },
  },
  sequences: {
    trigger: [
      {
        element: "inner",
        property: "opacity",
        values: [1, 0, 1],
        duration: 0.6,
        ease: "easeInOut",
      },
      {
        element: "middle",
        property: "pathLength",
        values: [1, 0, 1],
        duration: 0.6,
        ease: "easeInOut",
      },
      {
        element: "outer",
        property: "pathLength",
        values: [1, 0, 1],
        duration: 0.6,
        ease: "easeInOut",
      },
    ],
  },
  defaultTrigger: "hover",
};

export default wifiSpec;
