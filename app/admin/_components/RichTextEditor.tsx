"use client";

import { useEffect, useRef } from "react";

/** Couleurs proposées : celles de la charte MERHAS, lisibles sur fond clair. */
const COULEURS = [
  { nom: "Marron (par défaut)", hex: "#3b302b" },
  { nom: "Rosewood", hex: "#a25e56" },
  { nom: "Mauve", hex: "#a9808a" },
  { nom: "Taupe", hex: "#8b7a6e" },
  { nom: "Vert", hex: "#5b7a55" },
  { nom: "Noir", hex: "#000000" },
];

const echapper = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Ancienne description en texte simple → paragraphes HTML. */
function versHtml(valeur: string): string {
  if (!valeur) return "";
  if (/<\/?[a-z][\s\S]*>/i.test(valeur)) return valeur;
  return valeur
    .split(/\n{2,}|\n/)
    .filter((l) => l.trim())
    .map((l) => `<p>${echapper(l)}</p>`)
    .join("");
}

function BoutonOutil({
  label,
  title,
  onClick,
  children,
}: {
  label: string;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={label}
      // mouseDown + preventDefault : garde la sélection dans l'éditeur
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm text-espresso transition-colors hover:bg-cream"
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Valeur initiale posée une seule fois (l'éditeur reste ensuite non contrôlé,
  // sinon le curseur saute à chaque frappe).
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = versHtml(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function emettre() {
    const el = ref.current;
    if (!el) return;
    const texte = el.textContent?.trim() ?? "";
    onChange(texte === "" && !el.querySelector("li") ? "" : el.innerHTML);
  }

  function exec(commande: string, argument?: string) {
    ref.current?.focus();
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand(commande, false, argument);
    emettre();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white transition-colors focus-within:border-rosewood focus-within:ring-2 focus-within:ring-rosewood/15">
      <div className="flex flex-wrap items-center gap-1 border-b border-line bg-cream/50 px-2 py-1.5">
        <BoutonOutil label="Gras" title="Gras" onClick={() => exec("bold")}>
          <strong>G</strong>
        </BoutonOutil>
        <BoutonOutil
          label="Italique"
          title="Italique"
          onClick={() => exec("italic")}
        >
          <em>I</em>
        </BoutonOutil>
        <BoutonOutil
          label="Souligné"
          title="Souligné"
          onClick={() => exec("underline")}
        >
          <span className="underline">S</span>
        </BoutonOutil>

        <span className="mx-1 h-5 w-px bg-line" />

        <BoutonOutil
          label="Titre de section"
          title="Titre de section"
          onClick={() => exec("formatBlock", "<h3>")}
        >
          <span className="font-display text-base">Titre</span>
        </BoutonOutil>
        <BoutonOutil
          label="Texte normal"
          title="Texte normal"
          onClick={() => exec("formatBlock", "<p>")}
        >
          Texte
        </BoutonOutil>
        <BoutonOutil
          label="Liste à puces"
          title="Liste à puces"
          onClick={() => exec("insertUnorderedList")}
        >
          • Liste
        </BoutonOutil>

        <span className="mx-1 h-5 w-px bg-line" />

        <div className="flex items-center gap-1.5 px-1" role="group" aria-label="Couleur du texte">
          {COULEURS.map((c) => (
            <button
              key={c.hex}
              type="button"
              title={c.nom}
              aria-label={`Couleur ${c.nom}`}
              onMouseDown={(e) => {
                e.preventDefault();
                exec("foreColor", c.hex);
              }}
              className="h-5 w-5 rounded-full ring-1 ring-espresso/15 transition-transform hover:scale-110"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>

        <span className="mx-1 h-5 w-px bg-line" />

        <BoutonOutil
          label="Effacer la mise en forme"
          title="Effacer la mise en forme"
          onClick={() => exec("removeFormat")}
        >
          <span className="text-xs text-taupe">Effacer</span>
        </BoutonOutil>
      </div>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Description du produit"
        data-placeholder="Décris le foulard : matière, toucher, entretien…"
        onInput={emettre}
        onBlur={emettre}
        onPaste={(e) => {
          // Colle en texte brut : évite d'importer la mise en forme d'un site/Word
          e.preventDefault();
          const texte = e.clipboardData.getData("text/plain");
          document.execCommand("insertText", false, texte);
        }}
        className="rich-text rich-editor min-h-[9rem] px-4 py-3 outline-none"
      />
    </div>
  );
}
