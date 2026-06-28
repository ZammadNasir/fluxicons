"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toPascalCase } from "@/lib/utils";

/** Quick "copy import" button shown on the individual icon page. */
export function CopyImportButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const name = toPascalCase(slug);
  const importLine = `import ${name} from "@/components/icons/${name}";`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(importLine);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <Button variant="secondary" size="sm" onClick={copy}>
      {copied ? (
        <Check className="h-4 w-4 text-brand" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      {copied ? "Copied" : "Copy import"}
    </Button>
  );
}
