"use client";

import { forwardRef } from "react";
import type { IconProps } from "@/lib/icon-registry";
import { FluxIcon } from "@/lib/runtime/react/flux-icon";
import downloadSpec from "./animation.spec";
import { downloadPaths } from "./paths";

/**
 * Download — downward arrow above a tray.
 * Animation: the arrow drops into the tray, which compresses slightly before both settle.
 */
const Download = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <FluxIcon
    ref={ref}
    name="Download"
    paths={downloadPaths}
    spec={downloadSpec}
    {...props}
  />
));

Download.displayName = "Download";
export default Download;
