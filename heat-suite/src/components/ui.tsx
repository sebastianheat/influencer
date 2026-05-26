import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type {
  ApplicationStatus,
  CampaignStatus,
  Platform,
} from "@/lib/types";

/* ---------- Button ---------- */
type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  href?: string;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  full?: boolean;
};

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-50";
const btnSizes = { sm: "h-9 px-3.5 text-[13px]", md: "h-11 px-5 text-sm" };
const btnVariants = {
  primary:
    "heat-gradient-blue text-white shadow-[var(--shadow-accent)] hover:brightness-110",
  secondary:
    "bg-surface text-ink border border-line-strong hover:border-accent hover:text-accent",
  ghost: "text-muted hover:bg-card hover:text-ink",
  danger: "bg-danger-bg text-danger hover:bg-danger hover:text-white",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className,
  type = "button",
  onClick,
  full,
}: ButtonProps) {
  const cls = cn(
    btnBase,
    btnSizes[size],
    btnVariants[variant],
    full && "w-full",
    className,
  );
  if (href)
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

/* ---------- Card ---------- */
export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[14px] border border-line bg-surface shadow-[var(--shadow-soft)]",
        padded && "p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ---------- Stat ---------- */
export function StatCard({
  label,
  value,
  delta,
  icon,
}: {
  label: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-soft-ink">{label}</p>
          <p className="mt-1.5 text-2xl font-extrabold tracking-tight text-ink">
            {value}
          </p>
          {delta && (
            <p className="mt-1 text-xs font-semibold text-success">{delta}</p>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent-soft text-lg">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

/* ---------- Badges ---------- */
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
}) {
  const tones = {
    neutral: "bg-card text-muted",
    accent: "bg-accent-soft text-accent",
    success: "bg-success-bg text-success",
    warning: "bg-warning-bg text-warning",
    danger: "bg-danger-bg text-danger",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

const campaignStatusMap: Record<
  CampaignStatus,
  { label: string; tone: "neutral" | "accent" | "success" | "warning" }
> = {
  draft: { label: "Borrador", tone: "neutral" },
  active: { label: "Activa", tone: "success" },
  review: { label: "En revisión", tone: "warning" },
  completed: { label: "Completada", tone: "accent" },
};

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const s = campaignStatusMap[status];
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

const appStatusMap: Record<
  ApplicationStatus,
  { label: string; tone: "neutral" | "accent" | "success" | "danger" }
> = {
  pending: { label: "Pendiente", tone: "neutral" },
  shortlisted: { label: "Preseleccionado", tone: "accent" },
  accepted: { label: "Aceptado", tone: "success" },
  rejected: { label: "Rechazado", tone: "danger" },
};

export function ApplicationStatusBadge({
  status,
}: {
  status: ApplicationStatus;
}) {
  const s = appStatusMap[status];
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

/* ---------- Avatar ---------- */
const avatarGradients = [
  "linear-gradient(135deg,#5BA9FF,#8B5CF6)",
  "linear-gradient(135deg,#34D399,#10B981)",
  "linear-gradient(135deg,#2563EB,#7C3AED)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#06B6D4,#3B82F6)",
];

export function Avatar({
  name,
  size = 40,
}: {
  name: string;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const idx =
    name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
    avatarGradients.length;
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{
        width: size,
        height: size,
        background: avatarGradients[idx],
        fontSize: size * 0.38,
      }}
    >
      {initials}
    </div>
  );
}

/* ---------- Progress ---------- */
export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-card">
      <div
        className="heat-gradient-blue h-full rounded-full transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ---------- Platform icons (text glyphs) ---------- */
const platformGlyph: Record<Platform, { label: string; bg: string }> = {
  instagram: { label: "IG", bg: "linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)" },
  tiktok: { label: "TT", bg: "#000000" },
  youtube: { label: "YT", bg: "#FF0000" },
  twitch: { label: "TW", bg: "#9146FF" },
};

export function PlatformChips({ platforms }: { platforms: Platform[] }) {
  return (
    <div className="flex items-center gap-1">
      {platforms.map((p) => (
        <span
          key={p}
          title={p}
          className="flex h-6 w-6 items-center justify-center rounded-md text-[9px] font-bold text-white"
          style={{ background: platformGlyph[p].bg }}
        >
          {platformGlyph[p].label}
        </span>
      ))}
    </div>
  );
}

/* ---------- Page header ---------- */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-soft-ink">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({
  label,
  type = "text",
  placeholder,
  defaultValue,
  hint,
  name,
  required,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  hint?: string;
  name?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink">
        {label}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="h-11 w-full rounded-[10px] border border-line bg-surface px-3.5 text-sm text-ink placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
      />
      {hint && <span className="mt-1 block text-xs text-dim">{hint}</span>}
    </label>
  );
}

export function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-line-strong bg-soft py-16 text-center">
      <div className="text-4xl">{icon}</div>
      <p className="mt-3 font-bold text-ink">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-soft-ink">{subtitle}</p>}
    </div>
  );
}
