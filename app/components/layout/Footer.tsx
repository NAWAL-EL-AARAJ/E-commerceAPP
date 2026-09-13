import Link from "next/link";
import { NAV_LINKS, SITE } from "../../lib/content";
import {
  InstagramIcon,
  PinterestIcon,
  TiktokIcon,
  WhatsappIcon,
} from "../icons";
import Logo from "../ui/Logo";

export default function Footer() {
  return (
    <footer className="mt-24 bg-espresso text-cream/80">
      <div className="mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1.5fr_1fr]">
        <div>
          <Logo size={76} />
          <p className="mt-4 max-w-xs text-sm text-cream/70">{SITE.baseline}</p>
          <div className="mt-5 flex gap-4">
            <a
              href={SITE.reseaux.instagram}
              aria-label="Instagram"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cream"
            >
              <InstagramIcon />
            </a>
            <a
              href={SITE.reseaux.tiktok}
              aria-label="TikTok"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cream"
            >
              <TiktokIcon />
            </a>
            <a
              href={SITE.reseaux.whatsapp}
              aria-label="WhatsApp"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cream"
            >
              <WhatsappIcon />
            </a>
            <a
              href={SITE.reseaux.pinterest}
              aria-label="Pinterest"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cream"
            >
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
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-5 text-xs text-cream/50 sm:px-8">
          © {new Date().getFullYear()} {SITE.nom}. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
