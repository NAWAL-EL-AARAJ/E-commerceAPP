"use client";

import Link from "next/link";
import { useWishlist } from "../../context/WishlistContext";
import type { Produit } from "../../lib/types";
import ProductGrid from "../../components/product/ProductGrid";
import { ButtonLink } from "../../components/ui/Button";

export default function FavorisClient({ produits }: { produits: Produit[] }) {
  const { ids } = useWishlist();
  const favoris = produits.filter((p) => ids.includes(p.id));

  if (favoris.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="font-display text-2xl text-espresso">
          Ta liste de favoris est vide
        </p>
        <p className="mt-2 text-sm text-taupe">
          Ajoute des foulards avec le cœur pour les retrouver ici.
        </p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/boutique">Découvrir la boutique</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProductGrid produits={favoris} showAddToCart />
      <p className="mt-10 text-center text-sm text-taupe">
        <Link href="/boutique" className="hover:text-espresso">
          Continuer mes achats
        </Link>
      </p>
    </>
  );
}
