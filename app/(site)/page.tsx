import { supabase } from "../lib/supabase";
import type { Produit } from "../lib/types";
import Hero from "../components/home/Hero";
import FeatureStrip from "../components/home/FeatureStrip";
import ProduitPhare from "../components/home/ProduitPhare";
import UniversMerhas from "../components/home/UniversMerhas";
import BestSellers from "../components/home/BestSellers";

export const revalidate = 300;

export default async function Home() {
  const { data: produits, error } = await supabase
    .from("produits")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error("Chargement produits:", error.message);

  return (
    <>
      <Hero />
      <FeatureStrip />
      <ProduitPhare />
      <UniversMerhas />
      <BestSellers produits={(produits as Produit[]) ?? []} />
    </>
  );
}
