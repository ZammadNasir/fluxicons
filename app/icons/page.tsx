import type { Metadata } from "next";
import { IconGrid } from "@/components/icons/icon-grid";
import { Badge } from "@/components/ui/badge";
import { getAllIcons } from "@/lib/icon-registry";

export const metadata: Metadata = {
  title: "Icons",
  description:
    "Browse the full Rehover library of animated icons. Search by name, tag, or category.",
};

export default function IconsPage() {
  const count = getAllIcons().length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="mb-8 flex items-center gap-3">
        <h1 className="tracking-display text-3xl font-semibold text-foreground sm:text-4xl">
          Icons
        </h1>
        <Badge variant="secondary" className="mt-1">
          {count}
        </Badge>
      </header>
      <IconGrid />
    </div>
  );
}
