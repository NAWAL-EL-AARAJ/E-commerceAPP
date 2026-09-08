import type { Metadata } from "next";
import { supabase } from "../../lib/supabase";
import type { Produit } from "../../lib/types";
import Container from "../../components/ui/Container";
import FavorisClient from "./FavorisClient";

export const metadata: Metadata = {
  title: "Mes favoris — MERHAS",
};

export const revalidate = 300;

export default async function FavorisPage() {
  const { data: produits } = await supabase.from("produits").select("*");

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <header className="mb-12 text-center">
          <p className="eyebrow mb-4">Ma sélection</p>
          <h1 className="font-display text-4xl text-espresso sm:text-5xl">
            Mes <em className="italic font-normal">favoris</em>
          </h1>
        </header>
        <FavorisClient produits={(produits as Produit[]) ?? []} />
      </Container>
    </section>
  );
}
