import type { Commande } from "../../lib/types";

export type StockNiveau = "rupture" | "faible" | "ok";

export function niveauStock(stock: number | null | undefined): {
  niveau: StockNiveau;
  label: string;
  classe: string;
} {
  const s = stock ?? 0;
  if (s === 0)
    return {
      niveau: "rupture",
      label: "Rupture",
      classe: "bg-rosewood/12 text-rosewood",
    };
  if (s <= 5)
    return {
      niveau: "faible",
      label: "Stock faible",
      classe: "bg-amber-100/70 text-amber-800",
    };
  return {
    niveau: "ok",
    label: "Disponible",
    classe: "bg-emerald-100/60 text-emerald-800",
  };
}

export const STATUTS_COMMANDE = [
  "en attente",
  "confirmée",
  "livrée",
  "annulée",
] as const;

export function classeStatutCommande(statut: string): string {
  switch (statut) {
    case "confirmée":
      return "bg-sky-100/70 text-sky-800";
    case "livrée":
      return "bg-emerald-100/60 text-emerald-800";
    case "annulée":
      return "bg-rosewood/12 text-rosewood";
    default:
      return "bg-amber-100/70 text-amber-800";
  }
}

/** Couleur pleine (barre de répartition) associée à un statut — même code
 * couleur que classeStatutCommande, en version pleine pour un remplissage. */
export function barreStatutCommande(statut: string): string {
  switch (statut) {
    case "confirmée":
      return "bg-sky-400";
    case "livrée":
      return "bg-emerald-400";
    case "annulée":
      return "bg-rosewood";
    default:
      return "bg-amber-400";
  }
}

/** Nombre de commandes par statut, dans l'ordre du cycle de vie. */
export function repartitionStatuts(
  commandes: Commande[],
): { statut: string; total: number }[] {
  return STATUTS_COMMANDE.map((statut) => ({
    statut,
    total: commandes.filter((c) => c.statut === statut).length,
  }));
}

/** Classement des produits les plus vendus, à partir des commandes passées
 * (indépendant du catalogue actuel : fonctionne même si le produit a été
 * supprimé ou renommé depuis). */
export function topProduitsVendus(
  commandes: Commande[],
  limite = 5,
): { nom: string; quantite: number }[] {
  const compte = new Map<string, number>();
  for (const c of commandes) {
    if (!Array.isArray(c.produits)) continue;
    for (const item of c.produits) {
      if (!item.nom) continue;
      compte.set(item.nom, (compte.get(item.nom) ?? 0) + (item.quantite || 0));
    }
  }
  return Array.from(compte.entries())
    .map(([nom, quantite]) => ({ nom, quantite }))
    .sort((a, b) => b.quantite - a.quantite)
    .slice(0, limite);
}

export function ventesProduit(commandes: Commande[], nom: string): number {
  let total = 0;
  const cible = nom?.toLowerCase().trim();
  for (const c of commandes) {
    if (!Array.isArray(c.produits)) continue;
    for (const item of c.produits) {
      if (item.nom?.toLowerCase().trim() === cible) total += item.quantite || 0;
    }
  }
  return total;
}

export function initiales(nom?: string | null, email?: string | null): string {
  if (nom && nom.trim()) {
    return nom
      .trim()
      .split(/\s+/)
      .map((m) => m[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  return email ? email[0].toUpperCase() : "?";
}

export function dateCourte(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function dateHeure(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
