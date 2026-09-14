"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { CartItem, Produit } from "../lib/types";

interface CartContextValue {
  cart: CartItem[];
  addToCart: (produit: Produit, quantite?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantite: (id: string, quantite: number) => void;
  clearCart: () => void;
  total: number;
  nombreArticles: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "merhas_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCart(JSON.parse(saved) as CartItem[]);
    } catch {
      /* localStorage indisponible */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart, loaded]);

  /** Stock dispo pour un produit ; null/undefined = pas de limite suivie. */
  function stockMax(stock: number | null | undefined) {
    return stock == null ? Infinity : stock;
  }

  function addToCart(produit: Produit, quantite = 1) {
    setCart((prev) => {
      const max = stockMax(produit.stock);
      const existing = prev.find((item) => item.id === produit.id);

      if (existing) {
        const nouvelleQuantite = Math.min(existing.quantite + quantite, max);
        if (nouvelleQuantite === existing.quantite) return prev; // stock déjà atteint
        return prev.map((item) =>
          item.id === produit.id
            ? { ...item, quantite: nouvelleQuantite }
            : item,
        );
      }

      const quantiteInitiale = Math.min(quantite, max);
      if (quantiteInitiale < 1) return prev; // rupture de stock
      return [...prev, { ...produit, quantite: quantiteInitiale }];
    });
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function updateQuantite(id: string, quantite: number) {
    if (quantite < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantite: Math.min(quantite, stockMax(item.stock)) }
          : item,
      ),
    );
  }

  function clearCart() {
    setCart([]);
  }

  const total = cart.reduce((sum, item) => sum + item.prix * item.quantite, 0);
  const nombreArticles = cart.reduce((sum, item) => sum + item.quantite, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantite,
        clearCart,
        total,
        nombreArticles,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans un <CartProvider>");
  return ctx;
}
