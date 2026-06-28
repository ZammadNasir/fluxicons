"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

interface IconSearchProps {
  value: string;
  onChange: (value: string) => void;
  /** Debounce delay in ms. Default: 300. */
  debounceMs?: number;
  placeholder?: string;
}

/** Debounced search input for the icon browser. */
export function IconSearch({
  value,
  onChange,
  debounceMs = 300,
  placeholder = "Search icons by name or tag",
}: IconSearchProps) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => onChange(local), debounceMs);
    return () => clearTimeout(id);
  }, [local, debounceMs, onChange]);

  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
      <input
        type="search"
        value={local}
        placeholder={placeholder}
        onChange={(e) => setLocal(e.target.value)}
        className="h-11 w-full rounded-xl border border-border bg-background pr-10 pl-10 text-sm focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
      />
      {local && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setLocal("")}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-foreground-subtle transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
