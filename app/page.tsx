import { Hero } from "@/components/landing/hero";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { PlaygroundSection } from "@/components/landing/playground-section";
import { CliSection } from "@/components/landing/cli-section";
import { FrameworksSection } from "@/components/landing/frameworks-section";
import { FinalCta } from "@/components/landing/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesGrid />
      <PlaygroundSection />
      <CliSection />
      <FrameworksSection />
      <FinalCta />
    </>
  );
}
