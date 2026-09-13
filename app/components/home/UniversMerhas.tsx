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
              className="object-cover opacity-40"
            />
            <div className="relative flex h-full flex-col justify-between gap-10 p-8">
              <div>
                <p className="eyebrow mb-4">{UNIVERS.eyebrow}</p>
                <h2 className="font-display text-3xl leading-tight text-espresso">
                  {UNIVERS.titre}{" "}
                  <em className="italic">{UNIVERS.titreItalique}</em>
                </h2>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-taupe">
                  {UNIVERS.texte}
                </p>
              </div>
              <Link
                href={UNIVERS.cta.href}
                className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-espresso hover:text-rosewood"
              >
                {UNIVERS.cta.label}
                <ArrowRightIcon width={15} height={15} />
              </Link>
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
            <p className="relative max-w-[16rem] text-center font-script text-3xl leading-tight text-espresso">
              {UNIVERS.script} <span className="text-rosewood">&#9825;</span>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
