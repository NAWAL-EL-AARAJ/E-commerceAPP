import type { ButtonHTMLAttributes, ReactNode } from "react";

/** Classe commune des champs de formulaire admin. */
export const FIELD =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-espresso placeholder:text-taupe/60 transition-colors focus:border-rosewood focus:outline-none focus:ring-2 focus:ring-rosewood/15 disabled:bg-cream disabled:text-taupe";

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-white p-5 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-xl text-espresso">{children}</h2>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-taupe">
      {children}
    </span>
  );
}

type BtnVariant = "primary" | "secondary" | "ghost" | "danger";

const btnVariants: Record<BtnVariant, string> = {
  primary: "bg-rosewood text-cream hover:bg-rosewood-dark",
  secondary:
    "border border-line bg-white text-espresso hover:bg-cream",
  ghost: "text-taupe hover:bg-cream hover:text-espresso",
  danger: "bg-rosewood/10 text-rosewood hover:bg-rosewood/20",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: {
  variant?: BtnVariant;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${btnVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

export function Feedback({ message }: { message: string }) {
  if (!message) return null;
  const erreur =
    message.startsWith("Erreur") ||
    message.includes("correspond") ||
    message.includes("caractères");
  return (
    <p
      className={`text-sm ${erreur ? "text-rosewood" : "text-emerald-700"}`}
    >
      {message}
    </p>
  );
}
