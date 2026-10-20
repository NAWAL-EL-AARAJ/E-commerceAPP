/** Force le site public à reprendre les derniers produits tout de suite,
 * au lieu d'attendre le cache (jusqu'à 5 min). Best-effort : une erreur
 * réseau ici n'empêche jamais la sauvegarde côté admin. */
export function revaliderSite() {
  fetch("/api/revalidate", { method: "POST" }).catch(() => {});
}
