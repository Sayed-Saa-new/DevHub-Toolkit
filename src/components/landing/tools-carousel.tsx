import { LoadingCarousel, type Tip } from "@/components/ui/loading-carousel";
import { CATEGORY_ART_ASSETS } from "./data";
import { SectionHead } from "./section-head";

const tips: Tip[] = [
  {
    text: "Convert & format anything — JSON, Base64, YAML, cURL, SQL.",
    image: CATEGORY_ART_ASSETS.catConverters,
    url: "/c/converters",
  },
  {
    text: "Generate UUIDs, hashes, JWTs, QR codes and rich mock data.",
    image: CATEGORY_ART_ASSETS.catGenerators,
    url: "/c/generators",
  },
  {
    text: "Design tokens on tap — gradients, shadows, radii, fluid clamps.",
    image: CATEGORY_ART_ASSETS.catDesign,
    url: "/c/design",
  },
  {
    text: "Live editors for JSON, Markdown, Regex and SQL — instant feedback.",
    image: CATEGORY_ART_ASSETS.catEditors,
    url: "/c/editors",
  },
  {
    text: "Searchable cheat sheets — HTTP, Git, Linux, VS Code, cron.",
    image: CATEGORY_ART_ASSETS.catReference,
    url: "/c/reference",
  },
  {
    text: "AI helpers — explain, optimize, convert code and craft SQL.",
    image: CATEGORY_ART_ASSETS.catAi,
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
          description="Six categories, forty-four hand-crafted utilities. Autoplay tour below — hover to focus, click a dot to jump."
        />
        <div className="mt-10">
          <LoadingCarousel tips={tips} aspectRatio="wide" autoplayInterval={4500} />
        </div>
      </div>
    </section>
  );
}