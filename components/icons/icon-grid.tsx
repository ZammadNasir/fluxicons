"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconSearch } from "./icon-search";
import { IconCard } from "./icon-card";
import { Badge } from "@/components/ui/badge";
import {
  getAllCategories,
  getAllIcons,
  searchIcons,
} from "@/lib/icon-registry";
import { cn } from "@/lib/utils";

/** Filterable, searchable icon grid with category tabs and an empty state. */
export function IconGrid() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const total = useMemo(() => getAllIcons().length, []);
  const categories = useMemo(() => ["All", ...getAllCategories()], []);

  const results = useMemo(() => {
    const base = searchIcons(query);
    return category === "All"
      ? base
      : base.filter((icon) => icon.category === category);
  }, [query, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <IconSearch value={query} onChange={setQuery} />
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition-colors",
                category === cat
                  ? "bg-foreground text-background"
                  : "text-foreground-muted hover:bg-background-subtle hover:text-foreground",
              )}
            >
              {cat}
            </button>
          ))}
          <Badge variant="secondary" className="ml-auto">
            {results.length} of {total}
          </Badge>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <p className="text-sm font-medium text-foreground">No icons found</p>
          <p className="mt-1 text-sm text-foreground-muted">
            Try a different search term or category.
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
        >
          <AnimatePresence mode="popLayout">
            {results.map((icon) => (
              <motion.div
                key={icon.slug}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              >
                <IconCard icon={icon} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
