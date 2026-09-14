"use client";

import { useState } from "react";
import { useCart } from "../../context/CartContext";
import type { Produit } from "../../lib/types";

export default function AddToCartButton({
  produit,
  variant = "line",
  quantite = 1,
}: {
  produit: Produit;
  variant?: "line" | "solid";
  quantite?: number;
}) {
  const { cart, addToCart } = useCart();
  const [ajoute, setAjoute] = useState(false);

  const dejaAuPanier = cart.find((item) => item.id === produit.id)?.quantite ?? 0;
  const rupture = produit.stock === 0;
  const maxAtteint = !rupture && produit.stock != null && dejaAuPanier >= produit.stock;

  function handle() {
    if (rupture || maxAtteint) return;
    addToCart(produit, quantite);
    setAjoute(true);
    setTimeout(() => setAjoute(false), 1600);
  }

  const styles =
    variant === "solid"
      ? "bg-espresso text-cream hover:bg-rosewood"
      : "border border-espresso/25 text-espresso hover:border-espresso hover:bg-espresso hover:text-cream";

  return (
    <button
      onClick={handle}
      disabled={rupture || maxAtteint}
      className={`w-full rounded-full px-6 py-3 text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${styles}`}
    >
      {rupture
        ? "Rupture de stock"
        : maxAtteint
          ? "Stock maximum atteint"
          : ajoute
            ? "Ajouté ✦"
            : "Ajouter au panier"}
    </button>
  );
}
