import Link from "next/link";
import { Wordmark } from "./wordmark";

const LINKS = [
  { href: "/icons", label: "Icons" },
  { href: "/playground", label: "Playground" },
  { href: "/docs", label: "Docs" },
  { href: "https://github.com/fluxicons/fluxicons", label: "GitHub", external: true },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xs">
          <Wordmark />
          <p className="mt-3 text-sm text-foreground-muted">
            Animated icons for modern interfaces.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map((link) =>
            "external" in link && link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm text-foreground-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-foreground-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <p className="text-sm text-foreground-subtle">Built with Motion + Next.js</p>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <p className="text-xs text-foreground-subtle">
            © {new Date().getFullYear()} FluxIcons. Open source, free to use.
          </p>
        </div>
      </div>
    </footer>
  );
}
