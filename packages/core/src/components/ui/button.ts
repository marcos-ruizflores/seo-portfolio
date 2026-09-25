export type ButtonVariant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-brand-fg hover:opacity-90",
  secondary: "border border-border bg-surface text-fg hover:bg-surface-muted",
  ghost: "text-muted hover:bg-surface-muted hover:text-fg",
};

/** Shared button classes for both <button> and <Link>. */
export function buttonClass(variant: ButtonVariant = "primary"): string {
  return `${base} ${variants[variant]}`;
}

export const fieldClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted";

export const labelClass = "text-sm font-medium text-fg";
