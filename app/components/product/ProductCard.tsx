"use client";

import Link from "next/link";
import { useWishlist } from "../../context/WishlistContext";
import { prixFormate, PLACEHOLDER_PRODUIT } from "../../lib/content";
import type { Produit } from "../../lib/types";
import { HeartIcon } from "../icons";
import Photo from "../ui/Photo";
import ColorSwatches, { listeCouleurs } from "./ColorSwatches";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({
  produit,
  showAddToCart = false,
}: {
  produit: Produit;
  showAddToCart?: boolean;
}) {
  const { has, toggle } = useWishlist();
  const aime = has(produit.id);
  const couleurs = listeCouleurs(produit);
  const href = `/boutique/${produit.id}`;

  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden rounded-sm bg-sand">
        <Link href={href} aria-label={produit.nom}>
          <Photo
            src={produit.image_url || PLACEHOLDER_PRODUIT}
            alt={produit.nom}
            width={600}
            height={720}
            className="aspect-[5/6] w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        <button
          onClick={() => toggle(produit.id)}
          aria-label={aime ? "Retirer des favoris" : "Ajouter aux favoris"}
          aria-pressed={aime}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-cream/85 text-espresso backdrop-blur transition-colors hover:bg-cream"
        >
          <HeartIcon
            width={17}
            height={17}
            className={aime ? "fill-rosewood text-rosewood" : ""}
          />
        </button>

        {produit.stock === 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-espresso/80 px-3 py-1 text-[0.6rem] uppercase tracking-[0.15em] text-cream">
            Épuisé
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        {produit.categorie && (
          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-taupe">
            {produit.categorie}
          </p>
        )}
        <h3 className="mt-1 font-display text-lg text-espresso">
          <Link href={href} className="hover:text-rosewood">
            {produit.nom}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-taupe">{prixFormate(produit.prix)}</p>

        {couleurs.length > 0 && (
          <div className="mt-3">
            <ColorSwatches couleurs={couleurs} />
          </div>
        )}

        {showAddToCart && (
          <div className="mt-4">
            <AddToCartButton produit={produit} />
          </div>
        )}
      </div>
    </article>
  );
}
