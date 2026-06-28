import type { AnimationSpec } from "@/lib/animation-spec";

const loaderSpec: AnimationSpec = {
  elements: {
    arc: { id: "loader-arc", description: "Spinning arc" },
  },
  sequences: {
    continuous: [
      {
        element: "arc",
        property: "rotate",
        from: 0,
        to: 360,
        duration: 1,
        ease: "linear",
        repeat: true,
        origin: { x: 12, y: 12 },
      },
    ],
  },
  defaultTrigger: "autoplay",
  alwaysLoop: true,
};

export default loaderSpec;
