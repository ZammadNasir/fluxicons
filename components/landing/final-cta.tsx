import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground px-6 py-20 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(50% 80% at 50% 0%, hsl(var(--brand) / 0.5), transparent 70%)",
          }}
        />
        <h2 className="tracking-display relative text-3xl font-semibold text-background sm:text-5xl">
          Build interfaces that move.
        </h2>
        <p className="relative mx-auto mt-4 max-w-md text-base text-background/70">
          Start for free. Own your icons.
        </p>
        <div className="relative mt-8 flex justify-center">
          <Button asChild size="lg" variant="secondary">
            <Link href="/icons">
              Browse Icons
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
