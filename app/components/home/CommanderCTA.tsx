import { ButtonLink } from "../ui/Button";
import Container from "../ui/Container";

export default function CommanderCTA() {
  return (
    <section className="bg-espresso py-20 sm:py-24">
      <Container className="text-center">
        <p className="eyebrow mb-4 !text-cream/60">Prête à craquer ?</p>
        <h2 className="font-display text-3xl leading-tight text-cream sm:text-4xl">
          Commande ton foulard{" "}
          <em className="italic font-normal">dès aujourd&apos;hui</em>
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-cream/70">
          Livraison partout au Maroc, paiement à la livraison.
        </p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/boutique" variant="invert" size="lg">
            Commander maintenant
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
