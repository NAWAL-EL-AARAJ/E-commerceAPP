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
