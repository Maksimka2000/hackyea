import { cn } from "@/shared/lib/cn";

export type ButtonVariant = "primary" | "accent" | "outline" | "outline-inverse";
export type ButtonSize = "md" | "lg";

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-control border-2 font-bold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border-primary bg-primary text-primary-foreground hover:border-primary-strong hover:bg-primary-strong",
  accent: "border-accent bg-accent text-accent-foreground hover:brightness-95",
  outline: "border-primary bg-transparent text-primary hover:bg-tint",
  "outline-inverse": "border-hero-foreground bg-transparent text-hero-foreground hover:bg-hero-foreground/10",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-5 py-3 text-base",
  lg: "px-6 py-4 text-lg",
};

type ButtonClassOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

export function buttonClasses({ variant = "primary", size = "md", className }: ButtonClassOptions = {}) {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}
