import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroIconGrid } from "./hero-icon-grid";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle brand glow backdrop, top-only. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, hsl(var(--brand) / 0.14), transparent 70%)",
        }}
      />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[3fr_2fr] lg:py-28">
        <div className="flex flex-col items-start">
          <Badge variant="brand" className="mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Open Source · Free to use
          </Badge>
          <h1 className="tracking-display-tight text-[44px] leading-[1.02] font-semibold text-balance text-foreground sm:text-6xl lg:text-[72px]">
            Animated icons,
            <br />
            built for modern interfaces.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-foreground-muted">
            Production-ready animated icons with customizable motion and
            copy-ready components for React, Next.js, and beyond.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/icons">
                Explore Icons
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/docs">View Documentation</Link>
            </Button>
          </div>
        </div>

        <HeroIconGrid />
      </div>
    </section>
  );
}
