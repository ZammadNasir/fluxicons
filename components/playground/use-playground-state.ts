"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getIconMetadata, type AnimationTrigger } from "@/lib/icon-registry";
import { clamp } from "@/lib/utils";

export interface PlaygroundState {
  slug: string;
  size: number;
  color: string;
  strokeWidth: number;
  trigger: AnimationTrigger;
  speed: number;
  loop: boolean;
  delay: number;
}

export const PLAYGROUND_DEFAULTS: PlaygroundState = {
  slug: "clock",
  size: 48,
  color: "currentColor",
  strokeWidth: 1.5,
  trigger: "hover",
  speed: 1,
  loop: false,
  delay: 0,
};

const TRIGGERS: AnimationTrigger[] = [
  "hover",
  "hoverHold",
  "click",
  "inView",
  "autoplay",
  "none",
];

/**
 * The trigger an icon is authored to lead with (mirrored from its
 * `animation.spec.ts` into the registry). Selecting an icon adopts this, so
 * e.g. Download starts on `hoverHold`. Falls back to the global default for
 * unknown slugs.
 */
function defaultTriggerFor(slug: string): AnimationTrigger {
  return getIconMetadata(slug)?.defaultTrigger ?? PLAYGROUND_DEFAULTS.trigger;
}

/** The icon's authored default `loop` (mirrored from its spec into the registry). */
function defaultLoopFor(slug: string): boolean {
  return getIconMetadata(slug)?.defaultLoop ?? PLAYGROUND_DEFAULTS.loop;
}

/** Parse a state object from URL search params, falling back to defaults. */
function fromParams(
  params: URLSearchParams,
  initial: PlaygroundState,
): PlaygroundState {
  const num = (key: string, fallback: number) => {
    const raw = params.get(key);
    const parsed = raw === null ? NaN : Number(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const slug = params.get("icon") ?? initial.slug;
  const triggerRaw = params.get("trigger") as AnimationTrigger | null;
  return {
    slug,
    size: clamp(num("size", initial.size), 16, 128),
    color: params.get("color") ?? initial.color,
    strokeWidth: clamp(num("strokeWidth", initial.strokeWidth), 0.5, 3),
    // No explicit trigger in the URL → adopt the icon's authored default.
    trigger:
      triggerRaw && TRIGGERS.includes(triggerRaw)
        ? triggerRaw
        : defaultTriggerFor(slug),
    speed: clamp(num("speed", initial.speed), 0.1, 3),
    // No explicit loop in the URL → adopt the icon's authored default.
    loop:
      params.get("loop") === null
        ? defaultLoopFor(slug)
        : params.get("loop") === "true",
    delay: clamp(num("delay", initial.delay), 0, 5),
  };
}

/** Serialize only the values that differ from defaults into search params. */
function toParams(state: PlaygroundState): URLSearchParams {
  const params = new URLSearchParams();
  params.set("icon", state.slug);
  if (state.size !== PLAYGROUND_DEFAULTS.size) params.set("size", String(state.size));
  if (state.color !== PLAYGROUND_DEFAULTS.color) params.set("color", state.color);
  if (state.strokeWidth !== PLAYGROUND_DEFAULTS.strokeWidth)
    params.set("strokeWidth", String(state.strokeWidth));
  // Only serialize the trigger when it differs from the icon's default, so
  // default links stay clean and still round-trip to the right trigger.
  if (state.trigger !== defaultTriggerFor(state.slug))
    params.set("trigger", state.trigger);
  if (state.speed !== PLAYGROUND_DEFAULTS.speed) params.set("speed", String(state.speed));
  // Serialize loop only when it differs from the icon's default (both ways),
  // so default links stay clean and still round-trip.
  if (state.loop !== defaultLoopFor(state.slug))
    params.set("loop", String(state.loop));
  if (state.delay !== PLAYGROUND_DEFAULTS.delay) params.set("delay", String(state.delay));
  return params;
}

interface UsePlaygroundStateOptions {
  /** Sync state to the URL search params (shareable links). */
  syncUrl?: boolean;
  /** Override the starting state. */
  initial?: Partial<PlaygroundState>;
}

/**
 * Owns the playground's control state. When `syncUrl` is set, the initial
 * state is hydrated from the URL and subsequent edits are written back via
 * `router.replace`, so playground links round-trip.
 */
export function usePlaygroundState({
  syncUrl = false,
  initial,
}: UsePlaygroundStateOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const baseDefaults = { ...PLAYGROUND_DEFAULTS, ...initial };
  // Unless the caller pinned them, lead with the icon's authored defaults.
  if (!initial?.trigger) baseDefaults.trigger = defaultTriggerFor(baseDefaults.slug);
  if (initial?.loop === undefined) baseDefaults.loop = defaultLoopFor(baseDefaults.slug);

  const [state, setState] = useState<PlaygroundState>(() =>
    syncUrl
      ? fromParams(new URLSearchParams(searchParams.toString()), baseDefaults)
      : baseDefaults,
  );

  // Avoid writing to the URL on the very first render.
  const hydrated = useRef(false);

  useEffect(() => {
    if (!syncUrl) return;
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    const query = toParams(state).toString();
    router.replace(`${pathname}?${query}`, { scroll: false });
  }, [state, syncUrl, pathname, router]);

  const setField = useCallback(
    <K extends keyof PlaygroundState>(key: K, value: PlaygroundState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // Selecting an icon adopts its authored default trigger + loop (e.g. Download
  // → hoverHold), while keeping the other controls where the user left them.
  const selectIcon = useCallback((slug: string) => {
    setState((prev) => ({
      ...prev,
      slug,
      trigger: defaultTriggerFor(slug),
      loop: defaultLoopFor(slug),
    }));
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...PLAYGROUND_DEFAULTS,
      slug: prev.slug,
      trigger: defaultTriggerFor(prev.slug),
      loop: defaultLoopFor(prev.slug),
    }));
  }, []);

  return { state, setField, selectIcon, reset };
}
