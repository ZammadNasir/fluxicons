"use client";

import { RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { SegmentedControl } from "@/components/ui/segmented-control";
import type { AnimationTrigger } from "@/lib/icon-registry";
import { clamp, snapToStep } from "@/lib/utils";
import type { PlaygroundState } from "./use-playground-state";

interface ControlsPanelProps {
  state: PlaygroundState;
  setField: <K extends keyof PlaygroundState>(
    key: K,
    value: PlaygroundState[K],
  ) => void;
  reset: () => void;
}

const TRIGGER_OPTIONS: { label: string; value: AnimationTrigger }[] = [
  { label: "Hover", value: "hover" },
  { label: "Click", value: "click" },
  { label: "In view", value: "inView" },
  { label: "Auto", value: "autoplay" },
  { label: "None", value: "none" },
];

const FALLBACK_HEX = "#6366F1";

function Row({ label, value, children }: {
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {value !== undefined && (
          <span className="font-mono text-xs text-foreground-muted">{value}</span>
        )}
      </div>
      {children}
    </div>
  );
}

/** All visual + animation controls for the playground. */
export function ControlsPanel({ state, setField, reset }: ControlsPanelProps) {
  const colorHex = state.color === "currentColor" ? FALLBACK_HEX : state.color;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Controls</h3>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-foreground-muted transition-colors hover:bg-background-subtle hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <Row label="Size" value={`${state.size}px`}>
        <div className="flex items-center gap-3">
          <Slider
            value={state.size}
            min={16}
            max={128}
            step={4}
            aria-label="Icon size"
            onValueChange={(v) => setField("size", v)}
          />
          <input
            type="number"
            min={16}
            max={128}
            step={4}
            value={state.size}
            onChange={(e) =>
              setField("size", clamp(Number(e.target.value) || 16, 16, 128))
            }
            className="h-8 w-16 rounded-md border border-border bg-background px-2 text-sm tabular-nums focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
          />
        </div>
      </Row>

      <Row label="Color">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={colorHex}
            aria-label="Pick color"
            onChange={(e) => setField("color", e.target.value)}
            className="h-9 w-9 shrink-0 cursor-pointer rounded-md border border-border bg-background p-1"
          />
          <input
            type="text"
            value={state.color}
            spellCheck={false}
            aria-label="Color value"
            onChange={(e) => setField("color", e.target.value)}
            className="h-9 flex-1 rounded-md border border-border bg-background px-2 font-mono text-sm focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
          />
          {state.color !== "currentColor" && (
            <button
              type="button"
              onClick={() => setField("color", "currentColor")}
              className="h-9 rounded-md border border-border px-2 text-xs text-foreground-muted transition-colors hover:bg-background-subtle hover:text-foreground"
            >
              currentColor
            </button>
          )}
        </div>
      </Row>

      <Row label="Stroke width" value={state.strokeWidth.toString()}>
        <Slider
          value={state.strokeWidth}
          min={0.5}
          max={3}
          step={0.25}
          aria-label="Stroke width"
          onValueChange={(v) => setField("strokeWidth", snapToStep(v, 0.25, 0.5, 3))}
        />
      </Row>

      <Row label="Speed" value={`${state.speed}×`}>
        <Slider
          value={state.speed}
          min={0.1}
          max={3}
          step={0.1}
          aria-label="Animation speed"
          onValueChange={(v) => setField("speed", snapToStep(v, 0.1, 0.1, 3))}
        />
      </Row>

      <Row label="Trigger">
        <SegmentedControl
          options={TRIGGER_OPTIONS}
          value={state.trigger}
          aria-label="Animation trigger"
          onValueChange={(v) => setField("trigger", v)}
        />
      </Row>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Loop</label>
        <Switch
          checked={state.loop}
          onCheckedChange={(v) => setField("loop", v)}
          aria-label="Loop animation"
        />
      </div>

      <Row label="Delay" value={`${state.delay}s`}>
        <input
          type="number"
          min={0}
          max={5}
          step={0.1}
          value={state.delay}
          onChange={(e) =>
            setField("delay", clamp(Number(e.target.value) || 0, 0, 5))
          }
          className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm tabular-nums focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
        />
      </Row>
    </div>
  );
}
