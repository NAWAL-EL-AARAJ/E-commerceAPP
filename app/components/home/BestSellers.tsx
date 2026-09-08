import Link from "next/link";
import type { Produit } from "../../lib/types";
import { ArrowRightIcon } from "../icons";
import Container from "../ui/Container";
import ProductGrid from "../product/ProductGrid";

export default function BestSellers({ produits }: { produits: Produit[] }) {
  if (!produits || produits.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-espresso sm:text-4xl">
              Nos best-sellers
            </h2>
            <p className="mt-2 text-sm text-taupe">
              Les couleurs les plus aimées de notre communauté.
            </p>
          </div>
          <Link
            href="/boutique"
            className="hidden shrink-0 items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-espresso hover:text-rosewood sm:inline-flex"
          >
            Voir toute la collection
            <ArrowRightIcon width={15} height={15} />
          </Link>
        </div>

        <div className="mt-12">
          <ProductGrid produits={produits.slice(0, 8)} />
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-espresso"
          >
            Voir toute la collection
            <ArrowRightIcon width={15} height={15} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
