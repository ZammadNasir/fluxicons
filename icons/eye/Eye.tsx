"use client";

import type { IconProps } from "@/lib/icon-registry";
import { FluxIcon } from "@/lib/runtime/react/flux-icon";
import { forwardRef } from "react";
import eyeSpec from "./animation.spec";
import { eyePaths } from "./paths";

/**
 * Eye — half-closing eye icon.
 * On trigger the upper lid lowers over the eye and holds it half-closed.
 */
const Eye = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <FluxIcon ref={ref} name="Eye" paths={eyePaths} spec={eyeSpec} {...props} />
));

Eye.displayName = "Eye";

export default Eye;
