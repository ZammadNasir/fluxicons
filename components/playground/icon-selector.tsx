"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { IconRenderer } from "./icon-renderer";
import { getAllCategories, searchIcons } from "@/lib/icon-registry";
import { cn } from "@/lib/utils";

interface IconSelectorProps {
  selected: string;
  onSelect: (slug: string) => void;
}

/** Compact searchable icon grid used as the playground's left sidebar. */
export function IconSelector({ selected, onSelect }: IconSelectorProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const categories = useMemo(() => ["All", ...getAllCategories()], []);

  const results = useMemo(() => {
    const base = searchIcons(query);
    return category === "All"
      ? base
      : base.filter((icon) => icon.category === category);
  }, [query, category]);

  return (
    <div className="flex h-full flex-col">
      <div className="relative">
        <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
        <input
          type="search"
          value={query}
          placeholder="Search icons"
          onChange={(e) => setQuery(e.target.value)}
          className="h-9 w-full rounded-lg border border-border bg-background pr-2 pl-8 text-sm focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs transition-colors",
              category === cat
                ? "bg-foreground text-background"
                : "text-foreground-muted hover:bg-background-subtle hover:text-foreground",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-3 grid flex-1 auto-rows-min grid-cols-4 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-5 lg:grid-cols-4">
        {results.map((icon) => {
          const active = icon.slug === selected;
          return (
            <button
              key={icon.slug}
              type="button"
              title={icon.name}
              aria-label={`Select ${icon.name}`}
              aria-pressed={active}
              onClick={() => onSelect(icon.slug)}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg border transition-colors",
                active
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border text-foreground-muted hover:border-border-strong hover:text-foreground",
              )}
            >
              <IconRenderer slug={icon.slug} size={22} trigger="hover" />
            </button>
          );
        })}
        {results.length === 0 && (
          <p className="col-span-full py-6 text-center text-xs text-foreground-subtle">
            No icons found.
          </p>
        )}
      </div>
    </div>
  );
}
