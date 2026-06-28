import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "left" | "center";
  className?: string;
}

/** Consistent section title block: optional mono eyebrow, title, subtitle. */
export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <span className="font-mono text-xs tracking-wide text-foreground-subtle uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="tracking-display max-w-2xl text-3xl font-semibold text-balance text-foreground sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-xl text-base text-foreground-muted">{subtitle}</p>
      )}
    </div>
  );
}
