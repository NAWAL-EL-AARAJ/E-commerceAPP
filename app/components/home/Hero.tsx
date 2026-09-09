"use client";

import { useCallback, useEffect, useState } from "react";
import { HERO_SLIDES } from "../../lib/content";
import { ButtonLink } from "../ui/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";
import Photo from "../ui/Photo";

const AUTOPLAY = 6000;

export default function Hero() {
  const [index, setIndex] = useState(0);
  const count = HERO_SLIDES.length;

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  useEffect(() => {
    const t = setInterval(() => go(1), AUTOPLAY);
    return () => clearInterval(t);
  }, [go]);

  return (
    <section className="relative">
      <div className="relative h-[62vh] min-h-[440px] overflow-hidden lg:h-[76vh]">
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Photo
              src={slide.image}
              alt={slide.titre}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: slide.position ?? "center" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-cream/90 via-cream/55 to-cream/10" />
          </div>
        ))}

        <div className="relative mx-auto flex h-full w-full max-w-[1180px] items-center px-5 sm:px-8">
          <div key={index} className="animate-fade max-w-lg">
            <p className="eyebrow mb-5">{HERO_SLIDES[index].eyebrow}</p>
            <h1 className="font-display text-5xl leading-[1.05] text-espresso sm:text-6xl lg:text-7xl">
              {HERO_SLIDES[index].titre}
              <br />
              <em className="font-normal italic">
                {HERO_SLIDES[index].titreItalique}
              </em>
            </h1>
            <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-espresso/70">
              {HERO_SLIDES[index].texte}
            </p>
            <div className="mt-8">
              <ButtonLink href={HERO_SLIDES[index].cta.href} size="lg">
                {HERO_SLIDES[index].cta.label}
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* Contrôles */}
        <div className="absolute bottom-6 right-5 flex items-center gap-3 sm:right-8">
          <button
            onClick={() => go(-1)}
            aria-label="Précédent"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-espresso/20 text-espresso transition-colors hover:bg-espresso hover:text-cream"
          >
            <ChevronLeftIcon width={16} height={16} />
          </button>
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Aller au visuel ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-rosewood" : "w-1.5 bg-espresso/25"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Suivant"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-espresso/20 text-espresso transition-colors hover:bg-espresso hover:text-cream"
          >
            <ChevronRightIcon width={16} height={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
