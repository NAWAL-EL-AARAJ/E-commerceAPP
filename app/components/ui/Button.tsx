import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRightIcon } from "../icons";

type Variant = "solid" | "outline" | "ghost" | "invert";
type Size = "md" | "lg";

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-[0.7rem]",
  lg: "px-8 py-4 text-xs",
};

const variants: Record<Variant, string> = {
  solid:
    "bg-rosewood text-cream hover:bg-rosewood-dark border border-rosewood hover:border-rosewood-dark",
  outline:
    "border border-espresso/25 text-espresso hover:border-espresso hover:bg-espresso hover:text-cream",
  ghost: "text-espresso hover:text-rosewood",
  /** Bouton clair, pour un fond foncé (bannières). */
  invert:
    "bg-cream text-espresso hover:bg-cream/90 border border-cream hover:border-cream/90",
};

const baseClass =
  "inline-flex items-center gap-3 uppercase tracking-[0.22em] font-medium transition-colors duration-300 rounded-full";

function content(children: ReactNode, arrow: boolean) {
  return (
    <>
      <span>{children}</span>
      {arrow && <ArrowRightIcon width={16} height={16} className="shrink-0" />}
    </>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "solid",
  size = "md",
  arrow = true,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`${baseClass} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {content(children, arrow)}
    </Link>
  );
}

export function Button({
  children,
  variant = "solid",
  size = "md",
  arrow = false,
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${baseClass} ${sizes[size]} ${variants[variant]} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {content(children, arrow)}
    </button>
  );
}
