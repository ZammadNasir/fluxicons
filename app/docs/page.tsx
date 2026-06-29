import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Install, customize, and ship FluxIcons. Learn the props, animation triggers, CLI workflow, and theming.",
};

const PROPS: { name: string; type: string; def: string; desc: string }[] = [
  { name: "size", type: "number", def: "24", desc: "Pixel size of the square icon." },
  { name: "color", type: "string", def: '"currentColor"', desc: "Stroke color." },
  { name: "strokeWidth", type: "number", def: "1.5", desc: "Stroke width." },
  { name: "trigger", type: "AnimationTrigger", def: '"hover"', desc: "What starts the animation." },
  { name: "speed", type: "number", def: "1", desc: "Speed multiplier (0.1–3)." },
  { name: "loop", type: "boolean", def: "false", desc: "Whether the animation repeats." },
  { name: "delay", type: "number", def: "0", desc: "Delay in seconds before starting." },
  { name: "onAnimationStart", type: "() => void", def: "—", desc: "Fires when the animation starts." },
  { name: "onAnimationComplete", type: "() => void", def: "—", desc: "Fires when the animation completes." },
];

const TRIGGERS: { value: string; desc: string }[] = [
  { value: "hover", desc: "Plays while the parent is hovered or focused." },
  { value: "click", desc: "Plays once per click; keyboard accessible (Enter/Space)." },
  { value: "inView", desc: "Plays once when the icon scrolls into view." },
  { value: "autoplay", desc: "Loops continuously." },
  { value: "none", desc: "Static, no animation." },
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="tracking-display text-2xl font-semibold text-foreground">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-6 text-foreground-muted">
        {children}
      </div>
    </section>
  );
}

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="mb-12">
        <Badge variant="brand" className="mb-4">
          Documentation
        </Badge>
        <h1 className="tracking-display text-4xl font-semibold text-foreground">
          Get started with FluxIcons
        </h1>
        <p className="mt-3 text-base text-foreground-muted">
          Animated icons that feel native to your stack. Copy the code, or add
          icons to your project with the CLI — you own the source either way.
        </p>
      </header>

      <div className="space-y-14">
        <Section id="install" title="Installation">
          <p>
            FluxIcons is CLI-first: icons are copied into your project as source
            files. Add one with a single command.
          </p>
          <CodeBlock language="bash" code={`npx fluxicons add clock`} />
          <p>
            This writes <code className="font-mono text-foreground">Clock.tsx</code>{" "}
            into <code className="font-mono text-foreground">components/icons/</code>.
            Motion is the only runtime dependency.
          </p>
          <CodeBlock language="bash" code={`npm install motion`} />
          <p>
            Every icon is authored once as a framework-agnostic spec, then
            generated natively for your stack. Pass{" "}
            <code className="font-mono text-foreground">--framework</code> to
            target Vue:
          </p>
          <CodeBlock
            language="bash"
            code={`npx fluxicons add clock --framework vue`}
          />
        </Section>

        <Section id="usage" title="Usage">
          <p>Import the component and drop it in. Every icon is a forwardRef SVG.</p>
          <CodeBlock
            code={`import Clock from "@/components/icons/Clock";

export function Example() {
  return <Clock size={32} trigger="hover" />;
}`}
          />
          <p>
            Using Vue? The same props apply across every framework — grab the
            exact snippet from the matching tab in the{" "}
            <Link href="/playground" className="text-brand hover:underline">
              playground
            </Link>
            .
          </p>
          <CodeBlock
            language="vue"
            code={`<script setup lang="ts">
import Clock from "@/components/icons/Clock.vue";
</script>

<template>
  <Clock :size="32" trigger="hover" />
</template>`}
          />
        </Section>

        <Section id="props" title="Props">
          <p>Every icon implements the same prop contract.</p>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-background-subtle font-mono text-xs text-foreground-subtle uppercase">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Prop</th>
                  <th className="px-4 py-2.5 font-medium">Type</th>
                  <th className="px-4 py-2.5 font-medium">Default</th>
                </tr>
              </thead>
              <tbody>
                {PROPS.map((p) => (
                  <tr key={p.name} className="border-t border-border align-top">
                    <td className="px-4 py-2.5 font-mono text-foreground">{p.name}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-foreground-muted">
                      {p.type}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-foreground-muted">
                      {p.def}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="triggers" title="Animation triggers">
          <p>
            The <code className="font-mono text-foreground">trigger</code> prop
            controls what starts an animation.
          </p>
          <ul className="space-y-2">
            {TRIGGERS.map((t) => (
              <li key={t.value} className="flex gap-3">
                <code className="font-mono text-foreground">{t.value}</code>
                <span>{t.desc}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="theming" title="Theming">
          <p>
            Icons stroke with <code className="font-mono text-foreground">currentColor</code>{" "}
            by default, so they inherit your text color and work in dark mode
            automatically. Override per-instance with the{" "}
            <code className="font-mono text-foreground">color</code> prop.
          </p>
          <CodeBlock
            code={`<Clock />                    {/* inherits currentColor */}
<Clock color="#6366F1" />    {/* explicit brand color */}`}
          />
        </Section>

        <Section id="playground" title="Playground">
          <p>
            Tune any icon visually and copy the exact code in the{" "}
            <Link href="/playground" className="text-brand hover:underline">
              playground
            </Link>
            . Settings are stored in the URL, so configurations are shareable.
          </p>
        </Section>
      </div>
    </div>
  );
}
