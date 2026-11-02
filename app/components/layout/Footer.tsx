import Link from "next/link";
import { NAV_LINKS, SITE } from "../../lib/content";
import { InstagramIcon, TiktokIcon, WhatsappIcon } from "../icons";
import Logo from "../ui/Logo";

/** Bloc « Contactez-nous » : chaque réseau avec le nom exact du compte. */
const CONTACTS = [
  {
    label: "Instagram",
    nom: "@merhas.official",
    href: SITE.reseaux.instagram,
    Icon: InstagramIcon,
  },
  {
    label: "TikTok",
    nom: "@merhas.official",
    href: SITE.reseaux.tiktok,
    Icon: TiktokIcon,
  },
  {
    label: "WhatsApp",
    nom: SITE.telephone,
    href: SITE.reseaux.whatsapp,
    Icon: WhatsappIcon,
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-espresso text-cream/80">
      <div className="mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo size={76} />
          <p className="mt-4 max-w-xs text-sm text-cream/70">{SITE.baseline}</p>
        </div>

        <div>
          <p className="eyebrow !text-cream/50 mb-4">Contactez-nous</p>
          <ul className="space-y-3 text-sm">
            {CONTACTS.map(({ label, nom, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${label} : ${nom}`}
                  className="flex items-center gap-3 hover:text-cream"
                >
                  <Icon width={18} height={18} className="shrink-0" />
                  <span>{nom}</span>
                </a>
              </li>
            ))}
          </ul>
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
