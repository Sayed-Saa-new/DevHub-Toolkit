export function SectionHead({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  const isLeft = align === "left";
  return (
    <div className={isLeft ? "max-w-2xl" : "text-center max-w-2xl mx-auto"}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-px w-6 bg-border" />
          {eyebrow}
        </div>
      )}
      <h2
        className={`${eyebrow ? "mt-3" : ""} text-3xl md:text-[2.75rem] font-semibold tracking-[-0.02em] leading-[1.05]`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
