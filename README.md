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
```
merhas-site/
├── app/
│   ├── page.js               # Page catalogue (accueil)
│   ├── layout.js             # Layout global (polices, panier)
│   ├── globals.css           # Design tokens (couleurs, typographie)
│   ├── admin/
│   │   └── page.js           # Dashboard admin (produits + commandes)
│   ├── panier/
│   │   └── page.js           # Page panier
│   ├── commande/
│   │   └── page.js           # Page commande
│   ├── components/
│   │   ├── ProductGrid.js    # Grille de produits
│   │   └── CartButton.js     # Bouton panier
│   ├── context/
│   │   └── CartContext.js    # Gestion du panier (React Context)
│   └── lib/
│       └── supabase.js       # Connexion au client Supabase
└── .env.local                # Variables d'environnement (non versionné)
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
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_publique_supabase
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
