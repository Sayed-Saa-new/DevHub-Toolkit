import { createFileRoute, notFound } from "@tanstack/react-router";

import { ToolShell } from "@/components/tool-shell";
import { TOOLS_BY_SLUG } from "@/lib/tools";
import { TOOL_COMPONENTS } from "@/tools/registry";

export const Route = createFileRoute("/t/$slug")({
  head: ({ params }) => {
    const t = TOOLS_BY_SLUG[params.slug];
    if (!t) return { meta: [{ title: "Tool not found — DevHub" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${t.name} — DevHub Toolkit` },
        { name: "description", content: t.description },
        { property: "og:title", content: `${t.name} — DevHub` },
        { property: "og:description", content: t.description },
      ],
    };
  },
  loader: ({ params }) => {
    const tool = TOOLS_BY_SLUG[params.slug];
    if (!tool) throw notFound();
    return { tool };
  },
  notFoundComponent: ToolNotFound,
  component: ToolRoute,
});

function ToolRoute() {
  const { tool } = Route.useLoaderData();
  const Component = TOOL_COMPONENTS[tool.slug] ?? ComingSoon;
  return (
    <ToolShell tool={tool}>
      <Component />
    </ToolShell>
  );
}

function ComingSoon() {
  return (
    <div className="rounded-xl border border-dashed border-border p-12 text-center">
      <div className="font-medium">Coming soon</div>
      <p className="text-sm text-muted-foreground mt-1">
        This tool requires an AI backend. Ask to enable Lovable Cloud to activate it.
      </p>
    </div>
  );
}

function ToolNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Tool not found</h1>
      <p className="text-sm text-muted-foreground mt-2">The tool you're looking for doesn't exist.</p>
    </div>
  );
}