"use client";

import { useMemo } from "react";
import { PreviewPanel } from "./preview-panel";
import { ControlsPanel } from "./controls-panel";
import { CodePanel } from "./code-panel";
import { IconSelector } from "./icon-selector";
import {
  usePlaygroundState,
  type PlaygroundState,
} from "./use-playground-state";

interface PlaygroundProps {
  /** "embedded" omits the icon selector (landing page); "full" shows it. */
  variant?: "embedded" | "full";
  /** Sync control state to the URL for shareable links. */
  syncUrl?: boolean;
  /** Override the starting state (e.g. lock to one icon). */
  initial?: Partial<PlaygroundState>;
  /** Hide the icon selector even in full variant (single-icon pages). */
  lockIcon?: boolean;
}

/**
 * The customization surface: live preview + controls + generated code, with an
 * optional icon selector. Shared by the landing page, the `/playground` route,
 * and individual icon pages.
 */
export function Playground({
  variant = "embedded",
  syncUrl = false,
  initial,
  lockIcon = false,
}: PlaygroundProps) {
  const { state, setField, reset } = usePlaygroundState({ syncUrl, initial });

  // Remount the preview when animation-affecting props change so the
  // animation re-arms from its resting pose.
  const replayKey = useMemo(
    () =>
      `${state.slug}-${state.trigger}-${state.loop}-${state.speed}-${state.delay}`,
    [state.slug, state.trigger, state.loop, state.speed, state.delay],
  );

  const showSelector = variant === "full" && !lockIcon;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-card">
      <div
        className={
          showSelector
            ? "grid grid-cols-1 divide-border lg:grid-cols-[260px_1fr_minmax(360px,420px)] lg:divide-x"
            : "grid grid-cols-1 divide-border lg:grid-cols-[1fr_minmax(340px,400px)] lg:divide-x"
        }
      >
        {showSelector && (
          <div className="max-h-[560px] border-b border-border p-4 lg:max-h-none lg:border-b-0">
            <IconSelector
              selected={state.slug}
              onSelect={(slug) => setField("slug", slug)}
            />
          </div>
        )}

        <div className="border-b border-border p-6 lg:border-b-0">
          <PreviewPanel state={state} replayKey={replayKey} />
        </div>

        <div className="flex flex-col gap-6 p-6">
          <ControlsPanel state={state} setField={setField} reset={reset} />
          <CodePanel state={state} />
        </div>
      </div>
    </div>
  );
}
