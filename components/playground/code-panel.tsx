"use client";

import { useMemo, useState } from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { GENERATORS } from "@/lib/generators";
import { cn } from "@/lib/utils";
import type { PlaygroundState } from "./use-playground-state";

interface CodePanelProps {
  state: PlaygroundState;
}

/** Framework-tabbed, copy-ready code output for the current icon state. */
export function CodePanel({ state }: CodePanelProps) {
  const [activeId, setActiveId] = useState(GENERATORS[0].id);
  const generator = GENERATORS.find((g) => g.id === activeId) ?? GENERATORS[0];

  // Memoized so code only regenerates when state or framework changes.
  const output = useMemo(
    () =>
      generator.generate({
        slug: state.slug,
        size: state.size,
        color: state.color,
        strokeWidth: state.strokeWidth,
        trigger: state.trigger,
        speed: state.speed,
        loop: state.loop,
        delay: state.delay,
      }),
    [generator, state],
  );

  return (
    <div className="flex flex-col gap-3">
      <div
        role="tablist"
        aria-label="Framework"
        className="flex items-center gap-1 border-b border-border"
      >
        {GENERATORS.map((g) => {
          const active = g.id === activeId;
          return (
            <button
              key={g.id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setActiveId(g.id)}
              className={cn(
                "-mb-px border-b-2 px-3 py-2 text-sm transition-colors",
                active
                  ? "border-foreground text-foreground"
                  : "border-transparent text-foreground-muted hover:text-foreground",
              )}
            >
              {g.label}
            </button>
          );
        })}
      </div>
      <CodeBlock code={output.code} language={generator.language} />
      {generator.dependencies && (
        <p className="text-xs text-foreground-subtle">
          <span className="font-medium text-foreground-muted">Dependencies:</span>{" "}
          {generator.dependencies}
        </p>
      )}
    </div>
  );
}
