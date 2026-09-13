import Hero from "../components/home/Hero";
import FeatureStrip from "../components/home/FeatureStrip";
import ProduitPhare from "../components/home/ProduitPhare";
import UniversMerhas from "../components/home/UniversMerhas";
import BoutiqueCTA from "../components/home/BoutiqueCTA";
import CommanderCTA from "../components/home/CommanderCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureStrip />
      <ProduitPhare />
      <UniversMerhas />
      <BoutiqueCTA />
      <CommanderCTA />
    </>
  );
}
