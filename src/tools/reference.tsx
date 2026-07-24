import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mono, Panel } from "./primitives";
import { copyToClipboard } from "@/lib/utils";

const HTTP_CODES: { code: number; name: string; desc: string; family: string }[] = [
  {
    code: 100,
    name: "Continue",
    desc: "Request headers received, continue with body.",
    family: "1xx",
  },
  {
    code: 101,
    name: "Switching Protocols",
    desc: "Server switching to a different protocol.",
    family: "1xx",
  },
  { code: 200, name: "OK", desc: "Request succeeded.", family: "2xx" },
  { code: 201, name: "Created", desc: "New resource successfully created.", family: "2xx" },
  { code: 202, name: "Accepted", desc: "Request accepted for processing.", family: "2xx" },
  { code: 204, name: "No Content", desc: "Success with no response body.", family: "2xx" },
  { code: 206, name: "Partial Content", desc: "Range request served partially.", family: "2xx" },
  { code: 301, name: "Moved Permanently", desc: "Resource has moved to a new URL.", family: "3xx" },
  { code: 302, name: "Found", desc: "Temporary redirect.", family: "3xx" },
  { code: 304, name: "Not Modified", desc: "Cached version is still valid.", family: "3xx" },
  { code: 307, name: "Temporary Redirect", desc: "Method preserved on redirect.", family: "3xx" },
  { code: 308, name: "Permanent Redirect", desc: "Method preserved permanently.", family: "3xx" },
  { code: 400, name: "Bad Request", desc: "Malformed or invalid request.", family: "4xx" },
  { code: 401, name: "Unauthorized", desc: "Authentication required.", family: "4xx" },
  { code: 403, name: "Forbidden", desc: "Server refuses to authorize.", family: "4xx" },
  { code: 404, name: "Not Found", desc: "Resource does not exist.", family: "4xx" },
  { code: 405, name: "Method Not Allowed", desc: "HTTP method not supported.", family: "4xx" },
  { code: 409, name: "Conflict", desc: "Request conflicts with server state.", family: "4xx" },
  { code: 410, name: "Gone", desc: "Resource permanently removed.", family: "4xx" },
  { code: 415, name: "Unsupported Media Type", desc: "Media type not supported.", family: "4xx" },
  { code: 418, name: "I'm a teapot", desc: "The server refuses to brew coffee.", family: "4xx" },
  { code: 422, name: "Unprocessable Entity", desc: "Semantic errors in request.", family: "4xx" },
  { code: 429, name: "Too Many Requests", desc: "Rate limit exceeded.", family: "4xx" },
  { code: 500, name: "Internal Server Error", desc: "Generic server-side failure.", family: "5xx" },
  { code: 501, name: "Not Implemented", desc: "Method not supported by server.", family: "5xx" },
  { code: 502, name: "Bad Gateway", desc: "Invalid response from upstream.", family: "5xx" },
  {
    code: 503,
    name: "Service Unavailable",
    desc: "Server temporarily unavailable.",
    family: "5xx",
  },
  { code: 504, name: "Gateway Timeout", desc: "Upstream timed out.", family: "5xx" },
];

