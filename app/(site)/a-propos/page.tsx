import type { Metadata } from "next";
import { ButtonLink } from "../../components/ui/Button";
import Container from "../../components/ui/Container";
import Photo from "../../components/ui/Photo";

export const metadata: Metadata = {
  title: "À propos — MERHAS",
  description:
    "MERHAS, l'histoire de Maryam & Hasnae : deux amies, une vision, une marque de foulards haut de gamme.",
};

const VALEURS = ["Élégance", "Qualité", "Intemporalité"];

export default function AProposPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-xl text-center">
        <p className="eyebrow mb-5">Notre histoire</p>
        <h1 className="font-display text-4xl leading-tight text-espresso sm:text-5xl">
          Maryam &amp; Hasnae,{" "}
          <em className="italic font-normal">une aventure à deux.</em>
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-taupe">
          MERHAS est née de deux amies réunies par une même passion : la mode
          et le goût des belles choses. Le nom vient de leurs deux prénoms.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-taupe">
          Leur idée : un foulard élégant, confortable et de qualité, avec une
          attention portée à chaque détail, du tissu jusqu&apos;à
          l&apos;emballage.
        </p>

        <Photo
          src="/images/apropos/image3.png"
          alt="Foulards MERHAS pliés dans leur coffret"
          width={360}
          height={478}
          className="mx-auto mt-12 w-full max-w-[280px] rounded-sm object-cover shadow-sm sm:max-w-xs"
        />

        <p className="mt-10 font-script text-2xl leading-snug text-mauve sm:text-3xl">
          Deux amies, une vision, une marque.
        </p>

        <ul className="mt-10 flex flex-wrap justify-center gap-2">
          {VALEURS.map((v) => (
            <li
              key={v}
              className="rounded-full border border-rose/50 bg-blush/50 px-4 py-2 text-[0.68rem] uppercase tracking-[0.16em] text-espresso"
            >
              {v}
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <ButtonLink href="/boutique">Découvrir la boutique</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
