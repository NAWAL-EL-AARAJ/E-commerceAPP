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

/** Un seul motif répété tout du long : une photo (format identique) et un
 * bloc de texte, en alternance gauche/droite. C'est ce qui rend la page
 * homogène plutôt qu'une suite de sections toutes différentes. */
function Rangee({
  image,
  alt,
  inverse = false,
  eyebrow,
  children,
}: {
  image: string;
  alt: string;
  inverse?: boolean;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-14 sm:py-20">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={inverse ? "lg:order-2" : ""}>
          <Photo
            src={image}
            alt={alt}
            width={900}
            height={1125}
            className="aspect-[4/5] w-full rounded-sm object-cover"
          />
        </div>
        <div className={inverse ? "lg:order-1" : ""}>
          <p className="eyebrow mb-4">{eyebrow}</p>
          {children}
        </div>
      </Container>
    </section>
  );
}

export default function AProposPage() {
  return (
    <>
      <section className="pb-6 pt-16 text-center sm:pt-24">
        <Container className="max-w-xl">
          <p className="eyebrow mb-5">L&apos;univers MERHAS</p>
          <h1 className="font-display text-4xl leading-tight text-espresso sm:text-5xl">
            Plus qu&apos;un foulard,{" "}
            <em className="italic font-normal">une touche d&apos;élégance.</em>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-taupe">
            L&apos;histoire de deux amies qui ont voulu créer un foulard à la
            hauteur de leur exigence : élégance, confort et qualité.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/boutique">Découvrir la boutique</ButtonLink>
          </div>
        </Container>
      </section>

      <Rangee image="/images/apropos/image1.png" alt="Cliente MERHAS" eyebrow="Notre histoire">
        <h2 className="font-display text-2xl leading-snug text-espresso sm:text-3xl">
          Maryam &amp; Hasnae,{" "}
          <em className="italic font-normal">une aventure à deux.</em>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-taupe">
          MERHAS est née de la rencontre de deux amies, réunies par une même
          passion : la mode, l&apos;élégance et le goût des belles choses. Le
          nom MERHAS est inspiré de leurs deux prénoms — il représente avant
          tout une aventure construite ensemble.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-taupe">
          Une idée simple, une ambition grande : créer un foulard qui associe
          élégance, confort et qualité, tout en offrant une expérience digne
          d&apos;un univers premium.
        </p>
      </Rangee>

      <Rangee
        image="/images/apropos/image3.png"
        alt="Foulards MERHAS pliés dans leur coffret"
        eyebrow="L'exigence de la qualité"
        inverse
      >
        <h2 className="font-display text-2xl leading-snug text-espresso sm:text-3xl">
          Le luxe dans <em className="italic font-normal">la simplicité.</em>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-taupe">
          Chaque détail compte : la sélection du tissu, le choix des
          couleurs — raffinées, harmonieuses et faciles à porter — jusqu&apos;à
          la présentation finale. Une expérience pensée du tissu jusqu&apos;à
          l&apos;emballage, pour qu&apos;un geste d&apos;élégance commence dès
          l&apos;ouverture du colis.
        </p>
      </Rangee>

      <Rangee
        image="/images/apropos/image4.png"
        alt="Coffret et pochette cadeau MERHAS"
        eyebrow="Notre vision"
      >
        <h2 className="font-display text-2xl italic leading-snug text-espresso sm:text-3xl">
          « Le luxe ne réside pas seulement dans l&apos;apparence, mais aussi
          dans la sensation et l&apos;attention portée aux détails. »
        </h2>
        <p className="mt-6 font-display text-lg text-espresso">
          MERHAS — Maryam &amp; Hasnae
        </p>
        <p className="mt-1 font-script text-2xl text-mauve">
          Deux amies, une vision, une marque.
        </p>
      </Rangee>

      <section className="border-t border-line py-16 sm:py-20">
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