export function HttpStatus() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return HTTP_CODES;
    return HTTP_CODES.filter(
      (c) =>
        String(c.code).includes(s) ||
        c.name.toLowerCase().includes(s) ||
        c.desc.toLowerCase().includes(s),
    );
  }, [q]);
  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by code or name (e.g. 404, timeout)…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <Panel title={`${filtered.length} codes`}>
        <div className="divide-y divide-border max-h-[560px] overflow-auto">
          {filtered.map((c) => (
            <div key={c.code} className="px-4 py-3 flex items-center gap-4 hover:bg-accent/30">
              <div className="w-14 text-lg font-mono font-semibold">{c.code}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.desc}</div>
              </div>
              <Badge variant="outline" className="font-mono text-[10px]">
                {c.family}
              </Badge>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

type Sheet = { section: string; items: [string, string][] };

function CheatSheet({ sheets }: { sheets: Sheet[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return sheets;
    return sheets
      .map((sec) => ({
        ...sec,
        items: sec.items.filter(
          ([cmd, desc]) => cmd.toLowerCase().includes(s) || desc.toLowerCase().includes(s),
        ),
      }))
      .filter((sec) => sec.items.length > 0);
  }, [q, sheets]);
  return (
    <div className="space-y-4">
      <Input placeholder="Filter commands…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="space-y-4">
        {filtered.map((sec) => (
          <Panel key={sec.section} title={sec.section}>
            <div className="divide-y divide-border">
              {sec.items.map(([cmd, desc]) => (
                <button
                  key={cmd}
                  onClick={() => copyToClipboard(cmd)}
                  className="w-full text-left px-4 py-2.5 flex items-center gap-4 hover:bg-accent/40 group"
                >
                  <Mono className="min-w-0 flex-1 text-xs break-all">{cmd}</Mono>
                  <span className="text-xs text-muted-foreground truncate max-w-[45%]">{desc}</span>
                  <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 font-mono">
                    copy
                  </span>
                </button>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

export function GitCheatsheet() {
  return (
    <CheatSheet
      sheets={[
        {
          section: "Setup",
          items: [
            ['git config --global user.name "Name"', "Set your name"],
            ['git config --global user.email "you@x.com"', "Set your email"],
            ["git init", "Initialize a repo"],
            ["git clone <url>", "Clone a repo"],
          ],
        },
        {
          section: "Basics",
          items: [
            ["git status", "Show working tree status"],
            ["git add .", "Stage all changes"],
            ['git commit -m "msg"', "Commit staged changes"],
            ["git log --oneline --graph", "Compact history"],
            ["git diff", "Unstaged changes"],
            ["git diff --staged", "Staged changes"],
          ],
        },
        {
          section: "Branching",
          items: [
            ["git branch", "List branches"],
            ["git checkout -b feat/x", "Create and switch"],
            ["git switch main", "Switch branch"],
            ["git merge feat/x", "Merge branch"],
            ["git rebase main", "Rebase current onto main"],
            ["git branch -d feat/x", "Delete branch"],
          ],
        },
        {
          section: "Remote",
          items: [
            ["git remote -v", "Show remotes"],
            ["git push -u origin main", "Push with upstream"],
            ["git pull --rebase", "Pull with rebase"],
            ["git fetch --prune", "Fetch and prune"],
          ],
        },
        {
          section: "Undo",
          items: [
            ["git restore <file>", "Discard file changes"],
            ["git reset --soft HEAD~1", "Undo commit, keep changes"],
            ["git reset --hard HEAD~1", "Discard last commit"],
            ["git revert <sha>", "Create inverse commit"],
            ["git stash", "Stash changes"],
            ["git stash pop", "Restore stash"],
          ],
        },
      ]}
    />
  );
}

export function LinuxCheatsheet() {
  return (
    <CheatSheet
      sheets={[
        {
          section: "Files & directories",
          items: [
            ["ls -lah", "List all with sizes"],
            ["cd -", "Go to previous dir"],
            ["pwd", "Current dir"],
            ["mkdir -p a/b/c", "Nested dirs"],
            ["rm -rf dir", "Remove recursively"],
            ["cp -r src dst", "Copy recursively"],
            ["mv a b", "Move / rename"],
          ],
        },
        {
          section: "Search",
          items: [
            ['grep -rni "foo" .', "Recursive case-insensitive search"],
            ["find . -name '*.ts'", "Find files by name"],
            ["rg foo", "ripgrep (fast)"],
            ["locate foo", "Filesystem index search"],
          ],
        },
        {
          section: "Process & system",
          items: [
            ["ps aux | grep node", "Find running node"],
            ["kill -9 <pid>", "Force kill"],
            ["top", "Live processes"],
            ["df -h", "Disk usage"],
            ["du -sh *", "Size of each item"],
            ["free -h", "Memory usage"],
            ["uname -a", "System info"],
          ],
        },
        {
          section: "Networking",
          items: [
            ["curl -I https://x.com", "Show headers"],
            ["curl -sSL url | less", "Fetch quietly"],
            ["ss -tulpn", "Open sockets"],
            ["ping -c 3 1.1.1.1", "Reachability"],
            ["dig example.com", "DNS lookup"],
          ],
        },
        {
          section: "Permissions",
          items: [
            ["chmod +x file", "Make executable"],
            ["chown user:group file", "Change owner"],
            ["sudo !!", "Rerun last as root"],
          ],
        },
      ]}
    />
  );
}

export function VscodeShortcuts() {
  return (
    <CheatSheet
      sheets={[
        {
          section: "General",
          items: [
            ["⌘ ⇧ P", "Command palette"],
            ["⌘ P", "Go to file"],
            ["⌘ ,", "Preferences"],
            ["⌘ K ⌘ S", "Keyboard shortcuts"],
            ["⌘ B", "Toggle sidebar"],
          ],
        },
        {
          section: "Editing",
          items: [
            ["⌘ D", "Add next match to selection"],
            ["⌘ ⇧ L", "Select all occurrences"],
            ["⌥ ↑ / ↓", "Move line up/down"],
            ["⇧ ⌥ ↑ / ↓", "Copy line up/down"],
            ["⌘ /", "Toggle comment"],
            ["⌘ ]", "Indent line"],
          ],
        },
        {
          section: "Navigation",
          items: [
            ["⌘ G", "Go to line"],
            ["⌘ T", "Show all symbols"],
            ["F12", "Go to definition"],
            ["⌥ F12", "Peek definition"],
            ["⇧ F12", "Show references"],
          ],
        },
        {
          section: "Terminal",
          items: [
            ["⌃ `", "Toggle terminal"],
            ["⌘ J", "Toggle panel"],
            ["⌘ ⇧ `", "New terminal"],
          ],
        },
        {
          section: "Debug",
          items: [
            ["F5", "Start / continue"],
            ["F9", "Toggle breakpoint"],
            ["F10", "Step over"],
            ["F11", "Step into"],
          ],
        },
      ]}
    />
  );
}
