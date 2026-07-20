export function SectionHead({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="inline-block text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground border border-border rounded-full px-3 py-1">
        {eyebrow}
      </div>
      <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}