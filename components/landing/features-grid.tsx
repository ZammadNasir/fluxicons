import {
  Copy,
  Moon,
  MousePointerClick,
  SlidersHorizontal,
  TerminalSquare,
  Boxes,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "./section-heading";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: MousePointerClick,
    title: "Hover & Click Triggers",
    description: "Animate on hover, click, or scroll into view.",
  },
  {
    icon: SlidersHorizontal,
    title: "Fully Customizable",
    description: "Control size, color, speed, and stroke weight.",
  },
  {
    icon: Copy,
    title: "Copy-Ready Code",
    description: "Get framework-specific code with one click.",
  },
  {
    icon: TerminalSquare,
    title: "CLI Workflow",
    description: "Add icons to your project. Own the source code.",
  },
  {
    icon: Moon,
    title: "Dark Mode Native",
    description: "Every icon works with currentColor out of the box.",
  },
  {
    icon: Boxes,
    title: "Framework Agnostic",
    description: "React, Next.js, Vue, React Native, and Flutter — from one spec.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        title="Everything you need to ship motion."
        subtitle="A developer-first workflow from browse to production."
      />
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-xl border border-border bg-background-subtle p-6 transition-colors hover:border-border-strong"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">
              {title}
            </h3>
            <p className="mt-1.5 text-sm text-foreground-muted">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
