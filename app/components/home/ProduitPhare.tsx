import { PRODUIT_PHARE } from "../../lib/content";
import { ButtonLink } from "../ui/Button";
import Container from "../ui/Container";
import Photo from "../ui/Photo";

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
        <div className="grid items-center gap-10 rounded-sm bg-blush/50 p-6 sm:p-10 lg:grid-cols-[1fr_1.15fr_auto] lg:gap-14">
          <div>
            <p className="eyebrow mb-4">{PRODUIT_PHARE.eyebrow}</p>
            <h2 className="font-display text-4xl italic leading-tight text-espresso sm:text-5xl">
              {PRODUIT_PHARE.titreItalique}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-taupe">
              {PRODUIT_PHARE.texte}
            </p>
            <div className="mt-7">
              <ButtonLink href={PRODUIT_PHARE.cta.href} variant="solid">
                {PRODUIT_PHARE.cta.label}
              </ButtonLink>
            </div>
          </div>

          <div className="overflow-hidden rounded-sm">
            <Photo
              src={PRODUIT_PHARE.image}
              alt={PRODUIT_PHARE.nom}
              width={900}
              height={620}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-center">
            <div className="flex gap-1.5 lg:flex-col">
              {PALETTE.map((c) => (
                <span
                  key={c}
                  className="h-6 w-6 rounded-full ring-1 ring-espresso/10"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <p className="max-w-[9rem] font-script text-lg leading-tight text-mauve">
              {PRODUIT_PHARE.paletteTexte}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
