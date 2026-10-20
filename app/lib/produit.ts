import type { Produit } from "./types";

/** Galerie d'un produit : `images` si renseigné, sinon juste `image_url`
 * (anciens produits créés avant la galerie), sans doublons ni vides. */
export function galerieProduit(produit: Produit): string[] {
  const liste =
    produit.images && produit.images.length > 0
      ? produit.images
      : [produit.image_url].filter((u): u is string => Boolean(u));
  return Array.from(new Set(liste.filter(Boolean)));
}
