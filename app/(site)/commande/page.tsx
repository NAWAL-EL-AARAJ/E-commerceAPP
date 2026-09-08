"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { supabase } from "../../lib/supabase";
import { prixFormate } from "../../lib/content";
import Container from "../../components/ui/Container";
import { Button, ButtonLink } from "../../components/ui/Button";

const champ =
  "w-full border border-line bg-cream px-4 py-3 text-sm text-espresso placeholder:text-taupe/70 focus:border-rosewood focus:outline-none";

export default function CommandePage() {
  const { cart, total, clearCart } = useCart();

  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirme, setConfirme] = useState(false);
  const [erreur, setErreur] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErreur("");

    const { error } = await supabase.from("commandes").insert({
      nom_client: nom,
      telephone,
      adresse,
      produits: cart,
      total,
      statut: "en attente",
    });

    setLoading(false);

    if (error) {
      setErreur(error.message);
      return;
    }

    clearCart();
    setConfirme(true);
  }

  if (confirme) {
    return (
      <section className="py-24">
        <Container className="max-w-md text-center">
          <p className="eyebrow mb-4">Commande reçue</p>
          <h1 className="font-display text-4xl text-espresso">Merci !</h1>
          <p className="mt-3 text-sm text-taupe">
            Ta commande a bien été enregistrée. On te contacte très vite au{" "}
            {telephone}.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/boutique">Retour à la boutique</ButtonLink>
          </div>
        </Container>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="py-24">
        <Container className="max-w-md text-center text-sm text-taupe">
          Ton panier est vide.{" "}
          <Link href="/boutique" className="text-rosewood underline">
            Voir la boutique
          </Link>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16">
      <Container className="grid max-w-4xl gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="font-display text-4xl text-espresso">
            Finaliser la commande
          </h1>
          <p className="mt-2 text-sm text-taupe">
            Paiement à la livraison partout au Maroc.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nom complet"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className={champ}
              required
            />
            <input
              type="tel"
              placeholder="Téléphone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className={champ}
              required
            />
            <textarea
              placeholder="Adresse de livraison"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              rows={3}
              className={champ}
              required
            />
            {erreur && (
              <p className="text-sm text-rosewood">Erreur : {erreur}</p>
            )}
            <Button type="submit" disabled={loading} className="mt-2 w-full">
              {loading ? "Envoi…" : "Confirmer la commande"}
            </Button>
          </form>
        </div>

        <aside className="h-fit rounded-sm bg-blush/50 p-6">
          <p className="eyebrow mb-4">Récapitulatif</p>
          <ul className="divide-y divide-line">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex justify-between gap-3 py-3 text-sm"
              >
                <span className="text-espresso">
                  {item.nom}{" "}
                  <span className="text-taupe">× {item.quantite}</span>
                </span>
                <span className="text-taupe">
                  {prixFormate(item.prix * item.quantite)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span className="eyebrow">Total</span>
            <span className="font-display text-2xl text-rosewood">
              {prixFormate(total)}
            </span>
          </div>
        </aside>
      </Container>
    </section>
  );
}
