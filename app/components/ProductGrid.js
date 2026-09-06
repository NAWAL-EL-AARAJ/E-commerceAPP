'use client'

import { useCart } from '../context/CartContext'

export default function ProductGrid({ produits }) {
  const { addToCart } = useCart()

  if (!produits || produits.length === 0) {
    return <p className="text-ink/50">Aucun produit pour le moment.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 divide-line">
      {produits.map((produit) => (
        <div key={produit.id} className="pb-8 sm:pb-0 sm:pr-8">
          <img
            src={produit.image_url || 'https://via.placeholder.com/400'}
            alt={produit.nom}
            className="w-full aspect-square object-cover border border-line"
          />
          <div className="mt-4">
            {produit.categorie && (
              <p className="text-xs text-ink/50 mb-1">{produit.categorie}</p>
            )}
            <h3 className="font-display text-xl">{produit.nom}</h3>
            <p className="text-ink/60 text-sm mt-1">{produit.description}</p>
            <p className="text-ochre font-medium mt-2">{produit.prix} DH</p>
            <button
              onClick={() => addToCart(produit)}
              className="mt-3 w-full border border-majorelle text-majorelle py-2 text-sm hover:bg-majorelle hover:text-white transition-colors"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}