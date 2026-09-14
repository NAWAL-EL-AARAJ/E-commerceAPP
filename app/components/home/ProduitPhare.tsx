import { PRODUIT_PHARE } from "../../lib/content";
import { ButtonLink } from "../ui/Button";
import Container from "../ui/Container";

const PALETTE = [
  "#f3ece1",
  "#dcc6a8",
  "#e0c0b8",
  "#c99a94",
  "#a9808a",
  "#5b4038",
  "#2b2420",
];

export default function ProduitPhare() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="rounded-sm bg-blush/50 p-6 sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-md">
              <p className="eyebrow mb-4">{PRODUIT_PHARE.eyebrow}</p>
              <h2 className="font-display text-4xl italic leading-tight text-espresso sm:text-5xl">
                {PRODUIT_PHARE.titreItalique}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-taupe">
                {PRODUIT_PHARE.texte}
              </p>
              <div className="mt-7">
                <ButtonLink href={PRODUIT_PHARE.cta.href} variant="solid">
                  {PRODUIT_PHARE.cta.label}
                </ButtonLink>
              </div>
            </div>

            <div className="flex items-center gap-4 lg:flex-col lg:items-end lg:gap-3">
              <div className="flex gap-1.5">
                {PALETTE.map((c) => (
                  <span
                    key={c}
                    className="h-5 w-5 rounded-full ring-1 ring-espresso/10"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <p className="max-w-[13rem] font-script text-xl leading-tight text-mauve lg:text-right">
                {PRODUIT_PHARE.paletteTexte}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
