"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Produit } from "../../lib/types";
import ProductGrid from "../../components/product/ProductGrid";

export default function CatalogueFiltrable({
  produits,
}: {
  produits: Produit[];
}) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    produits.forEach((p) => p.categorie && set.add(p.categorie));
    return ["Tout", ...Array.from(set).sort()];
  }, [produits]);

  // ?categorie=… (liens de l'accueil) présélectionne le filtre.
  const demandee = useSearchParams().get("categorie");
  const [actif, setActif] = useState(
    demandee && categories.includes(demandee) ? demandee : "Tout",
  );

  const filtres =
    actif === "Tout"
      ? produits
      : produits.filter((p) => p.categorie === actif);

  return (
    <div>
      {categories.length > 2 && (
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActif(c)}
              className={`rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.16em] transition-colors ${
                actif === c
                  ? "border-espresso bg-espresso text-cream"
                  : "border-line text-taupe hover:border-espresso hover:text-espresso"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <ProductGrid
        produits={filtres}
        showAddToCart
        emptyLabel="Aucun foulard dans cette catégorie pour le moment."
      />
    </div>
  );
}
