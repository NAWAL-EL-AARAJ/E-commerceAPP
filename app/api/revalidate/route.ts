import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Appelé depuis l'admin après chaque création/modification/suppression de
 * produit, pour que le changement apparaisse tout de suite sur le site
 * public (sinon /boutique reste en cache jusqu'à 5 min — voir `revalidate`
 * sur app/(site)/boutique/page.tsx).
 */
export async function POST() {
  revalidatePath("/boutique");
  revalidatePath("/boutique/[id]", "page");
  revalidatePath("/favoris");
  revalidatePath("/");
  return NextResponse.json({ revalidated: true });
}
