'use client'

import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'

export default function Commande() {
  const { cart, total, clearCart } = useCart()

  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [adresse, setAdresse] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirme, setConfirme] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('commandes').insert({
      nom_client: nom,
      telephone,
      adresse,
      produits: cart,
      total,
      statut: 'en attente',
    })

    setLoading(false)

    if (error) {
      alert('Erreur : ' + error.message)
      return
    }

    clearCart()
    setConfirme(true)
  }

  if (confirme) {
    return (
      <main className="max-w-md mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl mb-3">Merci !</h1>
        <p className="text-ink/60">Ta commande a bien été reçue. On te contactera bientôt au {telephone}.</p>
      </main>
    )
  }

  if (cart.length === 0) {
    return (
      <main className="max-w-md mx-auto px-6 py-24 text-center text-ink/60">
        Ton panier est vide.
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto px-6 py-12">
      <h1 className="font-display text-3xl mb-2">Finaliser la commande</h1>
      <p className="text-ochre font-medium mb-8">{total} DH</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Nom complet"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="border border-line px-3 py-2 focus:outline-none focus:border-majorelle"
          required
        />
        <input
          type="tel"
          placeholder="Téléphone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          className="border border-line px-3 py-2 focus:outline-none focus:border-majorelle"
          required
        />
        <textarea
          placeholder="Adresse de livraison"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          rows={3}
          className="border border-line px-3 py-2 focus:outline-none focus:border-majorelle"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-ink text-ivory py-3 mt-2 hover:bg-majorelle transition-colors disabled:opacity-50"
        >
          {loading ? 'Envoi...' : 'Confirmer la commande'}
        </button>
      </form>
    </main>
  )
}