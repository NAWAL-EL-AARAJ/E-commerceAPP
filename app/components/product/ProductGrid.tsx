import type { Produit } from "../../lib/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  produits,
  showAddToCart = false,
  emptyLabel = "Aucun produit pour le moment.",
  className = "",
}: {
  produits: Produit[] | null | undefined;
  showAddToCart?: boolean;
  emptyLabel?: string;
  className?: string;
}) {
  if (!produits || produits.length === 0) {
    return <p className="text-taupe">{emptyLabel}</p>;
  }

  return (
    <div
      className={`grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-4 ${className}`}
    >
      {produits.map((produit) => (
        <ProductCard
          key={produit.id}
          produit={produit}
          showAddToCart={showAddToCart}
        />
      ))}
    </div>
  );
}
