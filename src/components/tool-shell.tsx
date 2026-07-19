import { Link } from "@tanstack/react-router";
import { ChevronLeft, Star } from "lucide-react";
import { useEffect, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useFavorites, useRecents, useSeen } from "@/lib/storage";
import type { Tool } from "@/lib/tools";

export function ToolShell({ tool, children }: { tool: Tool; children: ReactNode }) {
  const { isFav, toggle } = useFavorites();
  const { push } = useRecents();
  const { markSeen } = useSeen();
  const favored = isFav(tool.slug);

  useEffect(() => {
    push(tool.slug);
    markSeen(tool.slug);
  }, [tool.slug, push, markSeen]);

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-6 md:py-10">
      <div className="flex items-start gap-4 mb-6">
        <Link to="/" aria-label="Back to all tools" className="mt-1 text-muted-foreground hover:text-foreground transition">
          <ChevronLeft className="size-4" />
        </Link>
        <div className="size-11 rounded-xl border border-border grid place-items-center bg-card">
          <tool.icon className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">{tool.name}</h1>
            <Badge variant="outline" className="text-[10px] font-mono uppercase">
              {tool.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggle(tool.slug)}
          className={cn("gap-2", favored && "border-foreground/40")}
        >
          <Star className={cn("size-3.5", favored && "fill-foreground")} />
          {favored ? "Saved" : "Save"}
        </Button>
      </div>
      {children}
    </div>
  );
}