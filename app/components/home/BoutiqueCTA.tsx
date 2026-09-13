import { ButtonLink } from "../ui/Button";
import Container from "../ui/Container";

export default function BoutiqueCTA() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="rounded-sm bg-blush/50 px-6 py-16 text-center sm:py-20">
          <p className="eyebrow mb-4">La collection</p>
          <h2 className="font-display text-4xl leading-tight text-espresso sm:text-5xl">
            Découvre <em className="italic font-normal">tous nos foulards</em>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-taupe">
            Une palette de teintes pensée pour chaque style, à explorer sans
            attendre.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/boutique" size="lg">
              Voir la boutique
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
