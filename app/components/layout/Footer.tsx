"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS, NEWSLETTER, SITE } from "../../lib/content";
import { InstagramIcon, PinterestIcon, TiktokIcon } from "../icons";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [envoye, setEnvoye] = useState(false);

  return (
    <footer className="mt-24">
      {/* Bandeau newsletter */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${NEWSLETTER.background})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-mauve/85 via-rosewood/80 to-espresso/80" />
        <div className="relative mx-auto flex w-full max-w-[1180px] flex-col gap-8 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-cream">
            <div className="flex items-center gap-2">
              <span className="text-lg leading-none">&#10047;</span>
              <span className="font-display text-2xl tracking-[0.3em]">
                {SITE.nom}
              </span>
            </div>
            <p className="mt-2 max-w-md text-sm text-cream/85">
              <span className="font-display text-lg italic">
                {NEWSLETTER.titre}.
              </span>{" "}
              {NEWSLETTER.texte}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setEnvoye(true);
            }}
            className="flex w-full max-w-md items-center gap-2"
          >
            {envoye ? (
              <p className="text-sm text-cream">Merci, à très vite ✦</p>
            ) : (
              <>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ton adresse e-mail"
                  className="h-11 flex-1 rounded-full border border-cream/40 bg-cream/10 px-5 text-sm text-cream placeholder:text-cream/60 focus:border-cream focus:outline-none"
                />
                <button
                  type="submit"
                  className="h-11 rounded-full bg-cream px-6 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-espresso transition-colors hover:bg-cream/90"
                >
                  S&apos;inscrire
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Liens */}
      <div className="bg-espresso text-cream/80">
        <div className="mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <span className="font-display text-xl tracking-[0.3em] text-cream">
              {SITE.nom}
            </span>
            <p className="mt-3 max-w-xs text-sm text-cream/70">
              {SITE.baseline}
            </p>
            <div className="mt-5 flex gap-4">
              <a href={SITE.reseaux.instagram} aria-label="Instagram" target="_blank" rel="noreferrer" className="hover:text-cream">
                <InstagramIcon />
              </a>
              <a href={SITE.reseaux.tiktok} aria-label="TikTok" target="_blank" rel="noreferrer" className="hover:text-cream">
                <TiktokIcon />
              </a>
              <a href={SITE.reseaux.pinterest} aria-label="Pinterest" target="_blank" rel="noreferrer" className="hover:text-cream">
                <PinterestIcon />
              </a>
            </div>
          </div>

          <div>
            <p className="eyebrow !text-cream/50 mb-4">Navigation</p>
            <ul className="space-y-2 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-cream">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/favoris" className="hover:text-cream">
                  Favoris
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow !text-cream/50 mb-4">Contact</p>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>{SITE.ville}</li>
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-cream">
                  {SITE.email}
                </a>
              </li>
              <li>{SITE.telephone}</li>
              <li>{SITE.horaires}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-cream/10">
          <div className="mx-auto w-full max-w-[1180px] px-5 py-5 text-xs text-cream/50 sm:px-8">
            © {new Date().getFullYear()} {SITE.nom}. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
}
