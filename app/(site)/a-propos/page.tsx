import type { Metadata } from "next";
import { ButtonLink } from "../../components/ui/Button";
import Container from "../../components/ui/Container";
import Photo from "../../components/ui/Photo";
import { FEATURE_ICONS } from "../../components/icons";
import { FEATURES } from "../../lib/content";

export const metadata: Metadata = {
  title: "À propos — MERHAS",
  description:
    "MERHAS, l'histoire de Maryam & Hasnae : deux amies, une vision, une marque de foulards haut de gamme.",
};

const EXIGENCES = [
  {
    titre: "Finitions soignées",
    texte:
      "Chaque détail compte : de la sélection du tissu au choix des couleurs, jusqu'à la présentation finale.",
  },
  {
    titre: "Matières agréables",
    texte:
      "Des couleurs élégantes et durables, choisies pour être raffinées, harmonieuses et faciles à porter.",
  },
  {
    titre: "Le luxe dans la simplicité",
    texte:
      "Une expérience digne d'un univers premium, pensée du tissu jusqu'à l'emballage.",
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
              MERHAS est née de la rencontre de deux amies,{" "}
              <strong className="font-medium text-espresso">
                Maryam et Hasnae
              </strong>
              , réunies par une même passion : la mode, l&apos;élégance et le
              goût des belles choses. Le nom MERHAS est inspiré de leurs deux
              prénoms — il représente avant tout une aventure construite
              ensemble.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-taupe">
              Une idée simple, une ambition grande : créer un foulard qui
              associe élégance, confort et qualité, tout en offrant une
              expérience digne d&apos;un univers premium. Chez MERHAS, un
              foulard n&apos;est pas un simple accessoire — c&apos;est une
              pièce qui sublime une tenue et révèle la beauté naturelle de
              celle qui le porte.
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
          <p className="eyebrow mb-4 text-center">L&apos;exigence de la qualité</p>
          <h2 className="mx-auto max-w-xl text-center font-display text-2xl leading-snug text-espresso sm:text-3xl">
            Le luxe dans <em className="italic font-normal">la simplicité.</em>
          </h2>
          <div className="mx-auto mt-12 grid max-w-4xl gap-10 sm:grid-cols-3">
            {EXIGENCES.map((v) => (
              <div key={v.titre} className="text-center sm:text-left">
                <h3 className="font-display text-xl text-espresso">
                  {v.titre}
                </h3>
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
          <p className="eyebrow mb-4 text-center">L&apos;expérience MERHAS</p>
          <h2 className="mx-auto max-w-lg text-center font-display text-2xl leading-snug text-espresso sm:text-3xl">
            Un geste d&apos;élégance,{" "}
            <em className="italic font-normal">dès l&apos;ouverture du colis.</em>
          </h2>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4">
            <Photo
              src="/images/apropos/image3.png"
              alt="Foulards MERHAS pliés dans leur coffret"
              width={720}
              height={960}
              className="aspect-[3/4] w-full rounded-sm object-cover"
            />
            <Photo
              src="/images/apropos/image4.png"
              alt="Coffret et pochette cadeau MERHAS"
              width={720}
              height={960}
              className="aspect-[3/4] w-full rounded-sm object-cover"
            />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="max-w-2xl text-center">
          <p className="eyebrow mb-5">Notre vision</p>
          <p className="font-display text-2xl italic leading-relaxed text-espresso sm:text-3xl">
            « Le luxe ne réside pas seulement dans l&apos;apparence, mais
            aussi dans la sensation, la qualité et l&apos;attention portée
            aux détails. »
          </p>
          <div className="mx-auto mt-8 h-px w-12 bg-line" />
          <p className="mt-8 font-display text-xl text-espresso">
            MERHAS — Maryam &amp; Hasnae
          </p>
          <p className="mt-1 font-script text-2xl text-mauve">
            Deux amies, une vision, une marque.
          </p>
        </Container>
      </section>

      <section className="pb-16 sm:pb-20">
        <Container>
          <p className="mb-10 text-center font-display text-2xl text-espresso sm:text-3xl">
            <span className="uppercase tracking-[0.18em]">Élégance</span>
            <span className="mx-3 text-rose">·</span>
            <span className="uppercase tracking-[0.18em]">Qualité</span>
            <span className="mx-3 text-rose">·</span>
            <span className="uppercase tracking-[0.18em]">Intemporalité</span>
          </p>
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
