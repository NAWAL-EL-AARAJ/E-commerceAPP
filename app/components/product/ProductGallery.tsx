"use client";

import { useState } from "react";
import { PLACEHOLDER_PRODUIT } from "../../lib/content";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";
import Photo from "../ui/Photo";

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const photos = images.length > 0 ? images : [PLACEHOLDER_PRODUIT];
  const [actif, setActif] = useState(0);
  const plusieurs = photos.length > 1;

  function aller(delta: number) {
    setActif((i) => (i + delta + photos.length) % photos.length);
  }

  return (
    <div>
      <div className="group relative overflow-hidden rounded-sm bg-sand">
        <Photo
          src={photos[actif]}
          alt={alt}
          width={900}
          height={1080}
          priority
          className="aspect-[5/6] w-full object-cover"
        />

        {plusieurs && (
          <>
            <button
              type="button"
              onClick={() => aller(-1)}
              aria-label="Photo précédente"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream/85 text-espresso shadow-sm transition-colors hover:bg-cream"
            >
              <ChevronLeftIcon width={18} height={18} />
            </button>
            <button
              type="button"
              onClick={() => aller(1)}
              aria-label="Photo suivante"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream/85 text-espresso shadow-sm transition-colors hover:bg-cream"
            >
              <ChevronRightIcon width={18} height={18} />
            </button>

            <span className="absolute bottom-3 right-3 rounded-full bg-espresso/70 px-2.5 py-1 text-[0.65rem] text-cream">
              {actif + 1} / {photos.length}
            </span>
          </>
        )}
      </div>

      {plusieurs && (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {photos.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActif(i)}
              aria-label={`Photo ${i + 1}`}
              aria-current={i === actif}
              className={`overflow-hidden rounded-sm ring-1 transition-opacity ${
                i === actif
                  ? "ring-2 ring-rosewood"
                  : "ring-line opacity-70 hover:opacity-100"
              }`}
            >
              <Photo
                src={src}
                alt=""
                width={160}
                height={192}
                className="aspect-[5/6] w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
