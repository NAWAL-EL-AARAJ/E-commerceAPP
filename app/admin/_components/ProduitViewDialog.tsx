"use client";

import { prixFormate } from "../../lib/content";
import RichText, { descriptionVide } from "../../components/ui/RichText";
import type { Produit } from "../../lib/types";
import { niveauStock } from "../_lib/helpers";
import Dialog from "./Dialog";
import { Badge } from "./ui";

export default function ProduitViewDialog({
  produit,
  ventes,
  onClose,
}: {
  produit: Produit;
  ventes: number;
  onClose: () => void;
}) {
  const stock = niveauStock(produit.stock);

  return (
    <Dialog titre={produit.nom} onClose={onClose}>
      {produit.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={produit.image_url}
          alt={produit.nom}
          className="mb-4 max-h-64 w-full rounded-xl object-cover"
        />
      )}
      {descriptionVide(produit.description) ? (
        <p className="text-sm text-taupe">Aucune description.</p>
      ) : (
        <RichText html={produit.description} />
      )}
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <Info label="Prix">{prixFormate(produit.prix)}</Info>
        <Info label="Catégorie">{produit.categorie || "—"}</Info>
        <Info label="Stock">
          <span className="inline-flex items-center gap-2">
            {produit.stock ?? 0}
            <Badge className={stock.classe}>{stock.label}</Badge>
          </span>
        </Info>
        <Info label="Ventes">{ventes} vendus</Info>
      </dl>
    </Dialog>
  );
}

function Info({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-cream px-3 py-2.5">
      <dt className="text-xs uppercase tracking-[0.12em] text-taupe">
        {label}
      </dt>
      <dd className="mt-0.5 text-espresso">{children}</dd>
    </div>
  );
}
