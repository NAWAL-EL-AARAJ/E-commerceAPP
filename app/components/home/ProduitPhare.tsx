"use client";

import { useEffect, useState } from "react";
import { PRODUITS_PHARES } from "../../lib/content";
import { ButtonLink } from "../ui/Button";
import Container from "../ui/Container";

const AUTOPLAY = 5000;

export default function ProduitPhare() {
  const [index, setIndex] = useState(0);
  const count = PRODUITS_PHARES.length;
  const produit = PRODUITS_PHARES[index];

  // Relancé à chaque changement : un clic manuel remet le compteur à zéro.
  useEffect(() => {
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY);
    return () => clearTimeout(t);
  }, [index, count]);

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="rounded-sm bg-blush/50 p-6 sm:p-10">
          <div
            key={index}
            className="animate-fade flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="max-w-md">
              <p className="eyebrow mb-4">{produit.eyebrow}</p>
              <h2 className="font-display text-4xl italic leading-tight text-espresso sm:text-5xl">
                {produit.titreItalique}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-taupe">
                {produit.texte}
              </p>
              <div className="mt-7">
                <ButtonLink href={produit.cta.href} variant="solid">
                  {produit.cta.label}
                </ButtonLink>
              </div>
            </div>

            <div className="flex items-center gap-4 lg:flex-col lg:items-end lg:gap-3">
              <div className="flex gap-1.5">
                {produit.palette.map((c) => (
                  <span
                    key={c}
                    className="h-5 w-5 rounded-full ring-1 ring-espresso/10"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <p className="max-w-[13rem] font-script text-xl leading-tight text-mauve lg:text-right">
                {produit.paletteTexte}
              </p>
            </div>
          </div>

          {/* Sélecteur de produit */}
          <div className="mt-8 flex flex-wrap gap-2">
            {PRODUITS_PHARES.map((p, i) => (
              <button
                key={p.titreItalique}
                onClick={() => setIndex(i)}
                aria-pressed={i === index}
                className={`rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.16em] transition-colors ${
                  i === index
                    ? "border-espresso bg-espresso text-cream"
                    : "border-espresso/20 text-taupe hover:border-espresso hover:text-espresso"
                }`}
              >
                {p.titreItalique}
              </button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
