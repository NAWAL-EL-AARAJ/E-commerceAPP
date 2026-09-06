'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Admin() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [produits, setProduits] = useState([])
  const [commandes, setCommandes] = useState([])

  const [editingId, setEditingId] = useState(null)
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [prix, setPrix] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imageUrlActuelle, setImageUrlActuelle] = useState('')
  const [stock, setStock] = useState('')
  const [categorie, setCategorie] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) {
      fetchProduits()
      fetchCommandes()
    }
  }, [session])

  async function fetchProduits() {
    const { data, error } = await supabase.from('produits').select('*').order('created_at', { ascending: false })
    if (!error) setProduits(data)
  }

  async function fetchCommandes() {
    const { data, error } = await supabase.from('commandes').select('*').order('created_at', { ascending: false })
    if (!error) setCommandes(data)
  }

  async function updateStatut(id, statut) {
    const { error } = await supabase.from('commandes').update({ statut }).eq('id', id)
    if (error) { alert('Erreur : ' + error.message); return }
    fetchCommandes()
  }

  async function handleLogin(e) {
    e.preventDefault()
    setErrorMsg('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setErrorMsg('Email ou mot de passe incorrect')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  function resetForm() {
    setEditingId(null)
    setNom('')
    setDescription('')
    setPrix('')
    setImageFile(null)
    setImageUrlActuelle('')
    setStock('')
    setCategorie('')
  }

  function handleEdit(produit) {
    setEditingId(produit.id)
    setNom(produit.nom)
    setDescription(produit.description || '')
    setPrix(produit.prix)
    setImageFile(null)
    setImageUrlActuelle(produit.image_url || '')
    setStock(produit.stock)
    setCategorie(produit.categorie || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    let imageUrl = imageUrlActuelle

    if (imageFile) {
      setUploading(true)
      const fileName = `${Date.now()}-${imageFile.name}`
      const { error: uploadError } = await supabase.storage.from('produits').upload(fileName, imageFile)
      setUploading(false)

      if (uploadError) {
        alert('Erreur upload image : ' + uploadError.message)
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage.from('produits').getPublicUrl(fileName)
      imageUrl = urlData.publicUrl
    }

    const produitData = {
      nom, description, prix: parseFloat(prix), image_url: imageUrl,
      stock: parseInt(stock) || 0, categorie,
    }

    let error

    if (editingId) {
      ;({ error } = await supabase.from('produits').update(produitData).eq('id', editingId))
    } else {
      ;({ error } = await supabase.from('produits').insert(produitData))
    }

    setLoading(false)

    if (error) { alert('Erreur : ' + error.message); return }

    resetForm()
    fetchProduits()
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce produit ?')) return
    const { error } = await supabase.from('produits').delete().eq('id', id)
    if (error) { alert('Erreur : ' + error.message); return }
    fetchProduits()
  }

  if (!session) {
    return (
      <main className="max-w-sm mx-auto px-6 py-24">
        <h1 className="font-display text-2xl mb-6">Connexion admin</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-line px-3 py-2 focus:outline-none focus:border-majorelle"
            required
          />
          <input
            type="password" placeholder="Mot de passe" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-line px-3 py-2 focus:outline-none focus:border-majorelle"
            required
          />
          <button type="submit" className="bg-ink text-ivory py-2 hover:bg-majorelle transition-colors">
            Se connecter
          </button>
          {errorMsg && <p className="text-red-700 text-sm">{errorMsg}</p>}
        </form>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex justify-between items-baseline mb-10">
        <h1 className="font-display text-3xl">Dashboard</h1>
        <button onClick={handleLogout} className="text-sm text-ink/60 hover:text-ink">Se déconnecter</button>
      </div>

      <section className="border border-line p-6 mb-12">
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="font-display text-xl">
            {editingId ? 'Modifier le produit' : 'Ajouter un produit'}
          </h2>
          {editingId && (
            <button onClick={resetForm} className="text-sm text-ink/60 hover:text-ink">
              Annuler la modification
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text" placeholder="Nom du foulard" value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="border border-line px-3 py-2 focus:outline-none focus:border-majorelle"
            required
          />
          <textarea
            placeholder="Description" value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="border border-line px-3 py-2 focus:outline-none focus:border-majorelle"
          />
          <input
            type="number" placeholder="Prix (DH)" value={prix}
            onChange={(e) => setPrix(e.target.value)}
            className="border border-line px-3 py-2 focus:outline-none focus:border-majorelle"
            required
          />

          {imageUrlActuelle && !imageFile && (
            <div className="flex items-center gap-3">
              <img src={imageUrlActuelle} alt="actuelle" className="w-16 h-16 object-cover border border-line" />
              <span className="text-sm text-ink/60">Photo actuelle — choisis un fichier pour la remplacer</span>
            </div>
          )}

          <input
            type="file" accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="border border-line px-3 py-2"
          />
          <input
            type="number" placeholder="Stock" value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="border border-line px-3 py-2 focus:outline-none focus:border-majorelle"
          />
          <input
            type="text" placeholder="Catégorie (ex: Soie, Coton...)" value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            className="border border-line px-3 py-2 focus:outline-none focus:border-majorelle"
          />
          <button
            type="submit" disabled={loading}
            className="bg-ink text-ivory py-2 hover:bg-majorelle transition-colors disabled:opacity-50"
          >
            {uploading
              ? "Envoi de l'image..."
              : loading
              ? 'Enregistrement...'
              : editingId
              ? 'Enregistrer les modifications'
              : 'Ajouter le produit'}
          </button>
        </form>
      </section>

      <h2 className="font-display text-xl mb-4">Produits ({produits.length})</h2>
      <div className="divide-y divide-line mb-12">
        {produits.map((p) => (
          <div key={p.id} className="flex justify-between items-center py-3">
            <div>
              <span className="font-medium">{p.nom}</span>
              <span className="text-ink/60 text-sm"> — {p.prix} DH — Stock : {p.stock}</span>
            </div>
            <div className="flex gap-4">
              <button onClick={() => handleEdit(p)} className="text-sm text-majorelle hover:underline">
                Modifier
              </button>
              <button onClick={() => handleDelete(p.id)} className="text-sm text-red-700/70 hover:text-red-700">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-display text-xl mb-4">Commandes ({commandes.length})</h2>
      <div className="flex flex-col gap-4">
        {commandes.length === 0 && <p className="text-ink/50">Aucune commande pour le moment.</p>}
        {commandes.map((c) => (
          <div key={c.id} className="border border-line p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{c.nom_client} — {c.telephone}</p>
                <p className="text-ink/60 text-sm">{c.adresse}</p>
              </div>
              <select
                value={c.statut}
                onChange={(e) => updateStatut(c.id, e.target.value)}
                className="border border-line px-2 py-1 text-sm"
              >
                <option value="en attente">En attente</option>
                <option value="confirmée">Confirmée</option>
                <option value="livrée">Livrée</option>
                <option value="annulée">Annulée</option>
              </select>
            </div>
            <ul className="mt-3 text-sm text-ink/70 list-disc list-inside">
              {c.produits.map((p, i) => (
                <li key={i}>{p.nom} x{p.quantite} — {p.prix * p.quantite} DH</li>
              ))}
            </ul>
            <p className="mt-2 text-ochre font-medium">{c.total} DH</p>
          </div>
        ))}
      </div>
    </main>
  )
}