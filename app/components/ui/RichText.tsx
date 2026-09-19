import sanitizeHtml from "sanitize-html";

/** Ce que l'éditeur admin peut produire — rien d'autre n'est autorisé. */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "h3",
    "ul",
    "ol",
    "li",
    "span",
    "div",
  ],
  allowedAttributes: {
    "*": ["style"],
  },
  allowedStyles: {
    "*": {
      color: [
        /^#[0-9a-f]{3,8}$/i,
        /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/i,
      ],
    },
  },
  // <b>/<i> deviennent strong/em pour un rendu homogène
  transformTags: { b: "strong", i: "em" },
};

const ressembleAHtml = (texte: string) => /<\/?[a-z][\s\S]*>/i.test(texte);

/** Vrai si la description ne contient aucun texte visible. */
export function descriptionVide(html: string | null | undefined): boolean {
  if (!html) return true;
  return (
    sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
      .replace(/&nbsp;/g, " ")
      .trim() === ""
  );
}

/**
 * Affiche une description. Gère les anciennes descriptions en texte simple
 * (sans balises) comme les nouvelles en texte enrichi, et nettoie toujours
 * le HTML avant affichage.
 */
export default function RichText({
  html,
  className = "",
}: {
  html: string | null | undefined;
  className?: string;
}) {
  if (descriptionVide(html)) return null;
  const contenu = html as string;

  if (!ressembleAHtml(contenu)) {
    return (
      <p className={`rich-text whitespace-pre-line ${className}`}>{contenu}</p>
    );
  }

  return (
    <div
      className={`rich-text ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(contenu, OPTIONS) }}
    />
  );
}
