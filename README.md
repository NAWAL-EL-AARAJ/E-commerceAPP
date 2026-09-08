# MERHAS — Site web de vente de foulards

[![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black?logo=vercel)](https://VOTRE-LIEN-VERCEL.vercel.app)

Site e-commerce pour MERHAS, avec catalogue public (sans compte requis) et espace admin pour la gestion des produits et des commandes.

## Démo en ligne

🔗 **e-commerce-app-theta-azure.vercel.app**

## Fonctionnalités

### Côté client (public)
- Catalogue des foulards avec photos, prix et description
- Panier (ajout, modification des quantités, suppression) — sauvegardé dans le navigateur
- Commande sans création de compte (formulaire nom / téléphone / adresse)

### Côté admin
- Connexion sécurisée (email / mot de passe)
- Ajout, modification et suppression de produits
- Upload de photos directement depuis l'ordinateur
- Suivi des commandes reçues avec changement de statut (en attente, confirmée, livrée, annulée)

## Stack technique
- **Framework** : [Next.js](https://nextjs.org/) (App Router)
- **Base de données & authentification** : [Supabase](https://supabase.com/)
- **Stockage des images** : Supabase Storage
- **Style** : Tailwind CSS
- **Hébergement** : [Vercel](https://vercel.com/)

## Structure du projet
Le code est en **TypeScript** (App Router, Tailwind v4).

```
merhas-site/
├── app/
│   ├── layout.tsx              # Layout racine (polices, providers panier + favoris)
│   ├── globals.css             # Design tokens MERHAS (palette, typographie)
│   ├── (site)/                 # Site public (header + footer communs)
│   │   ├── layout.tsx          # Header / Footer
│   │   ├── page.tsx            # Accueil (Hero, best-sellers, univers…)
│   │   ├── boutique/           # Catalogue + fiche produit [id]
│   │   ├── a-propos/ contact/ favoris/ panier/ commande/
│   ├── admin/
│   │   ├── page.tsx            # Dashboard admin (produits + commandes + profil)
│   │   └── _components/        # theme, LoginCard, modales produit
│   ├── components/
│   │   ├── layout/  (Header, Footer, MobileMenu)
│   │   ├── home/    (Hero, FeatureStrip, ProduitPhare, UniversMerhas, BestSellers)
│   │   ├── product/ (ProductCard, ProductGrid, ColorSwatches, AddToCartButton)
│   │   ├── ui/      (Container, Button, SectionHeading, Photo)
│   │   └── icons/   (jeu d'icônes SVG inline)
│   ├── context/
│   │   ├── CartContext.tsx     # Panier (localStorage)
│   │   └── WishlistContext.tsx # Favoris (localStorage)
│   └── lib/
│       ├── supabase.ts         # Client Supabase
│       ├── types.ts            # Types (Produit, Commande…)
│       └── content.ts          # Contenu statique (nav, hero, features, devise…)
├── public/images/              # Visuels du site — voir public/images/README.md
└── .env.local                  # Variables d'environnement (non versionné)
```

## Installation en local
1. Cloner le dépôt :
   ```bash
   git clone https://github.com/NAWAL-EL-AARAJ/E-commerceAPP.git
   cd E-commerceAPP
   ```
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Créer un fichier `.env.local` à la racine avec les clés Supabase :
   ```
NEXT_PUBLIC_SUPABASE_URL=https://nevanxhdyuxdtejuhztf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_yX10p6yNFlyZc0QoYMHG8w_VGxbDhaJ
   ```
4. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```
5. Ouvrir [http://localhost:3000](http://localhost:3000)

## Base de données
Le projet utilise deux tables principales dans Supabase :
- **produits** : nom, description, prix, image_url, stock, catégorie
- **commandes** : nom_client, téléphone, adresse, produits (JSON), total, statut

La sécurité est gérée via Row Level Security (RLS) : lecture publique du catalogue, écriture réservée aux utilisateurs authentifiés (admin).

## Auteure
Nawal El Aaraj — projet développé pour MERHAS.
