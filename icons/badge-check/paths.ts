import type { IconPaths } from "@/lib/animation-spec";

export const badgeCheckPaths = {
  badge: {
    type: "path",
    d: "M12 3l2.1 1.2 2.4-.3 1.2 2.1 2.1 1.2-.3 2.4L21 12l-1.2 2.1.3 2.4-2.1 1.2-1.2 2.1-2.4-.3L12 21l-2.1-1.2-2.4.3-1.2-2.1-2.1-1.2.3-2.4L3 12l1.2-2.1-.3-2.4 2.1-1.2 1.2-2.1 2.4.3L12 3",
  },
  check: {
    type: "path",
    d: "M9 12.5l2 2 4-4",
  },
} satisfies IconPaths;

export const viewBox = "0 0 24 24";
