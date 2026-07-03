import { Suspense } from "react";
import type { Metadata } from "next";
import { Playground } from "@/components/playground/playground";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Customize any Rehover icon — size, color, stroke, speed, and trigger — then copy the exact code. Shareable via URL.",
};

function PlaygroundFallback() {
  return (
    <div className="h-[560px] animate-pulse rounded-2xl border border-border bg-background-subtle" />
  );
}

export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="mb-8">
        <h1 className="tracking-display text-3xl font-semibold text-foreground sm:text-4xl">
          Playground
        </h1>
        <p className="mt-2 max-w-xl text-base text-foreground-muted">
          Tune every property and copy production-ready code. Your settings live
          in the URL, so any configuration is instantly shareable.
        </p>
      </header>
      {/* useSearchParams in the playground requires a Suspense boundary. */}
      <Suspense fallback={<PlaygroundFallback />}>
        <Playground variant="full" syncUrl />
      </Suspense>
    </div>
  );
}
