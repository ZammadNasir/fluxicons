import type { AnimationSpec } from "@/lib/animation-spec";

const checkSpec: AnimationSpec = {
  elements: {
    checkmark: { id: "check-path", description: "Checkmark path" },
  },
  sequences: {
    trigger: [
      {
        element: "checkmark",
        property: "pathLength",
        from: 0,
        to: 1,
        duration: 0.4,
        ease: "easeOut",
      },
    ],
    mount: [
      {
        element: "checkmark",
        property: "pathLength",
        from: 0,
        to: 1,
        duration: 0.4,
        ease: "easeOut",
      },
    ],
  },
  defaultTrigger: "hover",
};

export default checkSpec;
