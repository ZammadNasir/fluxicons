import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "./section-heading";

interface Framework {
  name: string;
  glyph: string;
  description: string;
}

const FRAMEWORKS: Framework[] = [
  {
    name: "React / Next.js",
    glyph: "⚛",
    description: "Framer Motion components. Copy or use the CLI.",
  },
  {
    name: "Vue 3",
    glyph: "V",
    description: "Script setup components with CSS keyframe animations.",
  },
];

export function FrameworksSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading title="Works where you work." />
      <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        {FRAMEWORKS.map((fw) => (
          <div
            key={fw.name}
            className="flex items-start gap-4 rounded-xl border border-border bg-background-subtle p-6"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-2xl text-foreground">
              {fw.glyph}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {fw.name}
                </span>
                <Badge variant="brand">Available</Badge>
              </div>
              <p className="mt-1 text-sm text-foreground-muted">
                {fw.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-foreground-subtle">
        Svelte · Angular · SwiftUI — on the roadmap.
      </p>
    </section>
  );
}
