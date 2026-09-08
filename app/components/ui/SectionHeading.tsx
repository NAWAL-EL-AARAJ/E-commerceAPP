import type { ReactNode } from "react";

/**
 * Titre de section : label capitale espacée + titre serif dont la 2e partie
 * est en italique (motif récurrent de la maquette).
 */
export default function SectionHeading({
  eyebrow,
  titre,
  titreItalique,
  align = "left",
  className = "",
  children,
}: {
  eyebrow?: string;
  titre?: string;
  titreItalique?: string;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`${align === "center" ? "text-center mx-auto max-w-2xl" : ""} ${className}`}
    >
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      {(titre || titreItalique) && (
        <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-espresso">
          {titre}
          {titre && titreItalique ? " " : ""}
          {titreItalique && <em className="italic font-normal">{titreItalique}</em>}
        </h2>
      )}
      {children && <div className="mt-4 text-taupe">{children}</div>}
    </div>
  );
}
