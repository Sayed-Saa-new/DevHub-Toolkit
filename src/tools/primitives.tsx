import { useState, type ReactNode } from "react";
import { Check, Copy, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, copyToClipboard, downloadFile } from "@/lib/utils";

export function Panel({
  title,
  actions,
  children,
  className,
}: {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground m-0">
            {title}
          </h2>
          <div className="flex items-center gap-1">{actions}</div>
        </div>
      )}
      {children}
    </div>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      disabled={!text}
      aria-label={copied ? "Copied" : label}
      className="h-7 gap-1.5 text-xs"
    >
      {copied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3" />}
      {copied ? "Copied" : label}
    </Button>
  );
}

export function DownloadButton({
  filename,
  content,
  mime,
  label = "Download",
}: {
  filename: string;
  content: string | Blob;
  mime?: string;
  label?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => downloadFile(filename, content, mime)}
      className="h-7 gap-1.5 text-xs"
    >
      <Download className="size-3" /> {label}
    </Button>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("font-mono text-sm", className)}>{children}</div>;
}
