import { ExternalLink, KeyRound, Lock, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BYOK_PROVIDERS, maskKey, providerMeta, useByok, type ByokProvider } from "@/lib/byok";
import { cn } from "@/lib/utils";

export function ByokDialog({ trigger }: { trigger?: React.ReactNode }) {
  const { settings, save, clear, hasKey } = useByok();
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState<ByokProvider>(settings.provider);
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);

  useEffect(() => {
    if (open) {
      setProvider(settings.provider);
      setApiKey(settings.apiKey);
      setModel(settings.model);
    }
  }, [open, settings]);

  const meta = providerMeta(provider);

  const onProviderChange = (value: string) => {
    const next = value as ByokProvider;
    setProvider(next);
    setModel(providerMeta(next).defaultModel);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
            <KeyRound className="size-3.5" />
            {hasKey ? maskKey(settings.apiKey) : "Add API key"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="size-4" /> Bring your own API key
          </DialogTitle>
          <DialogDescription>
            DevHub AI tools run on <strong>your</strong> provider key. It is stored only in this
            browser&apos;s local storage and sent directly with each request — never saved on our
            servers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Provider
            </span>
            <Select value={provider} onValueChange={onProviderChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BYOK_PROVIDERS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">{meta.note}</p>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              API key
            </span>
            <Input
              type="password"
              autoComplete="off"
              spellCheck={false}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={meta.keyPrefix}
              className="font-mono text-sm"
            />
            <a
              href={meta.keyUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition"
            >
              Get a {meta.label} key <ExternalLink className="size-3" />
            </a>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Model
            </span>
            <Input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={meta.defaultModel}
              className="font-mono text-sm"
            />
            <div className="flex flex-wrap gap-1.5">
              {meta.models.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModel(m)}
                  className={cn(
                    "rounded-md border border-border px-2 py-1 text-[11px] font-mono transition hover:bg-muted",
                    model === m && "border-foreground/40 bg-muted",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5">
            <p className="flex items-center gap-2 text-[11px] text-muted-foreground m-0">
              <Lock className="size-3" /> Stored locally in your browser only.
            </p>
            <p className="flex items-center gap-2 text-[11px] text-muted-foreground m-0">
              <ShieldCheck className="size-3" /> Used to proxy the request to your provider, then
              discarded — never logged.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs"
            disabled={!hasKey}
            onClick={() => {
              clear();
              setApiKey("");
              setOpen(false);
            }}
          >
            <Trash2 className="size-3.5" /> Remove key
          </Button>
          <Button
            size="sm"
            disabled={!apiKey.trim()}
            onClick={() => {
              save({
                provider,
                apiKey: apiKey.trim(),
                model: model.trim() || meta.defaultModel,
              });
              setOpen(false);
            }}
          >
            Save key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
