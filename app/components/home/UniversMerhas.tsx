import Link from "next/link";
import { UNIVERS } from "../../lib/content";
import { ArrowRightIcon } from "../icons";
import Container from "../ui/Container";
import Photo from "../ui/Photo";

export default function UniversMerhas() {
  return (
    <section className="py-8">
      <Container>
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Texte + coffret */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-blush/60 sm:aspect-[16/10] lg:aspect-[4/5]">
            <Photo
              src={UNIVERS.imageBox}
              alt="Coffret MERHAS"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover opacity-55"
            />
            <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
              {/* Carte pleine (fond crème), posée sur la photo : garantit
                  un texte lisible quel que soit ce qu'il y a derrière. */}
              <div className="max-w-xs rounded-sm bg-cream/95 p-5 shadow-[0_4px_20px_rgba(59,48,43,0.08)] sm:p-6">
                <p className="eyebrow mb-3">{UNIVERS.eyebrow}</p>
                <h2 className="font-display text-2xl leading-tight text-espresso sm:text-3xl">
                  {UNIVERS.titre}{" "}
                  <em className="italic">{UNIVERS.titreItalique}</em>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-taupe">
                  {UNIVERS.texte}
                </p>
                <Link
                  href={UNIVERS.cta.href}
                  className="mt-5 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-espresso hover:text-rosewood"
                >
                  {UNIVERS.cta.label}
                  <ArrowRightIcon width={15} height={15} />
                </Link>
              </div>
            </div>
          </div>

          {/* Accent manuscrit */}
          <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-sm bg-blush sm:aspect-[16/10] lg:aspect-[4/5]">
            <Photo
              src={UNIVERS.imageScript}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover opacity-60"
            />
            <div className="relative mx-6 max-w-[16rem] rounded-sm bg-cream/95 px-6 py-8 text-center shadow-[0_4px_20px_rgba(59,48,43,0.08)]">
              <p className="font-script text-3xl leading-tight text-espresso">
                {UNIVERS.script}{" "}
                <span className="text-rosewood">&#9825;</span>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
