import { forwardRef } from "react";
import { Slot } from "./slot";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render as the child element (e.g. an `<a>` or Next `<Link>`). */
  asChild?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-foreground text-background hover:bg-foreground/90 shadow-sm",
  secondary:
    "bg-background-subtle text-foreground hover:bg-background-muted border border-border",
  outline:
    "bg-transparent text-foreground border border-border-strong hover:bg-background-subtle",
  ghost: "bg-transparent text-foreground-muted hover:bg-background-subtle hover:text-foreground",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-base rounded-lg gap-2",
  icon: "h-9 w-9 rounded-lg",
};

/**
 * Primary interactive control. Supports brand-led variants and `asChild`
 * composition for links. Fully keyboard focusable with a visible ring.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex select-none items-center justify-center font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          VARIANTS[variant],
          SIZES[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
