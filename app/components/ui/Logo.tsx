"use client";

import Image from "next/image";
import { useState } from "react";
import { LOGO } from "../../lib/content";

/**
 * Logo MERHAS, présenté dans une pastille ronde (fond crème). L'image est
 * contenue sans déformation quel que soit son ratio. Repli sur le monogramme
 * si le fichier est absent.
 */
export default function Logo({
  size = 46,
  priority = false,
  className = "",
}: {
  size?: number;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-cream ring-1 ring-espresso/10 ${className}`}
      style={{ width: size, height: size }}
    >
      {failed ? (
        <span
          className="font-display tracking-tight text-espresso"
          style={{ fontSize: Math.round(size * 0.42) }}
        >
          MH
        </span>
      ) : (
        <Image
          src={LOGO}
          alt="MERHAS"
          fill
          priority={priority}
          sizes={`${size}px`}
          className="scale-[1.08] object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
