import { createFileRoute } from "@tanstack/react-router";
import { MotionIconConfig } from "lucide-react-motion";

import { TOOLS } from "@/lib/tools";
import { SITE, CATEGORY_ART_ASSETS } from "@/components/landing/data";
import { LandingHeader } from "@/components/landing/landing-header";
import { Hero } from "@/components/landing/hero";
import { FeaturedTools } from "@/components/landing/featured-tools";
import { Features } from "@/components/landing/features";
import { ToolsCarousel } from "@/components/landing/tools-carousel";
import { CategoriesShowcase } from "@/components/landing/categories-showcase";
import { Stats } from "@/components/landing/stats";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { FinalCTA } from "@/components/landing/final-cta";
import { BigFooter } from "@/components/landing/big-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `DevHub Toolkit — ${TOOLS.length}+ Developer Utilities, One Keystroke` },
      {
        name: "description",
        content:
          "The all-in-one developer toolkit. Format JSON, decode JWTs, generate hashes, tweak gradients, run AI helpers — 44+ premium utilities, local-first, zero signup.",
      },
      {
        name: "keywords",
        content:
          "developer tools, online developer toolkit, json formatter, base64 decoder, jwt decoder, uuid generator, hash generator, regex tester, qr code generator, ai code explainer, css gradient generator, free developer tools",
      },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:title", content: `DevHub Toolkit — ${TOOLS.length}+ developer utilities in one keystroke` },
      {
        property: "og:description",
        content:
          "Every developer utility you actually use — JSON, Base64, JWT, UUID, hashes, regex, QR, AI SQL and more. Fast, minimal, no signup.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "DevHub Toolkit" },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d73bcc09-2f60-409d-b833-91c82c156e5e/id-preview-aa9e0d77--6b271a1b-d2e8-44e0-909f-190eae9de463.lovable.app-1784378017742.png",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `DevHub Toolkit — ${TOOLS.length}+ developer utilities in one keystroke` },
      {
        name: "twitter:description",
        content: "Every developer utility you actually use — local-first, keyboard-first, monochrome.",
      },
    ],
    links: [
      { rel: "canonical", href: `${SITE}/` },
      { rel: "prefetch", as: "image", href: CATEGORY_ART_ASSETS.catConverters, type: "image/svg+xml" },
      { rel: "prefetch", as: "image", href: CATEGORY_ART_ASSETS.catGenerators, type: "image/svg+xml" },
      { rel: "prefetch", as: "image", href: CATEGORY_ART_ASSETS.catDesign, type: "image/svg+xml" },
      { rel: "prefetch", as: "image", href: CATEGORY_ART_ASSETS.catEditors, type: "image/svg+xml" },
      { rel: "prefetch", as: "image", href: CATEGORY_ART_ASSETS.catReference, type: "image/svg+xml" },
      { rel: "prefetch", as: "image", href: CATEGORY_ART_ASSETS.catAi, type: "image/svg+xml" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${SITE}/#website`,
          name: "DevHub Toolkit",
          url: `${SITE}/`,
          description:
            "All-in-one developer toolkit — 44+ utilities: JSON, Base64, JWT, UUID, hashes, regex, QR, AI helpers and more.",
          inLanguage: "en",
          publisher: { "@id": `${SITE}/#org` },
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE}/tools?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${SITE}/#org`,
          name: "DevHub Toolkit",
          url: `${SITE}/`,
          logo: { "@type": "ImageObject", url: `${SITE}/favicon.svg` },
        }),
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <MotionIconConfig trigger="parent-hover" duration={0.25}>
      <div className="min-w-0">
        <LandingHeader />
        <Hero />
        <FeaturedTools />
        <Features />
        <ToolsCarousel />
        <CategoriesShowcase />
        <Stats />
        <Testimonials />
        <FAQ />
        <FinalCTA />
        <BigFooter />
      </div>
    </MotionIconConfig>
  );
}