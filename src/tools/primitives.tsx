import { Copy, Download } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn, copyToClipboard, downloadFile } from "@/lib/utils";

export function Panel({ title, actions, children, className }: { title?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</div>
          <div className="flex items-center gap-1">{actions}</div>
        </div>
      )}
      {children}
    </div>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  return (
    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(text)} disabled={!text} className="h-7 gap-1.5 text-xs">
      <Copy className="size-3" /> {label}
    </Button>
  );
}

export function DownloadButton({ filename, content, mime, label = "Download" }: { filename: string; content: string | Blob; mime?: string; label?: string }) {
  return (
    <Button variant="ghost" size="sm" onClick={() => downloadFile(filename, content, mime)} className="h-7 gap-1.5 text-xs">
      <Download className="size-3" /> {label}
    </Button>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("font-mono text-sm", className)}>{children}</div>;
}