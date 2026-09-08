import type { Metadata } from "next";
import Container from "../../components/ui/Container";
import { SITE } from "../../lib/content";
import {
  InstagramIcon,
  PinterestIcon,
  TiktokIcon,
} from "../../components/icons";

export const metadata: Metadata = {
  title: "Contact — MERHAS",
  description: "Contacter MERHAS : e-mail, téléphone et réseaux sociaux.",
};

const waLink = `https://wa.me/${SITE.whatsapp.replace(/[^0-9]/g, "")}`;

export default function ContactPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid gap-14 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-5">Nous écrire</p>
          <h1 className="font-display text-4xl leading-tight text-espresso sm:text-5xl">
            Une question ?{" "}
            <em className="italic font-normal">Parlons-en.</em>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-taupe">
            Pour toute demande sur une commande, une couleur ou une
            collaboration, l&apos;équipe MERHAS te répond avec plaisir.
          </p>

          <dl className="mt-10 space-y-6 text-sm">
            <div>
              <dt className="eyebrow mb-1">E-mail</dt>
              <dd>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-espresso hover:text-rosewood"
                >
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-1">Téléphone / WhatsApp</dt>
              <dd>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-espresso hover:text-rosewood"
                >
                  {SITE.telephone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-1">Horaires</dt>
              <dd className="text-taupe">{SITE.horaires}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-1">Adresse</dt>
              <dd className="text-taupe">{SITE.ville}</dd>
            </div>
          </dl>

          <div className="mt-10 flex gap-4">
            <a
              href={SITE.reseaux.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-espresso transition-colors hover:border-espresso hover:bg-espresso hover:text-cream"
            >
              <InstagramIcon />
            </a>
            <a
              href={SITE.reseaux.tiktok}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-espresso transition-colors hover:border-espresso hover:bg-espresso hover:text-cream"
            >
              <TiktokIcon />
            </a>
            <a
              href={SITE.reseaux.pinterest}
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-espresso transition-colors hover:border-espresso hover:bg-espresso hover:text-cream"
            >
              <PinterestIcon />
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-sm border border-line">
          <iframe
            title="Carte MERHAS"
            src="https://www.google.com/maps?q=Casablanca&output=embed"
            className="h-full min-h-[380px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Container>
    </section>
  );
}
