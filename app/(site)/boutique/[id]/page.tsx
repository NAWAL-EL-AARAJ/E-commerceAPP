import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { prixFormate } from "../../../lib/content";
import { galerieProduit } from "../../../lib/produit";
import type { Produit } from "../../../lib/types";
import Container from "../../../components/ui/Container";
import RichText from "../../../components/ui/RichText";
import AddToCartButton from "../../../components/product/AddToCartButton";
import ProductGallery from "../../../components/product/ProductGallery";
import ColorSwatches, {
  listeCouleurs,
} from "../../../components/product/ColorSwatches";

export default async function FicheProduit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("produits")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) console.error("Fiche produit:", error.message);
  if (!data) notFound();

  const produit = data as Produit;
  const couleurs = listeCouleurs(produit);
  const rupture = produit.stock === 0;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <nav className="mb-8 text-[0.7rem] uppercase tracking-[0.16em] text-taupe">
          <Link href="/boutique" className="hover:text-espresso">
            Boutique
          </Link>
          <span className="mx-2">/</span>
          <span className="text-espresso">{produit.nom}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={galerieProduit(produit)} alt={produit.nom} />

          <div className="lg:py-6">
            {produit.categorie && (
              <p className="eyebrow mb-4">{produit.categorie}</p>
            )}
            <h1 className="font-display text-4xl text-espresso sm:text-5xl">
              {produit.nom}
            </h1>
            <p className="mt-4 text-lg text-rosewood">
              {prixFormate(produit.prix)}
            </p>

            <RichText html={produit.description} className="mt-6 max-w-md" />

            {couleurs.length > 1 && (
              <div className="mt-8">
                <p className="eyebrow mb-3">Couleurs</p>
                <ColorSwatches couleurs={couleurs} max={12} size={22} />
              </div>
            )}

            <div className="mt-10 max-w-xs">
              <AddToCartButton produit={produit} variant="solid" />
              <p className="mt-3 text-xs text-taupe">
                {rupture
                  ? "Actuellement indisponible."
                  : "Livraison partout au Maroc · Paiement à la livraison."}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
