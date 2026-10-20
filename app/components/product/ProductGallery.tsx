"use client";

import { useState } from "react";
import { PLACEHOLDER_PRODUIT } from "../../lib/content";
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

  return (
    <div>
      <div className="overflow-hidden rounded-sm bg-sand">
        <Photo
          src={photos[actif]}
          alt={alt}
          width={900}
          height={1080}
          priority
          className="aspect-[5/6] w-full object-cover"
        />
      </div>

      {photos.length > 1 && (
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
