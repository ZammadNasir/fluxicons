"use client";

import { IconRenderer } from "./icon-renderer";
import type { PlaygroundState } from "./use-playground-state";
import { getIconMetadata } from "@/lib/icon-registry";

interface PreviewPanelProps {
  state: PlaygroundState;
  /** Bump to replay trigger-based animations from the start. */
  replayKey?: string | number;
}

/** Large centered live preview of the icon on a subtle checkerboard surface. */
export function PreviewPanel({ state, replayKey }: PreviewPanelProps) {
  const meta = getIconMetadata(state.slug);
  const previewColor = state.color === "currentColor" ? undefined : state.color;

  return (
    <div className="flex h-full flex-col">
      <div className="bg-checkerboard relative flex flex-1 items-center justify-center rounded-xl border border-border p-8">
        <div className="text-foreground" style={{ color: previewColor }}>
          <IconRenderer
            slug={state.slug}
            size={state.size}
            color={state.color}
            strokeWidth={state.strokeWidth}
            trigger={state.trigger}
            speed={state.speed}
            loop={state.loop}
            delay={state.delay}
            replayKey={replayKey}
            aria-label={meta ? `${meta.name} icon preview` : "Icon preview"}
          />
        </div>
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-xs text-foreground-subtle">
          {state.size}px
        </span>
      </div>
      {meta && (
        <p className="mt-3 text-center text-sm font-medium text-foreground">
          {meta.name}
        </p>
      )}
    </div>
  );
}
