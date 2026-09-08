"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { prixFormate, PLACEHOLDER_PRODUIT } from "../../lib/content";
import Container from "../../components/ui/Container";
import Photo from "../../components/ui/Photo";
import { ButtonLink } from "../../components/ui/Button";

export default function PanierPage() {
  const { cart, removeFromCart, updateQuantite, total } = useCart();

  if (cart.length === 0) {
    return (
      <section className="py-24">
        <Container className="text-center">
          <p className="eyebrow mb-4">Panier</p>
          <h1 className="font-display text-3xl text-espresso">
            Ton panier est vide
          </h1>
          <p className="mt-2 text-sm text-taupe">
            Découvre nos foulards et compose ta sélection.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/boutique">Voir la boutique</ButtonLink>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl text-espresso">Mon panier</h1>

        <ul className="mt-10 divide-y divide-line border-y border-line">
          {cart.map((item) => (
            <li key={item.id} className="flex gap-4 py-6">
              <Link
                href={`/boutique/${item.id}`}
                className="shrink-0 overflow-hidden rounded-sm bg-sand"
              >
                <Photo
                  src={item.image_url || PLACEHOLDER_PRODUIT}
                  alt={item.nom}
                  width={96}
                  height={112}
                  className="h-28 w-24 object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <div>
                    <h2 className="font-display text-lg text-espresso">
                      {item.nom}
                    </h2>
                    {item.categorie && (
                      <p className="text-xs uppercase tracking-[0.15em] text-taupe">
                        {item.categorie}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-espresso">
                    {prixFormate(item.prix * item.quantite)}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center border border-line">
                    <button
                      onClick={() => updateQuantite(item.id, item.quantite - 1)}
                      className="flex h-9 w-9 items-center justify-center text-espresso hover:bg-blush/50"
                      aria-label="Diminuer"
                    >
                      −
                    </button>
                    <span className="w-9 text-center text-sm">
                      {item.quantite}
                    </span>
                    <button
                      onClick={() => updateQuantite(item.id, item.quantite + 1)}
                      className="flex h-9 w-9 items-center justify-center text-espresso hover:bg-blush/50"
                      aria-label="Augmenter"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs uppercase tracking-[0.15em] text-taupe hover:text-rosewood"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-baseline justify-between">
          <span className="eyebrow">Total</span>
          <span className="font-display text-3xl text-rosewood">
            {prixFormate(total)}
          </span>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <ButtonLink href="/boutique" variant="outline" arrow={false}>
            Continuer mes achats
          </ButtonLink>
          <ButtonLink href="/commande">Passer la commande</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
