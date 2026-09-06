'use client'

import Link from 'next/link'
import { useCart } from '../context/CartContext'

export default function Panier() {
  const { cart, removeFromCart, updateQuantite, total } = useCart()

  if (cart.length === 0) {
    return (
      <main className="max-w-md mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl mb-4">Ton panier est vide</h1>
        <Link href="/" className="text-majorelle underline">Retour au catalogue</Link>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl mb-8">Mon panier</h1>

      <div className="divide-y divide-line">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center py-4">
            <div>
              <p className="font-medium">{item.nom}</p>
              <p className="text-ink/60 text-sm">{item.prix} DH</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => updateQuantite(item.id, item.quantite - 1)} className="w-7 h-7 border border-line hover:border-majorelle">-</button>
              <span>{item.quantite}</span>
              <button onClick={() => updateQuantite(item.id, item.quantite + 1)} className="w-7 h-7 border border-line hover:border-majorelle">+</button>
              <button onClick={() => removeFromCart(item.id)} className="ml-3 text-sm text-red-700/70 hover:text-red-700">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-baseline mt-8 pt-4 border-t border-line">
        <span className="text-ink/60">Total</span>
        <span className="font-display text-2xl text-ochre">{total} DH</span>
      </div>

      <Link
        href="/commande"
        className="block text-center mt-8 bg-ink text-ivory py-3 hover:bg-majorelle transition-colors"
      >
        Passer la commande
      </Link>
    </main>
  )
}