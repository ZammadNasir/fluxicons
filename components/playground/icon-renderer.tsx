"use client";

import { useEffect, useState } from "react";
import { getIconComponent, type IconProps } from "@/lib/icon-registry";
import { cn } from "@/lib/utils";

interface IconRendererProps extends IconProps {
  slug: string;
  /** Remounts the icon when this changes (re-arms trigger-based animations). */
  replayKey?: string | number;
}

/**
 * Lazily loads and renders an icon by slug. Each icon is its own chunk, so this
 * never pulls in the whole library. Shows a skeleton while the chunk loads.
 */
interface LoadedIcon {
  slug: string;
  Comp: React.ComponentType<IconProps>;
}

export function IconRenderer({ slug, replayKey, ...iconProps }: IconRendererProps) {
  // State is only ever set from async callbacks (never synchronously in the
  // effect body), and is keyed by slug so stale results are ignored on render.
  const [loaded, setLoaded] = useState<LoadedIcon | null>(null);
  const [failedSlug, setFailedSlug] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getIconComponent(slug)
      .then((component) => {
        if (active) setLoaded({ slug, Comp: component });
      })
      .catch(() => {
        if (active) setFailedSlug(slug);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const ready = loaded?.slug === slug;

  if (!ready && failedSlug === slug) {
    return (
      <span className="text-xs text-foreground-subtle">Failed to load icon</span>
    );
  }

  if (!ready) {
    return (
      <span
        aria-hidden
        className={cn("animate-pulse rounded-md bg-background-muted")}
        style={{ width: iconProps.size ?? 24, height: iconProps.size ?? 24 }}
      />
    );
  }

  const Comp = loaded.Comp;
  return <Comp key={replayKey} {...iconProps} />;
}
