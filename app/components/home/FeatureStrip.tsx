import { FEATURES } from "../../lib/content";
import { FEATURE_ICONS } from "../icons";
import Container from "../ui/Container";

export default function FeatureStrip() {
  return (
    <section className="border-y border-line bg-blush/40">
      <Container>
        <ul className="grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
          {FEATURES.map((f, i) => {
            const Icon = FEATURE_ICONS[f.icon];
            return (
              <li
                key={f.titre}
                className={`flex flex-col items-center gap-2 px-4 py-9 text-center ${
                  i < 2 ? "border-b border-line lg:border-b-0" : ""
                }`}
              >
                <Icon width={26} height={26} className="text-rosewood" />
                <p className="font-display text-lg text-espresso">{f.titre}</p>
                <p className="text-xs text-taupe">{f.texte}</p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
