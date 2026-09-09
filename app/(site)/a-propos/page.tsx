import type { Metadata } from "next";
import { ButtonLink } from "../../components/ui/Button";
import Container from "../../components/ui/Container";
import Photo from "../../components/ui/Photo";
import { FEATURE_ICONS } from "../../components/icons";
import { FEATURES } from "../../lib/content";

export const metadata: Metadata = {
  title: "À propos — MERHAS",
  description: "L'histoire et les valeurs de MERHAS.",
};

const VALEURS = [
  {
    titre: "Le choix des matières",
    texte:
      "Chaque tissu est testé pour son tombé, sa légèreté et sa tenue tout au long de la journée.",
  },
  {
    titre: "Une palette pensée",
    texte:
      "Des teintes neutres et poudrées qui se marient à toutes les tenues, saison après saison.",
  },
  {
    titre: "Le souci du détail",
    texte:
      "Finitions soignées, emballage élégant : le plaisir commence dès l'ouverture du colis.",
  },
];

export default function AProposPage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-5">L&apos;univers MERHAS</p>
            <h1 className="font-display text-4xl leading-tight text-espresso sm:text-5xl">
              Plus qu&apos;un foulard,{" "}
              <em className="italic font-normal">une touche d&apos;élégance.</em>
            </h1>
            <p className="mt-6 text-sm leading-relaxed text-taupe">
              MERHAS est née d&apos;une envie simple : proposer des foulards
              beaux, confortables et intemporels, pensés pour la femme
              d&apos;aujourd&apos;hui. Chaque pièce est choisie avec soin pour
              révéler ta beauté naturelle, avec simplicité et raffinement.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-taupe">
              De la sélection des tissus à l&apos;emballage, nous portons une
              attention particulière à chaque étape, pour que porter un MERHAS
              soit un petit geste d&apos;élégance au quotidien.
            </p>
            <div className="mt-8">
              <ButtonLink href="/boutique">Découvrir la boutique</ButtonLink>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Photo
              src="/images/apropos/image1.png"
              alt="Cliente MERHAS"
              width={900}
              height={1100}
              className="aspect-[4/5] w-full rounded-sm object-cover"
            />
            <Photo
              src="/images/apropos/image2.png"
              alt="Coffret et collection MERHAS"
              width={1200}
              height={800}
              className="aspect-[3/2] w-full rounded-sm object-cover"
            />
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-blush/40 py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 sm:grid-cols-3">
            {VALEURS.map((v) => (
              <div key={v.titre}>
                <h3 className="font-display text-xl text-espresso">{v.titre}</h3>
                <p className="mt-2 text-sm leading-relaxed text-taupe">
                  {v.texte}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <ul className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {FEATURES.map((f) => {
              const Icon = FEATURE_ICONS[f.icon];
              return (
                <li key={f.titre} className="text-center">
                  <Icon
                    width={26}
                    height={26}
                    className="mx-auto text-rosewood"
                  />
                  <p className="mt-3 font-display text-lg text-espresso">
                    {f.titre}
                  </p>
                  <p className="mt-1 text-xs text-taupe">{f.texte}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>
    </>
  );
}
