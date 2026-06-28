"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type ThemeChoice = "light" | "dark" | "system";
const ORDER: ThemeChoice[] = ["light", "dark", "system"];
const ICON = { light: Sun, dark: Moon, system: Monitor } as const;
const LABEL = { light: "Light", dark: "Dark", system: "System" } as const;

/**
 * Cycles Light → Dark → System. next-themes resolves `theme` after mount, so
 * the server and first client render both fall back to the System icon — no
 * hydration mismatch, and the icon swaps in once the theme is known.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const current: ThemeChoice =
    theme === "light" || theme === "dark" ? theme : "system";
  const Icon = ICON[current];

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={cycle}
      suppressHydrationWarning
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground-muted transition-colors hover:bg-background-subtle hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none",
        className,
      )}
      aria-label={`Theme: ${LABEL[current]}. Click to change.`}
      title={`Theme: ${LABEL[current]}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
