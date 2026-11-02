import { Suspense } from "react";
import type { Metadata } from "next";
import { supabase } from "../../lib/supabase";
import type { Produit } from "../../lib/types";
import Container from "../../components/ui/Container";
import CatalogueFiltrable from "./CatalogueFiltrable";

export const metadata: Metadata = {
  title: "Boutique — MERHAS",
  description: "Toute la collection de foulards MERHAS.",
};

export const revalidate = 300;

export default async function BoutiquePage() {
  const { data: produits, error } = await supabase
    .from("produits")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error("Chargement boutique:", error.message);

  return (
    <>
      <header className="border-b border-line bg-blush/40 py-16 text-center">
        <Container>
          <p className="eyebrow mb-4">La collection</p>
          <h1 className="font-display text-4xl text-espresso sm:text-5xl">
            Nos <em className="italic font-normal">foulards</em>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-taupe">
            Des matières fluides et une palette pensée pour chaque style.
          </p>
        </Container>
      </header>

      <section className="py-16">
        <Container>
          <Suspense>
            <CatalogueFiltrable produits={(produits as Produit[]) ?? []} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
