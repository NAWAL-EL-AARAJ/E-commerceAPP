"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * Image avec repli élégant (dégradé blush) tant que le fichier n'a pas été
 * ajouté dans /public/images. Évite les images cassées pendant l'intégration.
 */
export default function Photo({
  className = "",
  alt,
  ...props
}: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !props.src) {
    return (
      <div
        aria-label={typeof alt === "string" ? alt : undefined}
        role="img"
        className={`flex items-center justify-center bg-gradient-to-br from-blush via-rose/40 to-sand ${
          props.fill ? "absolute inset-0 h-full w-full" : className
        }`}
      >
        <span className="font-display text-2xl italic text-espresso/25">
          MERHAS
        </span>
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
