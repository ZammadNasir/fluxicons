import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://rehover.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rehover — Animated icons, built for modern interfaces",
    template: "%s — Rehover",
  },
  description:
    "Production-ready animated icons with customizable motion and copy-ready components for React, Next.js, and beyond.",
  keywords: [
    "animated icons",
    "react icons",
    "framer motion",
    "motion",
    "icon library",
    "nextjs",
  ],
  openGraph: {
    title: "Rehover — Animated icons, built for modern interfaces",
    description:
      "Production-ready animated icons with customizable motion and copy-ready components.",
    url: SITE_URL,
    siteName: "Rehover",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rehover",
    description: "Animated icons that feel native to your stack.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex flex-1 flex-col pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
