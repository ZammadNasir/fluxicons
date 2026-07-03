"use client";

import { Check } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";

type Line =
  | { kind: "cmd"; text: string }
  | { kind: "check"; text: string }
  | { kind: "prompt"; text: string }
  | { kind: "option"; text: string; selected?: boolean }
  | { kind: "muted"; text: string }
  | { kind: "gap" };

const TERMINAL_LINES: Line[] = [
  { kind: "cmd", text: "npx rehover add bell" },
  { kind: "prompt", text: "Which framework?" },
  { kind: "option", text: "React / Next.js", selected: true },
  { kind: "option", text: "Vue 3" },
  { kind: "gap" },
  { kind: "check", text: "Downloading bell spec..." },
  { kind: "check", text: "Generating Bell.tsx for React..." },
  { kind: "check", text: "Written to components/icons/Bell.tsx" },
  { kind: "check", text: "Done." },
  { kind: "gap" },
  { kind: "cmd", text: "npx rehover add clock --framework vue" },
  { kind: "check", text: "Generating Clock.vue for Vue..." },
  { kind: "check", text: "Written to components/icons/Clock.vue" },
  { kind: "check", text: "Done." },
];

function TerminalLine({
  line,
  index,
  visibleLines,
}: {
  line: Line;
  index: number;
  visibleLines: number;
}) {
  const isVisible = index < visibleLines;

  if (line.kind === "gap")
    return (
      <motion.div
        className="h-2"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
    );

  if (line.kind === "check") {
    return (
      <motion.div
        className="flex items-start gap-2"
        initial={{ opacity: 0, x: -10 }}
        animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={isVisible ? { scale: 1 } : { scale: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
        >
          <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-[#28c840]" />
        </motion.div>
        <motion.span className="text-white/85">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            {line.text}
          </motion.span>
        </motion.span>
      </motion.div>
    );
  }

  if (line.kind === "cmd") {
    return (
      <motion.div
        className="flex items-start gap-2"
        initial={{ opacity: 0, x: -10 }}
        animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
        transition={{ duration: 0.3 }}
      >
        <motion.span className="shrink-0 text-[#28c840]">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            $
          </motion.span>
        </motion.span>
        <motion.span className="text-white/85">
          {isVisible && <TypingText text={line.text} />}
        </motion.span>
      </motion.div>
    );
  }

  if (line.kind === "prompt") {
    return (
      <motion.div
        className="flex items-start gap-2"
        initial={{ opacity: 0, x: -10 }}
        animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
        transition={{ duration: 0.3 }}
      >
        <span className="w-3.5 shrink-0" />
        <motion.span className="text-white/60">
          {isVisible && <TypingText text={line.text} />}
        </motion.span>
      </motion.div>
    );
  }

  if (line.kind === "option") {
    return (
      <motion.div
        className="flex items-start gap-2"
        initial={{ opacity: 0, x: -15 }}
        animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
        transition={{
          duration: 0.4,
          delay: line.selected ? 0.15 : 0,
        }}
      >
        <motion.span
          className={`shrink-0 ${line.selected ? "text-brand" : "text-white/30"}`}
          animate={isVisible && line.selected ? { x: [0, 4, 0] } : { x: 0 }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        >
          {line.selected ? "❯" : " "}
        </motion.span>
        <span className={line.selected ? "text-white/90" : "text-white/45"}>
          {line.text}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex items-start gap-2"
      initial={{ opacity: 0, x: -10 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
      transition={{ duration: 0.3 }}
    >
      <span className="w-3.5 shrink-0" />
      <span className="text-white/45">{line.text}</span>
    </motion.div>
  );
}

function TypingText({ text }: { text: string }) {
  return (
    <motion.span>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.05,
            delay: i * 0.03,
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function CliSection() {
  const [visibleLines, setVisibleLines] = useState(0);
  const terminalRef = useRef(null);
  const isInView = useInView(terminalRef, { once: false, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;

    if (visibleLines >= TERMINAL_LINES.length) {
      // Reset after showing all lines
      const timer = setTimeout(() => {
        setVisibleLines(0);
      }, 3000); // Wait 3 seconds before restarting
      return () => clearTimeout(timer);
    }

    // Show next line
    const timer = setTimeout(() => {
      setVisibleLines((prev) => prev + 1);
    }, 400); // Time between lines

    return () => clearTimeout(timer);
  }, [visibleLines, isInView]);

  return (
    <section className="bg-background-subtle">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="tracking-display text-3xl font-semibold text-foreground sm:text-4xl">
            One icon. Every framework.
          </h2>
          <p className="mt-4 max-w-md text-base text-foreground-muted">
            Rehover generates native components for your stack. React gets
            Framer Motion. Vue gets CSS animations. Same animation, native to
            every platform.
          </p>
          <p className="mt-4 text-sm text-foreground-subtle">
            Icons are copied into your project as source files. You own the
            code.
          </p>
        </motion.div>

        <motion.div
          ref={terminalRef}
          className="overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] shadow-float"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
            <motion.span
              className="h-3 w-3 rounded-full bg-[#ff5f57]"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            />
            <motion.span
              className="h-3 w-3 rounded-full bg-[#febc2e]"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            />
            <motion.span
              className="h-3 w-3 rounded-full bg-[#28c840]"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            />
            <span className="ml-2 font-mono text-xs text-white/40">
              terminal
            </span>
          </div>
          <div className="space-y-1.5 p-5 font-mono text-[13px] leading-6">
            {TERMINAL_LINES.map((line, i) => (
              <TerminalLine
                key={i}
                line={line}
                index={i}
                visibleLines={visibleLines}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
