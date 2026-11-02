"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { supabase } from "../../lib/supabase";
import {
  fraisLivraison,
  prixFormate,
  PLACEHOLDER_PRODUIT,
} from "../../lib/content";
import Container from "../../components/ui/Container";
import Photo from "../../components/ui/Photo";
import { Button, ButtonLink } from "../../components/ui/Button";

const champ =
  "w-full border border-line bg-cream px-4 py-3 text-sm text-espresso placeholder:text-taupe/70 focus:border-rosewood focus:outline-none";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Accepte le numéro local avec ou sans le 0 initial (0665727666 ou
 * 665727666) et renvoie le +212XXXXXXXXX correspondant, ou null si invalide. */
function normaliserTelephone(local: string): string | null {
  const chiffres = local.replace(/\D/g, "");
  const sansZero = chiffres.startsWith("0") ? chiffres.slice(1) : chiffres;
  if (!/^[5-7]\d{8}$/.test(sansZero)) return null;
  return `+212${sansZero}`;
}

export default function CommandePage() {
  const { cart, total, clearCart, updateQuantite, removeFromCart } = useCart();

  const [nom, setNom] = useState("");
  const [telephoneLocal, setTelephoneLocal] = useState("");
  const [email, setEmail] = useState("");
  const [ville, setVille] = useState("");
  const [adresse, setAdresse] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirme, setConfirme] = useState(false);
  const [erreur, setErreur] = useState("");
  const [telephoneConfirme, setTelephoneConfirme] = useState("");

  // Les frais ne s'affichent qu'une fois la ville saisie.
  const livraison = ville.trim() ? fraisLivraison(ville) : null;
  const totalAPayer = total + (livraison ?? 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");

    if (!nom.trim() || !email.trim() || !ville.trim() || !adresse.trim()) {
      setErreur("Merci de remplir tous les champs.");
      return;
    }
    const telephone = normaliserTelephone(telephoneLocal);
    if (!telephone) {
      setErreur(
        "Numéro invalide. Saisis ton numéro marocain, avec ou sans le 0 (ex. 0665727666 ou 665727666).",
      );
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setErreur("Merci de saisir une adresse e-mail valide.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("commandes").insert({
      nom_client: nom.trim(),
      telephone,
      email: email.trim(),
      ville: ville.trim(),
      adresse: adresse.trim(),
      produits: cart,
      total: totalAPayer,
      statut: "en attente",
    });

    setLoading(false);

    if (error) {
      setErreur(error.message);
      return;
    }

    setTelephoneConfirme(telephone);
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
            {telephoneConfirme}.
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
            <div className="flex">
              <span className="flex items-center whitespace-nowrap border border-r-0 border-line bg-sand px-3 text-sm text-taupe">
                +212
              </span>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="06xxxxxxxx ou 6xxxxxxxx"
                value={telephoneLocal}
                onChange={(e) => setTelephoneLocal(e.target.value)}
                className={`${champ} border-l-0`}
                required
              />
            </div>
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={champ}
              required
            />
            <input
              type="text"
              placeholder="Ville"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              className={champ}
              required
            />
            <textarea
              placeholder="Adresse exacte (rue, numéro, repères...)"
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
          <div className="flex items-baseline justify-between">
            <p className="eyebrow">Récapitulatif</p>
            <Link
              href="/boutique"
              className="text-xs uppercase tracking-[0.15em] text-taupe hover:text-espresso"
            >
              + Ajouter
            </Link>
          </div>

          <ul className="mt-4 divide-y divide-line">
            {cart.map((item) => {
              const maxAtteint =
                item.stock != null && item.quantite >= item.stock;
              return (
              <li key={item.id} className="flex gap-3 py-4">
                <Link
                  href={`/boutique/${item.id}`}
                  className="shrink-0 overflow-hidden rounded-sm bg-sand"
                >
                  <Photo
                    src={item.image_url || PLACEHOLDER_PRODUIT}
                    alt={item.nom}
                    width={64}
                    height={76}
                    className="h-[76px] w-16 object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm text-espresso">{item.nom}</span>
                    <span className="shrink-0 text-sm text-espresso">
                      {prixFormate(item.prix * item.quantite)}
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center border border-line bg-cream">
                      <button
                        type="button"
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
                        type="button"
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
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs uppercase tracking-[0.13em] text-taupe hover:text-rosewood"
                    >
                      Retirer
                    </button>
                  </div>
                  {maxAtteint && (
                    <p className="mt-1 text-[0.7rem] text-taupe">
                      Stock maximum atteint.
                    </p>
                  )}
                </div>
              </li>
              );
            })}
          </ul>

          <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4 text-sm text-espresso">
            <div className="flex items-baseline justify-between">
              <span className="text-taupe">Sous-total</span>
              <span>{prixFormate(total)}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-taupe">Livraison</span>
              {livraison === null ? (
                <span className="text-xs text-taupe">Saisis ta ville</span>
              ) : (
                <span>{prixFormate(livraison)}</span>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span className="eyebrow">Total</span>
            <span className="font-display text-2xl text-rosewood">
              {prixFormate(totalAPayer)}
            </span>
          </div>
        </aside>
      </Container>
    </section>
  );
}
