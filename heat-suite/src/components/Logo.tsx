import { cn } from "@/lib/cn";

export function Logo({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="heat-gradient-blue flex h-9 w-9 items-center justify-center rounded-[11px] text-base font-extrabold text-white shadow-[var(--shadow-accent)]">
        H
      </div>
      <div className="leading-none">
        <span
          className={cn(
            "block text-[15px] font-extrabold tracking-tight",
            variant === "light" ? "text-white" : "text-ink",
          )}
        >
          Heat Suite
        </span>
        <span
          className={cn(
            "block text-[10px] font-semibold uppercase tracking-[0.18em]",
            variant === "light" ? "text-sky" : "text-dim",
          )}
        >
          Influencers
        </span>
      </div>
    </div>
  );
}
