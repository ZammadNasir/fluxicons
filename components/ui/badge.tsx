import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "brand" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const VARIANTS: Record<BadgeVariant, string> = {
  default: "bg-foreground text-background",
  secondary: "bg-background-subtle text-foreground-muted border border-border",
  brand: "bg-brand/10 text-brand border border-brand/20",
  outline: "text-foreground-muted border border-border",
};

/** Small inline metadata pill (counts, categories, "New", tags). */
export function Badge({ className, variant = "secondary", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
