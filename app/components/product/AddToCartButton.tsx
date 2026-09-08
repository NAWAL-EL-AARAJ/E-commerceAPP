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
  const { addToCart } = useCart();
  const [ajoute, setAjoute] = useState(false);
  const rupture = produit.stock === 0;

  function handle() {
    if (rupture) return;
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
      disabled={rupture}
      className={`w-full rounded-full px-6 py-3 text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${styles}`}
    >
      {rupture
        ? "Rupture de stock"
        : ajoute
          ? "Ajouté ✦"
          : "Ajouter au panier"}
    </button>
  );
}
