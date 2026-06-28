import { Suspense } from "react";
import { Playground } from "@/components/playground/playground";
import { SectionHeading } from "./section-heading";

export function PlaygroundSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        title="Customize everything."
        subtitle="Adjust properties and copy the exact code for your project."
      />
      <div className="mt-12">
        <Suspense
          fallback={
            <div className="h-[520px] animate-pulse rounded-2xl border border-border bg-background-subtle" />
          }
        >
          <Playground variant="embedded" />
        </Suspense>
      </div>
    </section>
  );
}
