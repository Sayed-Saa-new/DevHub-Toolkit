import { LoadingCarousel, type Tip } from "@/components/ui/loading-carousel";
import { SectionHead } from "./section-head";
import shotConverters from "@/assets/screenshots/converters.webp.asset.json";
import shotGenerators from "@/assets/screenshots/generators.webp.asset.json";
import shotDesign from "@/assets/screenshots/design.webp.asset.json";
import shotEditors from "@/assets/screenshots/editors.webp.asset.json";
import shotReference from "@/assets/screenshots/reference.webp.asset.json";
import shotAi from "@/assets/screenshots/ai.webp.asset.json";

const tips: Tip[] = [
  {
    text: "Convert & format anything — JSON, Base64, YAML, cURL, SQL.",
    image: shotConverters.url,
    url: "/c/converters",
  },
  {
    text: "Generate UUIDs, hashes, JWTs, QR codes and rich mock data.",
    image: shotGenerators.url,
    url: "/c/generators",
  },
  {
    text: "Design tokens on tap — gradients, shadows, radii, fluid clamps.",
    image: shotDesign.url,
    url: "/c/design",
  },
  {
    text: "Live editors for JSON, Markdown, Regex and SQL — instant feedback.",
    image: shotEditors.url,
    url: "/c/editors",
  },
  {
    text: "Searchable cheat sheets — HTTP, Git, Linux, VS Code, cron.",
    image: shotReference.url,
    url: "/c/reference",
  },
  {
    text: "AI helpers — explain, optimize, convert code and craft SQL.",
    image: shotAi.url,
    url: "/c/ai",
  },
];

export function ToolsCarousel() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-16 md:py-24">
        <SectionHead
          eyebrow="Tour"
          title="A glimpse of what's inside"
          subtitle="Six categories, forty-four hand-crafted utilities. Autoplay tour below — hover to focus, click a dot to jump."
        />
        <div className="mt-10">
          <LoadingCarousel tips={tips} aspectRatio="wide" autoplayInterval={4500} />
        </div>
      </div>
    </section>
  );
}