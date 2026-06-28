import { cn } from "@/lib/utils";

/**
 * FluxIcons wordmark: a geometric monogram mark (a stylized motion glyph)
 * paired with the product name. Used in the navbar and footer.
 */
export function Wordmark({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-foreground"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="text-background"
        >
          {/* A flux/bolt mark: three sweeping strokes implying motion. */}
          <path
            d="M13 3L5 13h5l-1 8 8-10h-5l1-8z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showText && (
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          FluxIcons
        </span>
      )}
    </span>
  );
}
