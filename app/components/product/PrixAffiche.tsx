import { enPromo, pourcentagePromo, prixFormate } from "../../lib/content";

export default function PrixAffiche({
  prix,
  ancienPrix,
  taille = "sm",
  className = "",
}: {
  prix: number;
  ancienPrix?: number | null;
  taille?: "sm" | "lg";
  className?: string;
}) {
  const promo = enPromo(prix, ancienPrix);

  if (!promo) {
    return (
      <p className={`${taille === "lg" ? "text-lg text-rosewood" : "text-sm text-taupe"} ${className}`}>
        {prixFormate(prix)}
      </p>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={taille === "lg" ? "text-lg text-rosewood" : "text-sm text-rosewood"}>
        {prixFormate(prix)}
      </span>
      <span className="text-sm text-taupe line-through">
        {prixFormate(ancienPrix)}
      </span>
      <span className="rounded-full bg-rosewood/10 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-rosewood">
        −{pourcentagePromo(prix, ancienPrix as number)}%
      </span>
    </div>
  );
}
