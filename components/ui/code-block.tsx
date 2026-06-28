"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { tokenize, type TokenType } from "@/lib/highlight";
import { cn } from "@/lib/utils";

export interface CodeBlockProps {
  code: string;
  language?: string;
  /** Show the copy button. Default: true. */
  copyable?: boolean;
  className?: string;
}

/** Syntax colors tuned for the always-dark code surface. */
const TOKEN_CLASS: Record<TokenType, string> = {
  comment: "text-white/35 italic",
  string: "text-[#7ee2c2]",
  keyword: "text-[#c792ea]",
  tag: "text-[#82aaff]",
  attr: "text-[#f9cb6b]",
  number: "text-[#f78c6c]",
  punct: "text-white/55",
  plain: "text-white/85",
};

/**
 * Read-only code surface with minimal in-house syntax highlighting and a
 * copy-to-clipboard button that confirms with a checkmark.
 */
export function CodeBlock({
  code,
  language = "tsx",
  copyable = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const tokens = useMemo(() => tokenize(code), [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable; silently ignore.
    }
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0a]",
        className,
      )}
    >
      {copyable && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="absolute top-3 right-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
        >
          {copied ? (
            <Check className="h-4 w-4 text-[#7ee2c2]" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      )}
      <pre
        className="overflow-x-auto p-4 font-mono text-[13px] leading-5"
        data-language={language}
      >
        <code>
          {tokens.map((token, idx) => (
            <span key={idx} className={TOKEN_CLASS[token.type]}>
              {token.value}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
