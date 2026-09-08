import { couleurVersHex } from "../../lib/content";
import type { Produit } from "../../lib/types";

/** Normalise le champ `couleurs` (array | "a, b, c" | null) en tableau. */
export function listeCouleurs(produit: Pick<Produit, "couleurs" | "nom">): string[] {
  const brut = produit.couleurs;
  if (Array.isArray(brut)) return brut.filter(Boolean);
  if (typeof brut === "string" && brut.trim())
    return brut.split(/[,;/]/).map((c) => c.trim()).filter(Boolean);
  return [produit.nom];
}

export default function ColorSwatches({
  couleurs,
  max = 5,
  size = 14,
}: {
  couleurs: string[];
  max?: number;
  size?: number;
}) {
  if (!couleurs.length) return null;
  const visibles = couleurs.slice(0, max);
  const reste = couleurs.length - visibles.length;

  return (
    <div className="flex items-center gap-1.5">
      {visibles.map((c, i) => (
        <span
          key={`${c}-${i}`}
          title={c}
          className="inline-block rounded-full ring-1 ring-espresso/10"
          style={{ width: size, height: size, backgroundColor: couleurVersHex(c) }}
        />
      ))}
      {reste > 0 && (
        <span className="text-[0.65rem] text-taupe">+{reste}</span>
      )}
    </div>
  );
}
