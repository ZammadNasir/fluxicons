import { Check } from "lucide-react";

type Line =
  | { kind: "cmd"; text: string }
  | { kind: "check"; text: string }
  | { kind: "prompt"; text: string }
  | { kind: "option"; text: string; selected?: boolean }
  | { kind: "muted"; text: string }
  | { kind: "gap" };

const TERMINAL_LINES: Line[] = [
  { kind: "cmd", text: "npx fluxicons add bell" },
  { kind: "prompt", text: "Which framework?" },
  { kind: "option", text: "React / Next.js", selected: true },
  { kind: "option", text: "Vue 3" },
  { kind: "option", text: "React Native" },
  { kind: "option", text: "Flutter" },
  { kind: "gap" },
  { kind: "check", text: "Downloading bell spec..." },
  { kind: "check", text: "Generating Bell.tsx for React..." },
  { kind: "check", text: "Written to components/icons/Bell.tsx" },
  { kind: "check", text: "Done." },
  { kind: "gap" },
  { kind: "cmd", text: "npx fluxicons add bell --framework flutter" },
  { kind: "check", text: "Generating bell_icon.dart for Flutter..." },
  { kind: "check", text: "Written to lib/icons/bell_icon.dart" },
  { kind: "check", text: "Done." },
];

function TerminalLine({ line }: { line: Line }) {
  if (line.kind === "gap") return <div className="h-2" />;
  if (line.kind === "check") {
    return (
      <div className="flex items-start gap-2">
        <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-[#28c840]" />
        <span className="text-white/85">{line.text}</span>
      </div>
    );
  }
  if (line.kind === "cmd") {
    return (
      <div className="flex items-start gap-2">
        <span className="shrink-0 text-[#28c840]">$</span>
        <span className="text-white/85">{line.text}</span>
      </div>
    );
  }
  if (line.kind === "prompt") {
    return (
      <div className="flex items-start gap-2">
        <span className="w-3.5 shrink-0" />
        <span className="text-white/60">{line.text}</span>
      </div>
    );
  }
  if (line.kind === "option") {
    return (
      <div className="flex items-start gap-2">
        <span
          className={`shrink-0 ${line.selected ? "text-brand" : "text-white/30"}`}
        >
          {line.selected ? "❯" : " "}
        </span>
        <span className={line.selected ? "text-white/90" : "text-white/45"}>
          {line.text}
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2">
      <span className="w-3.5 shrink-0" />
      <span className="text-white/45">{line.text}</span>
    </div>
  );
}

export function CliSection() {
  return (
    <section className="bg-background-subtle">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="tracking-display text-3xl font-semibold text-foreground sm:text-4xl">
            One icon. Every framework.
          </h2>
          <p className="mt-4 max-w-md text-base text-foreground-muted">
            FluxIcons generates native components for your stack. React gets
            Framer Motion. Vue gets CSS animations. React Native gets Reanimated.
            Flutter gets AnimationController. Same animation, native to every
            platform.
          </p>
          <p className="mt-4 text-sm text-foreground-subtle">
            Icons are copied into your project as source files. You own the code.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] shadow-float">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono text-xs text-white/40">terminal</span>
          </div>
          <div className="space-y-1.5 p-5 font-mono text-[13px] leading-6">
            {TERMINAL_LINES.map((line, i) => (
              <TerminalLine key={i} line={line} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
