"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { prixFormate, PLACEHOLDER_PRODUIT } from "../../lib/content";
import { ButtonLink } from "../ui/Button";
import Photo from "../ui/Photo";
import { BagIcon, ChevronUpIcon, CloseIcon } from "../icons";

/** Pages où le CTA panier est déjà présent dans la page elle-même. */
const MASQUEE_SUR = ["/panier", "/commande"];

export default function CartBar() {
  const pathname = usePathname();
  const { cart, nombreArticles, total, updateQuantite, removeFromCart } =
    useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  if (nombreArticles === 0) return null;
  if (MASQUEE_SUR.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      {open && (
        <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8">
          <div className="max-h-[55vh] overflow-y-auto rounded-t-2xl border border-b-0 border-line bg-cream shadow-[0_-10px_28px_rgba(59,48,43,0.12)]">
            <div className="sticky top-0 flex items-center justify-between border-b border-line bg-cream px-5 py-3">
              <p className="eyebrow">Modifier mon panier</p>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="text-taupe hover:text-espresso"
              >
                <CloseIcon width={18} height={18} />
              </button>
            </div>

            <ul className="divide-y divide-line px-5">
              {cart.map((item) => {
                const maxAtteint =
                  item.stock != null && item.quantite >= item.stock;
                return (
                <li key={item.id} className="flex gap-3 py-4">
                  <Photo
                    src={item.image_url || PLACEHOLDER_PRODUIT}
                    alt={item.nom}
                    width={56}
                    height={64}
                    className="h-16 w-14 shrink-0 rounded-sm bg-sand object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm text-espresso">
                        {item.nom}
                      </span>
                      <span className="shrink-0 text-sm text-espresso">
                        {prixFormate(item.prix * item.quantite)}
                      </span>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center border border-line bg-white">
                        <button
                          onClick={() =>
                            updateQuantite(item.id, item.quantite - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center text-espresso hover:bg-blush/60"
                          aria-label="Diminuer la quantité"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-xs">
                          {item.quantite}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantite(item.id, item.quantite + 1)
                          }
                          disabled={maxAtteint}
                          className="flex h-7 w-7 items-center justify-center text-espresso hover:bg-blush/60 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                          aria-label="Augmenter la quantité"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs uppercase tracking-[0.13em] text-taupe hover:text-rosewood"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      <div className="border-t border-line bg-cream/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 text-sm text-espresso"
          >
            <BagIcon width={18} height={18} className="shrink-0 text-rosewood" />
            <span className="hidden sm:inline">
              {nombreArticles} article{nombreArticles > 1 ? "s" : ""} ·{" "}
            </span>
            {prixFormate(total)}
            <ChevronUpIcon
              width={14}
              height={14}
              className={`text-taupe transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
          <ButtonLink href="/commande" arrow={false}>
            Passer commande
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
