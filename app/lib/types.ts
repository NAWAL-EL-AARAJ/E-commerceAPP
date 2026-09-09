export interface Produit {
  id: string;
  nom: string;
  description: string | null;
  prix: number;
  image_url: string | null;
  stock: number | null;
  categorie: string | null;
  couleurs?: string[] | string | null;
  created_at?: string;
}

export interface CartItem extends Produit {
  quantite: number;
}

export interface CommandeProduit {
  id?: string;
  nom: string;
  prix: number;
  quantite: number;
}

export interface Commande {
  id: string;
  nom_client: string;
  telephone: string;
  adresse: string;
  produits: CommandeProduit[];
  total: number;
  statut: "en attente" | "confirmée" | "livrée" | "annulée";
  created_at?: string;
}

export interface HeroSlide {
  eyebrow: string;
  titre: string;
  titreItalique: string;
  texte: string;
  image: string;
  /** Cadrage de l'image (CSS object-position), défaut "center". */
  position?: string;
  cta: { label: string; href: string };
}

export interface Feature {
  icon: "leaf" | "truck" | "heart" | "lock";
  titre: string;
  texte: string;
}

export interface NavLink {
  label: string;
  href: string;
}
