import { TOOLS } from "@/lib/tools";

export function Stats() {
  const stats = [
    { value: `${TOOLS.length}+`, label: "Developer utilities" },
    { value: "6", label: "Curated categories" },
    { value: "100%", label: "Runs in your browser" },
    { value: "0", label: "Signups required" },
  ];
  return (
    <section className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-4xl md:text-5xl font-semibold tracking-tight">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}