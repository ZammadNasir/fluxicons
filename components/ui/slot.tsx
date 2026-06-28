import { Children, cloneElement, isValidElement, forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Minimal `asChild` slot: merges this component's props (and className) onto
 * its single child element, instead of rendering its own DOM node. A tiny,
 * dependency-free stand-in for Radix's `Slot`.
 */
export const Slot = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ children, className, ...slotProps }, ref) => {
    if (!isValidElement(children)) {
      return null;
    }
    const child = children as React.ReactElement<
      React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
    >;
    Children.only(children);

    return cloneElement(child, {
      ...slotProps,
      ...child.props,
      ref,
      className: cn(className, child.props.className),
    });
  },
);

Slot.displayName = "Slot";
