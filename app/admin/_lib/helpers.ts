import type { Commande } from "../../lib/types";

export type StockNiveau = "rupture" | "faible" | "ok";

/** Retrouve le chemin d'un fichier dans un bucket Supabase Storage à partir
 * de son URL publique (…/storage/v1/object/public/<bucket>/<chemin>). */
export function cheminStorage(url: string, bucket: string): string | null {
  const marqueur = `/storage/v1/object/public/${bucket}/`;
  const i = url.indexOf(marqueur);
  if (i === -1) return null;
  return decodeURIComponent(url.slice(i + marqueur.length));
}

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

/** Classement des produits les plus vendus, à partir des commandes
 * effectivement livrées (indépendant du catalogue actuel : fonctionne même
 * si le produit a été supprimé ou renommé depuis). Une commande "en attente"
 * ou "confirmée" n'est pas encore une vente. */
export function topProduitsVendus(
  commandes: Commande[],
  limite = 5,
): { nom: string; quantite: number }[] {
  const compte = new Map<string, number>();
  for (const c of commandes) {
    if (c.statut !== "livrée" || !Array.isArray(c.produits)) continue;
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

/** Quantité réellement vendue d'un produit : uniquement les commandes
 * livrées — une commande en attente/confirmée/annulée n'est pas une vente. */
export function ventesProduit(commandes: Commande[], nom: string): number {
  let total = 0;
  const cible = nom?.toLowerCase().trim();
  for (const c of commandes) {
    if (c.statut !== "livrée" || !Array.isArray(c.produits)) continue;
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

export const MOIS_LABELS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

/** Années présentes dans les commandes, la plus récente en premier. */
export function anneesDisponibles(commandes: Commande[]): number[] {
  const annees = new Set<number>();
  for (const c of commandes) {
    const d = new Date(c.created_at ?? "");
    if (!Number.isNaN(d.getTime())) annees.add(d.getFullYear());
  }
  return Array.from(annees).sort((a, b) => b - a);
}

export interface GroupeMois {
  cle: string;
  label: string;
  commandes: Commande[];
}

/** Regroupe les commandes par mois (les plus récentes en premier). Chaque
 * mois garde ses propres commandes, déjà triées (created_at desc en amont). */
export function grouperParMois(commandes: Commande[]): GroupeMois[] {
  const groupes = new Map<string, Commande[]>();

  for (const c of commandes) {
    const d = new Date(c.created_at ?? "");
    if (Number.isNaN(d.getTime())) continue;
    const cle = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!groupes.has(cle)) groupes.set(cle, []);
    groupes.get(cle)!.push(c);
  }

  return Array.from(groupes.entries())
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([cle, cmds]) => {
      const [annee, mois] = cle.split("-").map(Number);
      return {
        cle,
        label: `${MOIS_LABELS[mois - 1]} ${annee}`,
        commandes: cmds,
      };
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
