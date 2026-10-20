import type { Feature, HeroSlide, NavLink } from "./types";

/** Devise affichée partout (site + admin). Changer ici pour tout basculer. */
export const DEVISE = "DH";

export const prixFormate = (prix: number | null | undefined) =>
  `${Number(prix ?? 0).toLocaleString("fr-FR")} ${DEVISE}`;

/** Vrai si un ancien prix doit s'afficher barré (promotion en cours). */
export const enPromo = (
  prix: number,
  ancienPrix: number | null | undefined,
) => Boolean(ancienPrix) && (ancienPrix as number) > prix;

export const pourcentagePromo = (prix: number, ancienPrix: number) =>
  Math.round((1 - prix / ancienPrix) * 100);

export const NAV_LINKS: NavLink[] = [
  { label: "Accueil", href: "/" },
  { label: "Boutique", href: "/boutique" },
  { label: "À propos", href: "/a-propos" },
];

export const LOGO = "/images/logo-merhas.png";

export const SITE = {
  nom: "MERHAS",
  baseline: "More than just a scarf.",
  email: "contact@merhas.ma",
  telephone: "+212 7 08 74 21 20",
  whatsapp: "+212708742120",
  ville: "Casablanca, Maroc",
  horaires: "Du lundi au samedi · 9h – 19h",
  reseaux: {
    instagram: "https://www.instagram.com/merhas.official",
    tiktok: "https://www.tiktok.com/@merhas.official",
    pinterest: "https://pinterest.com/merhas",
    whatsapp: "https://wa.me/212708742120",
  },
};

export const PRODUIT_PHARE = {
  eyebrow: "Notre produit phare",
  nom: "Jersey Liquide",
  titreItalique: "Jersey Liquide",
  texte:
    "Un foulard fluide, léger et élégant, pensé pour accompagner ton quotidien.",
  cta: { label: "Voir toutes les couleurs", href: "/boutique" },
  paletteTexte: "Une palette de couleurs pour chaque style.",
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    eyebrow: "MERHAS",
    titre: "Élégance",
    titreItalique: "en toute simplicité",
    texte:
      "Des foulards pensés pour sublimer chaque moment de ta vie, avec style et modestie.",
    image: "/images/hero/hero-1.jpg",
    position: "right",
    cta: { label: "Découvrir la boutique", href: "/boutique" },
  },
  {
    eyebrow: "Fait avec soin",
    titre: "Une palette",
    titreItalique: "pour chaque couleur",
    texte:
      "Du blanc poudré au chocolat profond, trouve la teinte qui te ressemble.",
    image: "/images/hero/hero-2.jpg",
    position: "right",
    cta: { label: "Toutes les couleurs", href: "/boutique" },
  },
];

export const FEATURES: Feature[] = [
  {
    icon: "leaf",
    titre: "Qualité premium",
    texte: "Des matières sélectionnées avec soin.",
  },
  {
    icon: "truck",
    titre: "Livraison partout au Maroc",
    texte: "Rapide et sécurisée.",
  },
  {
    icon: "heart",
    titre: "Satisfaction garantie",
    texte: "Votre confiance, notre priorité.",
  },
  {
    icon: "lock",
    titre: "Paiement sécurisé",
    texte: "En toute sérénité.",
  },
];


export const UNIVERS = {
  eyebrow: "L'univers MERHAS",
  titre: "Plus qu'un foulard,",
  titreItalique: "une touche d'élégance.",
  texte:
    "Chez MERHAS, chaque pièce est pensée pour révéler ta beauté naturelle, avec simplicité et raffinement.",
  cta: { label: "En savoir plus", href: "/a-propos" },
  imageBox: "/images/apropos/image4.png",
  imageScript: "/images/apropos/image3.png",
  script: "Plus qu'un foulard, une touche d'élégance",
};

/** Correspondance nom de couleur → code hex, pour les pastilles produit. */
export const COULEUR_HEX: Record<string, string> = {
  blanc: "#f3ece1",
  ivoire: "#f0e6d4",
  crème: "#ece0c9",
  creme: "#ece0c9",
  beige: "#dcc6a8",
  sable: "#d8c3a3",
  nude: "#d9bfa8",
  "rose poudré": "#e0c0b8",
  "rose poudre": "#e0c0b8",
  rose: "#d3a7a0",
  "vieux rose": "#c99a94",
  blush: "#e3c4bd",
  taupe: "#a68d7d",
  mauve: "#a9808a",
  prune: "#7c5866",
  bordeaux: "#7a3b40",
  chocolat: "#5b4038",
  "marron glacé": "#6f5347",
  noir: "#2b2420",
  camel: "#c19a6b",
  moutarde: "#c9a227",
  kaki: "#7c7a5a",
  gris: "#b4ada4",
  bleu: "#8a9bb0",
  vert: "#8a9b86",
};

export const couleurVersHex = (nom: string): string =>
  COULEUR_HEX[nom.trim().toLowerCase()] ?? "#d8b4a8";

export const PLACEHOLDER_PRODUIT = "/images/placeholder-produit.jpg";
