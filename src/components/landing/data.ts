import {
  Braces,
  KeyRound,
  Terminal,
  Hash,
  Regex,
  QrCode,
  Blend,
} from "lucide-react-motion";
import { Fingerprint } from "lucide-react";
import type { ComponentType } from "react";
import catConverters from "@/assets/cat-converters.svg";
import catGenerators from "@/assets/cat-generators.svg";
import catDesign from "@/assets/cat-design.svg";
import catEditors from "@/assets/cat-editors.svg";
import catReference from "@/assets/cat-reference.svg";
import catAi from "@/assets/cat-ai.svg";

export const SITE = "https://devhub.flinkeo.online";

export const CATEGORY_ART: Record<string, { image: string; blurb: string }> = {
  converters: { image: catConverters, blurb: "Transform data between formats — JSON, Base64, YAML, CSV, cURL." },
  generators: { image: catGenerators, blurb: "Create UUIDs, hashes, QR codes, JWTs, passwords and mock data." },
  design: { image: catDesign, blurb: "Craft gradients, shadows, colors and fluid CSS values." },
  editors: { image: catEditors, blurb: "Live editors for JSON, Markdown, Regex, SQL and playgrounds." },
  reference: { image: catReference, blurb: "HTTP codes, Git, Linux, VS Code and cron — searchable." },
  ai: { image: catAi, blurb: "AI helpers: explain, optimize, convert code and craft SQL or tests." },
};

export const CATEGORY_ART_ASSETS = {
  catConverters,
  catGenerators,
  catDesign,
  catEditors,
  catReference,
  catAi,
};

export const FEATURED_SLUGS = [
  "json-formatter",
  "jwt-decoder",
  "base64",
  "uuid",
  "hash",
  "regex",
  "qrcode",
  "gradient",
];

export const FEATURE_ICON: Record<string, ComponentType<{ className?: string }>> = {
  "json-formatter": Braces,
  "jwt-decoder": KeyRound,
  base64: Terminal,
  uuid: Fingerprint,
  hash: Hash,
  regex: Regex,
  qrcode: QrCode,
  gradient: Blend,
};

export const FEATURED_TOOL_SLUGS = [
  "json-formatter",
  "jwt-decoder",
  "regex",
  "uuid",
  "hash",
  "ai-explainer",
];

export const TESTIMONIALS = [
  {
    q: "Replaced five browser bookmarks with one URL. The command palette alone is worth it.",
    a: "Anika R.",
    role: "Full-stack engineer",
  },
  {
    q: "It just feels right. Monochrome, fast, no ads. Exactly what a developer utility should be.",
    a: "Marcus L.",
    role: "Staff engineer, fintech",
  },
  {
    q: "The AI regex generator saves me every time. I actually understand what it produces.",
    a: "Priya S.",
    role: "Backend developer",
  },
];

export const FAQ_ITEMS = [
  {
    q: "Is DevHub Toolkit free?",
    a: "Yes. Every tool is free forever, with no signup, no ads, and no rate limits on client-side utilities.",
  },
  {
    q: "Does my data leave the browser?",
    a: "No — all tools run locally in your browser. AI helpers send only the text you provide, on demand, and never store it.",
  },
  {
    q: "Can I use it offline?",
    a: "Yes. After the first load, the toolkit works without an internet connection (except AI tools, which need a network).",
  },
  {
    q: "How is this different from other online tools?",
    a: "One clean interface for 55+ tools, keyboard-first navigation, favorites/recents, and a monochrome premium UI — no ads, no cross-site tracking.",
  },
  {
    q: "Can I request a tool?",
    a: "Absolutely. Open an issue on GitHub and it goes straight into the roadmap.",
  },
];