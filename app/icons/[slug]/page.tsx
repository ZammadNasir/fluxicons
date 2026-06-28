import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Playground } from "@/components/playground/playground";
import { IconCard } from "@/components/icons/icon-card";
import { CopyImportButton } from "@/components/icons/copy-import-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getAllIcons,
  getIconMetadata,
  getIconsByCategory,
} from "@/lib/icon-registry";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllIcons().map((icon) => ({ slug: icon.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = getIconMetadata(slug);
  if (!meta) return { title: "Icon not found" };
  return {
    title: `${meta.name} icon`,
    description: meta.description,
    openGraph: {
      title: `${meta.name} — animated icon`,
      description: meta.description,
    },
  };
}

export default async function IconDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const meta = getIconMetadata(slug);
  if (!meta) notFound();

  const related = getIconsByCategory(meta.category)
    .filter((icon) => icon.slug !== meta.slug)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <nav className="mb-6 text-sm text-foreground-muted">
        <Link href="/icons" className="transition-colors hover:text-foreground">
          Icons
        </Link>
        <span className="px-2 text-foreground-subtle">/</span>
        <span className="text-foreground">{meta.name}</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="tracking-display text-3xl font-semibold text-foreground sm:text-4xl">
              {meta.name}
            </h1>
            <Badge variant="secondary">{meta.category}</Badge>
          </div>
          <p className="mt-2 max-w-xl text-base text-foreground-muted">
            {meta.description}
          </p>
          <p className="mt-1 text-sm text-foreground-subtle">
            {meta.animationDescription}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <CopyImportButton slug={meta.slug} />
          <Button asChild size="sm" variant="ghost">
            <Link href={`/playground?icon=${meta.slug}`}>
              Open in Playground
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {meta.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {meta.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="h-[520px] animate-pulse rounded-2xl border border-border bg-background-subtle" />
          }
        >
          <Playground
            variant="full"
            lockIcon
            initial={{ slug: meta.slug }}
          />
        </Suspense>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-lg font-semibold text-foreground">
            More in {meta.category}
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {related.map((icon) => (
              <IconCard key={icon.slug} icon={icon} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
