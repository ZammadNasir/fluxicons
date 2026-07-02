"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { IconRenderer } from "@/components/playground/icon-renderer";
import type { IconMetadata } from "@/lib/icon-registry";
import { toPascalCase } from "@/lib/utils";

interface IconCardProps {
  icon: IconMetadata;
}

/** Grid cell for one icon: animated preview, name, hover-lift, quick copy. */
export function IconCard({ icon }: IconCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const name = toPascalCase(icon.slug);
    try {
      await navigator.clipboard.writeText(
        `import ${name} from "@/components/icons/${name}";`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  return (
    <Link
      href={`/icons/${icon.slug}`}
      className="group relative flex aspect-square flex-col items-center justify-center gap-3 rounded-xl border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
    >
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied import" : `Copy ${icon.name} import`}
        className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-foreground-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-brand" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>

      <div className="flex h-12 items-center justify-center text-foreground">
        <IconRenderer
          slug={icon.slug}
          size={40}
          trigger={icon.defaultTrigger ?? "hover"}
        />
      </div>
      <span className="text-xs text-foreground-muted transition-colors group-hover:text-foreground">
        {icon.name}
      </span>
    </Link>
  );
}
