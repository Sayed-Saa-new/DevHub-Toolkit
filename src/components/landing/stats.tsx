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
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-16 grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
        {stats.map((s, i) => (
          <div key={s.label} className={`${i === 0 ? "" : "pl-6 md:pl-10"} pr-6 md:pr-10 py-2`}>
            <div className="text-4xl md:text-5xl font-semibold tracking-[-0.03em] tabular-nums">{s.value}</div>
            <div className="text-[11px] text-muted-foreground mt-3 tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}