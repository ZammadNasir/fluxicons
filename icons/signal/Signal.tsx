"use client";

import type { IconProps } from "@/lib/icon-registry";
import { FluxIcon } from "@/lib/runtime/react/flux-icon";
import { forwardRef } from "react";
import signalSpec from "./animation.spec";
import { signalPaths } from "./paths";

/**
 * Signal — four ascending signal-strength bars.
 * Animation: the bars compress and spring back in a staggered cascade, like a pulse sweeping across the signal.
 */
const Signal = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <FluxIcon
    ref={ref}
    name="Signal"
    paths={signalPaths}
    spec={signalSpec}
    {...props}
  />
));

Signal.displayName = "Signal";
export default Signal;
