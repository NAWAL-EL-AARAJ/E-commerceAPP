"use client";

import { useRef, useState } from "react";
import { UNIVERS } from "../../lib/content";
import { ArrowRightIcon, PlayIcon } from "../icons";
import Container from "../ui/Container";
import Photo from "../ui/Photo";
import Link from "next/link";

export default function UniversMerhas() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function playVideo() {
    const v = videoRef.current;
    if (!v) return;
    v.play();
    setPlaying(true);
  }

  return (
    <section className="py-8">
      <Container>
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Texte + coffret */}
          <div className="relative overflow-hidden rounded-sm bg-blush/60">
            <Photo
              src={UNIVERS.imageBox}
              alt="Coffret MERHAS"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover opacity-40"
            />
            <div className="relative flex h-full flex-col justify-between gap-10 p-8">
              <div>
                <p className="eyebrow mb-4">{UNIVERS.eyebrow}</p>
                <h2 className="font-display text-3xl leading-tight text-espresso">
                  {UNIVERS.titre}{" "}
                  <em className="italic">{UNIVERS.titreItalique}</em>
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-taupe">
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

          {/* Vidéo */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sand lg:aspect-auto">
            <video
              ref={videoRef}
              poster={UNIVERS.videoPoster}
              controls={playing}
              playsInline
              preload="none"
              className="h-full w-full object-cover"
            >
              <source src={UNIVERS.video} type="video/mp4" />
            </video>
            {!playing && (
              <button
                onClick={playVideo}
                aria-label="Lire la vidéo"
                className="absolute inset-0 flex items-center justify-center bg-espresso/10 transition-colors hover:bg-espresso/20"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream/90 text-espresso">
                  <PlayIcon width={26} height={26} />
                </span>
              </button>
            )}
          </div>

          {/* Accent manuscrit */}
          <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-sm bg-blush lg:aspect-auto">
            <Photo
              src={UNIVERS.imageScript}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover opacity-60"
            />
            <p className="relative max-w-[14rem] text-center font-script text-3xl leading-tight text-espresso">
              {UNIVERS.script} <span className="text-rosewood">&#9825;</span>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
