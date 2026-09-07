'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// ---- Système de design MERHAS ----
const colors = {
  bg: '#FAF7F1',
  surface: '#FFFFFF',
  ink: '#2B2420',
  inkMuted: '#8A7D6F',
  border: '#E7E0D3',
  plum: '#5B2333',
  plumDark: '#43192A',
  plumTint: '#F3E9EC',
  gold: '#B08D57',
  goldTint: '#F6EFE2',
  sage: '#4F6E4C',
  sageBg: '#E9F1E6',
  amber: '#96650C',
  amberBg: '#FBF0DA',
  rust: '#9A3B32',
  rustBg: '#F7E7E4',
}

const fontDisplay = "'Fraunces', Georgia, 'Times New Roman', serif"
const fontBody = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

const inputStyle = {
  padding: '11px 12px',
  border: `1px solid ${colors.border}`,
  borderRadius: '6px',
  fontFamily: fontBody,
  fontSize: '14px',
  color: colors.ink,
  background: colors.surface,
}

export default function Admin() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [produits, setProduits] = useState([])
  const [commandes, setCommandes] = useState([])

  // Champs du formulaire d'ajout
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [prix, setPrix] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [stock, setStock] = useState('')
  const [categorie, setCategorie] = useState('')
  const [loading, setLoading] = useState(false)

  // Affichage du formulaire d'ajout (masqué par défaut)
  const [afficherFormAjout, setAfficherFormAjout] = useState(false)

  // Onglets
  const [activeTab, setActiveTab] = useState('produits') // 'produits' | 'commandes'

  // Recherche & filtres
  const [rechercheProduit, setRechercheProduit] = useState('')
  const [rechercheCommande, setRechercheCommande] = useState('')
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')

  // Modale "Voir"
  const [produitVu, setProduitVu] = useState(null)

  // Modale "Modifier"
  const [produitEnEdition, setProduitEnEdition] = useState(null)
  const [editNom, setEditNom] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editPrix, setEditPrix] = useState('')
  const [editStock, setEditStock] = useState('')
  const [editCategorie, setEditCategorie] = useState('')
  const [editImageFile, setEditImageFile] = useState(null)
  const [editUploading, setEditUploading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  // Profil admin
  const [profilNom, setProfilNom] = useState('')
  const [profilPhotoUrl, setProfilPhotoUrl] = useState('')
  const [profilPhotoFile, setProfilPhotoFile] = useState(null)
  const [profilUploading, setProfilUploading] = useState(false)
  const [profilLoading, setProfilLoading] = useState(false)
  const [profilMsg, setProfilMsg] = useState('')
  const [nouveauMdp, setNouveauMdp] = useState('')
  const [confirmMdp, setConfirmMdp] = useState('')
  const [mdpLoading, setMdpLoading] = useState(false)
  const [mdpMsg, setMdpMsg] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        setProfilNom(session.user.user_metadata?.nom || '')
        setProfilPhotoUrl(session.user.user_metadata?.avatar_url || '')
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        setProfilNom(session.user.user_metadata?.nom || '')
        setProfilPhotoUrl(session.user.user_metadata?.avatar_url || '')
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) {
      fetchProduits()
      fetchCommandes()
    }
  }, [session])

  async function fetchProduits() {
    const { data, error } = await supabase
      .from('produits')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setProduits(data)
  }

  async function fetchCommandes() {
    const { data, error } = await supabase
      .from('commandes')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setCommandes(data)
  }

  async function updateStatut(id, statut) {
    const { error } = await supabase.from('commandes').update({ statut }).eq('id', id)
    if (error) {
      alert('Erreur : ' + error.message)
      return
    }
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

  async function handleUpdateProfil(e) {
    e.preventDefault()
    setProfilMsg('')
    setProfilLoading(true)

    let avatarUrl = profilPhotoUrl

    if (profilPhotoFile) {
      setProfilUploading(true)
      const fileName = `${session.user.id}-${Date.now()}-${profilPhotoFile.name}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, profilPhotoFile, { upsert: true })

      setProfilUploading(false)

      if (uploadError) {
        alert('Erreur upload photo : ' + uploadError.message)
        setProfilLoading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      avatarUrl = urlData.publicUrl
    }

    const { error } = await supabase.auth.updateUser({
      data: { nom: profilNom, avatar_url: avatarUrl },
    })

    setProfilLoading(false)

    if (error) {
      setProfilMsg('Erreur : ' + error.message)
      return
    }

    setProfilPhotoUrl(avatarUrl)
    setProfilPhotoFile(null)
    setProfilMsg('Profil mis à jour.')
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setMdpMsg('')

    if (nouveauMdp.length < 6) {
      setMdpMsg('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (nouveauMdp !== confirmMdp) {
      setMdpMsg('Les deux mots de passe ne correspondent pas.')
      return
    }

    setMdpLoading(true)
    const { error } = await supabase.auth.updateUser({ password: nouveauMdp })
    setMdpLoading(false)

    if (error) {
      setMdpMsg('Erreur : ' + error.message)
      return
    }

    setNouveauMdp('')
    setConfirmMdp('')
    setMdpMsg('Mot de passe mis à jour.')
  }

  function getInitiales(nom, email) {
    if (nom && nom.trim()) {
      return nom.trim().split(' ').map((m) => m[0]).slice(0, 2).join('').toUpperCase()
    }
    return email ? email[0].toUpperCase() : '?'
  }

  async function handleAddProduit(e) {
    e.preventDefault()
    setLoading(true)

    let imageUrl = ''

    if (imageFile) {
      setUploading(true)
      const fileName = `${Date.now()}-${imageFile.name}`

      const { error: uploadError } = await supabase.storage
        .from('produits')
        .upload(fileName, imageFile)

      setUploading(false)

      if (uploadError) {
        alert('Erreur upload image : ' + uploadError.message)
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('produits')
        .getPublicUrl(fileName)

      imageUrl = urlData.publicUrl
    }

    const { error } = await supabase.from('produits').insert({
      nom,
      description,
      prix: parseFloat(prix),
      image_url: imageUrl,
      stock: parseInt(stock) || 0,
      categorie,
    })

    setLoading(false)

    if (error) {
      alert('Erreur : ' + error.message)
      return
    }

    // Vider le formulaire
    setNom('')
    setDescription('')
    setPrix('')
    setImageFile(null)
    setStock('')
    setCategorie('')
    setAfficherFormAjout(false)

    fetchProduits()
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce produit ?')) return
    const { error } = await supabase.from('produits').delete().eq('id', id)
    if (error) {
      alert('Erreur : ' + error.message)
      return
    }
    fetchProduits()
  }

  // ---- Modale "Voir" ----
  function ouvrirVue(p) {
    setProduitVu(p)
  }

  function fermerVue() {
    setProduitVu(null)
  }

  // ---- Modale "Modifier" ----
  function ouvrirEdition(p) {
    setProduitEnEdition(p)
    setEditNom(p.nom || '')
    setEditDescription(p.description || '')
    setEditPrix(p.prix ?? '')
    setEditStock(p.stock ?? '')
    setEditCategorie(p.categorie || '')
    setEditImageFile(null)
  }

  function fermerEdition() {
    setProduitEnEdition(null)
    setEditImageFile(null)
  }

  async function handleUpdateProduit(e) {
    e.preventDefault()
    if (!produitEnEdition) return
    setEditLoading(true)

    let imageUrl = produitEnEdition.image_url

    if (editImageFile) {
      setEditUploading(true)
      const fileName = `${Date.now()}-${editImageFile.name}`

      const { error: uploadError } = await supabase.storage
        .from('produits')
        .upload(fileName, editImageFile)

      setEditUploading(false)

      if (uploadError) {
        alert('Erreur upload image : ' + uploadError.message)
        setEditLoading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('produits')
        .getPublicUrl(fileName)

      imageUrl = urlData.publicUrl
    }

    const { error } = await supabase
      .from('produits')
      .update({
        nom: editNom,
        description: editDescription,
        prix: parseFloat(editPrix),
        image_url: imageUrl,
        stock: parseInt(editStock) || 0,
        categorie: editCategorie,
      })
      .eq('id', produitEnEdition.id)

    setEditLoading(false)

    if (error) {
      alert('Erreur : ' + error.message)
      return
    }

    fermerEdition()
    fetchProduits()
  }

  // ---- Calcul des ventes par produit ----
  // On additionne les quantités vendues pour chaque produit en parcourant
  // les commandes (le nom du produit au moment de la commande sert de clé,
  // car les commandes stockent un instantané des produits, pas leur id).
  function getVentes(nomProduit) {
    let total = 0
    for (const c of commandes) {
      if (!Array.isArray(c.produits)) continue
      for (const item of c.produits) {
        if (item.nom?.toLowerCase().trim() === nomProduit?.toLowerCase().trim()) {
          total += item.quantite || 0
        }
      }
    }
    return total
  }

  // ---- Statut visuel selon le stock ----
  function getStatutStock(stock) {
    if (stock === 0) {
      return { label: 'Rupture de stock', bg: colors.rustBg, color: colors.rust }
    }
    if (stock <= 5) {
      return { label: 'Stock faible', bg: colors.amberBg, color: colors.amber }
    }
    return { label: 'Disponible', bg: colors.sageBg, color: colors.sage }
  }

  // Filtrage des produits par nom / catégorie
  const produitsFiltres = produits.filter((p) => {
    const terme = rechercheProduit.toLowerCase()
    return (
      p.nom?.toLowerCase().includes(terme) ||
      p.categorie?.toLowerCase().includes(terme)
    )
  })

  // Filtrage des commandes par recherche (client / téléphone) et par date
  const commandesFiltrees = commandes.filter((c) => {
    const terme = rechercheCommande.toLowerCase()
    const matchTerme =
      c.nom_client?.toLowerCase().includes(terme) ||
      c.telephone?.toLowerCase().includes(terme) ||
      c.adresse?.toLowerCase().includes(terme)

    if (!matchTerme) return false

    if (dateDebut || dateFin) {
      const dateCommande = new Date(c.created_at)
      if (dateDebut) {
        const debut = new Date(dateDebut)
        debut.setHours(0, 0, 0, 0)
        if (dateCommande < debut) return false
      }
      if (dateFin) {
        const fin = new Date(dateFin)
        fin.setHours(23, 59, 59, 999)
        if (dateCommande > fin) return false
      }
    }

    return true
  })

  function resetFiltresCommandes() {
    setRechercheCommande('')
    setDateDebut('')
    setDateFin('')
  }

  // Police + petits réglages globaux (focus, hover) injectés une seule fois
  const GlobalStyle = () => (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

      input:focus, textarea:focus, select:focus {
        outline: none;
        border-color: ${colors.plum} !important;
        box-shadow: 0 0 0 3px ${colors.plumTint};
      }

      .merhas-btn-primary:hover { background: ${colors.plumDark} !important; }
      .merhas-btn-secondary:hover { background: ${colors.border} !important; }
      .merhas-tab:hover { color: ${colors.ink} !important; }
      .merhas-row:hover { background: ${colors.bg}; }
    `}</style>
  )

  if (!session) {
    return (
      <>
        <GlobalStyle />
        <main style={{
          minHeight: '100vh', background: colors.bg, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            width: '100%', maxWidth: '380px', background: colors.surface,
            border: `1px solid ${colors.border}`, borderRadius: '10px', padding: '36px 32px'
          }}>
            <p style={{ fontFamily: fontBody, fontSize: '13px', color: colors.inkMuted, margin: '0 0 4px' }}>
              Espace administration
            </p>
            <h1 style={{ fontFamily: fontDisplay, fontSize: '30px', fontWeight: 600, color: colors.ink, margin: '0 0 28px' }}>
              MERHAS
            </h1>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                required
              />
              <button type="submit" className="merhas-btn-primary" style={{
                padding: '12px', background: colors.plum, color: '#fff', border: 'none',
                borderRadius: '6px', cursor: 'pointer', fontFamily: fontBody, fontWeight: 600,
                fontSize: '14px', marginTop: '4px', transition: 'background 0.15s'
              }}>
                Se connecter
              </button>
              {errorMsg && (
                <p style={{ color: colors.rust, fontSize: '13px', fontFamily: fontBody, margin: 0 }}>{errorMsg}</p>
              )}
            </form>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <GlobalStyle />
      <main style={{
        minHeight: '100vh', background: colors.bg, fontFamily: fontBody, color: colors.ink
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px 80px' }}>

          {/* En-tête de marque */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: '32px', paddingBottom: '24px', borderBottom: `1px solid ${colors.border}`
          }}>
            <div>
              <p style={{ fontSize: '13px', color: colors.inkMuted, margin: '0 0 4px' }}>
                Espace administration
              </p>
              <h1 style={{ fontFamily: fontDisplay, fontSize: '34px', fontWeight: 600, color: colors.ink, margin: 0 }}>
                MERHAS
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setActiveTab('profil')}
                title="Voir mon profil"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', border: 'none',
                  background: 'transparent', cursor: 'pointer', padding: '4px', borderRadius: '999px'
                }}
              >
                {profilPhotoUrl ? (
                  <img
                    src={profilPhotoUrl}
                    alt="Profil"
                    style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${colors.border}` }}
                  />
                ) : (
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%', background: colors.plumTint,
                    color: colors.plum, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 600
                  }}>
                    {getInitiales(profilNom, session?.user?.email)}
                  </div>
                )}
                <span style={{ fontSize: '14px', color: colors.ink }}>
                  {profilNom || session?.user?.email}
                </span>
              </button>
              <button onClick={handleLogout} className="merhas-btn-secondary" style={{
                padding: '9px 18px', background: 'transparent', color: colors.ink,
                border: `1px solid ${colors.border}`, borderRadius: '6px', cursor: 'pointer',
                fontSize: '14px', transition: 'background 0.15s'
              }}>
                Se déconnecter
              </button>
            </div>
          </div>

          {/* Onglets */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', borderBottom: `1px solid ${colors.border}` }}>
            <button
              onClick={() => setActiveTab('produits')}
              className="merhas-tab"
              style={{
                padding: '10px 18px',
                border: 'none',
                background: 'transparent',
                borderBottom: activeTab === 'produits' ? `2px solid ${colors.plum}` : '2px solid transparent',
                color: activeTab === 'produits' ? colors.ink : colors.inkMuted,
                fontWeight: activeTab === 'produits' ? 600 : 500,
                fontSize: '14px',
                fontFamily: fontBody,
                cursor: 'pointer',
                transition: 'color 0.15s',
              }}
            >
              Produits ({produits.length})
            </button>
            <button
              onClick={() => setActiveTab('commandes')}
              className="merhas-tab"
              style={{
                padding: '10px 18px',
                border: 'none',
                background: 'transparent',
                borderBottom: activeTab === 'commandes' ? `2px solid ${colors.plum}` : '2px solid transparent',
                color: activeTab === 'commandes' ? colors.ink : colors.inkMuted,
                fontWeight: activeTab === 'commandes' ? 600 : 500,
                fontSize: '14px',
                fontFamily: fontBody,
                cursor: 'pointer',
                transition: 'color 0.15s',
              }}
            >
              Commandes ({commandes.length})
            </button>
            <button
              onClick={() => setActiveTab('profil')}
              className="merhas-tab"
              style={{
                padding: '10px 18px',
                border: 'none',
                background: 'transparent',
                borderBottom: activeTab === 'profil' ? `2px solid ${colors.plum}` : '2px solid transparent',
                color: activeTab === 'profil' ? colors.ink : colors.inkMuted,
                fontWeight: activeTab === 'profil' ? 600 : 500,
                fontSize: '14px',
                fontFamily: fontBody,
                cursor: 'pointer',
                transition: 'color 0.15s',
              }}
            >
              Profil
            </button>
          </div>

          {/* ===== ONGLET PRODUITS ===== */}
          {activeTab === 'produits' && (
            <>
              {/* Bouton pour afficher / masquer le formulaire d'ajout */}
              {!afficherFormAjout && (
                <button
                  onClick={() => setAfficherFormAjout(true)}
                  className="merhas-btn-primary"
                  style={{
                    padding: '11px 20px', background: colors.plum, color: '#fff', border: 'none',
                    borderRadius: '6px', cursor: 'pointer', marginBottom: '28px', fontWeight: 600,
                    fontSize: '14px', fontFamily: fontBody, transition: 'background 0.15s'
                  }}
                >
                  + Ajouter un produit
                </button>
              )}

              {/* Formulaire d'ajout (affiché uniquement au clic) */}
              {afficherFormAjout && (
                <div style={{
                  background: colors.surface, border: `1px solid ${colors.border}`,
                  borderRadius: '10px', padding: '24px', marginBottom: '32px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <h2 style={{ fontFamily: fontDisplay, fontSize: '20px', fontWeight: 600, margin: 0, color: colors.ink }}>
                      Ajouter un produit
                    </h2>
                    <button
                      onClick={() => setAfficherFormAjout(false)}
                      style={{ border: 'none', background: 'transparent', fontSize: '22px', cursor: 'pointer', color: colors.inkMuted, lineHeight: 1 }}
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={handleAddProduit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input
                      type="text"
                      placeholder="Nom du foulard"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      style={inputStyle}
                      required
                    />
                    <textarea
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={{ ...inputStyle, fontFamily: fontBody, resize: 'vertical' }}
                      rows={3}
                    />
                    <input
                      type="number"
                      placeholder="Prix (DH)"
                      value={prix}
                      onChange={(e) => setPrix(e.target.value)}
                      style={inputStyle}
                      required
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      style={inputStyle}
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      placeholder="Catégorie (ex: Soie, Coton...)"
                      value={categorie}
                      onChange={(e) => setCategorie(e.target.value)}
                      style={inputStyle}
                    />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setAfficherFormAjout(false)}
                        className="merhas-btn-secondary"
                        style={{
                          flex: 1, padding: '11px', background: colors.bg, color: colors.ink,
                          border: `1px solid ${colors.border}`, borderRadius: '6px', cursor: 'pointer',
                          fontFamily: fontBody, fontSize: '14px', transition: 'background 0.15s'
                        }}
                      >
                        Annuler
                      </button>
                      <button type="submit" disabled={loading} className="merhas-btn-primary" style={{
                        flex: 1, padding: '11px', background: colors.plum, color: '#fff', border: 'none',
                        borderRadius: '6px', cursor: 'pointer', fontFamily: fontBody, fontWeight: 600,
                        fontSize: '14px', transition: 'background 0.15s'
                      }}>
                        {uploading ? "Envoi de l'image..." : loading ? 'Ajout...' : 'Ajouter le produit'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Barre de recherche produits */}
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Rechercher un produit par nom ou catégorie..."
                  value={rechercheProduit}
                  onChange={(e) => setRechercheProduit(e.target.value)}
                  style={{
                    ...inputStyle,
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Table des produits */}
              <h2 style={{ fontFamily: fontDisplay, fontSize: '20px', fontWeight: 600, color: colors.ink, marginBottom: '16px' }}>
                Produits ({produitsFiltres.length}{produitsFiltres.length !== produits.length ? ` / ${produits.length}` : ''})
              </h2>

              {produitsFiltres.length === 0 ? (
                <p style={{ color: colors.inkMuted, fontSize: '14px' }}>Aucun produit ne correspond à cette recherche.</p>
              ) : (
                <div style={{ overflowX: 'auto', border: `1px solid ${colors.border}`, borderRadius: '10px', background: colors.surface }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ background: colors.bg, textAlign: 'left' }}>
                        <th style={{ padding: '12px 14px', fontWeight: 600, color: colors.inkMuted, fontSize: '13px' }}>Image</th>
                        <th style={{ padding: '12px 14px', fontWeight: 600, color: colors.inkMuted, fontSize: '13px' }}>Produit</th>
                        <th style={{ padding: '12px 14px', fontWeight: 600, color: colors.inkMuted, fontSize: '13px' }}>Catégorie</th>
                        <th style={{ padding: '12px 14px', fontWeight: 600, color: colors.inkMuted, fontSize: '13px' }}>Prix</th>
                        <th style={{ padding: '12px 14px', fontWeight: 600, color: colors.inkMuted, fontSize: '13px' }}>Stock</th>
                        <th style={{ padding: '12px 14px', fontWeight: 600, color: colors.inkMuted, fontSize: '13px' }}>Ventes</th>
                        <th style={{ padding: '12px 14px', fontWeight: 600, color: colors.inkMuted, fontSize: '13px' }}>Statut</th>
                        <th style={{ padding: '12px 14px', fontWeight: 600, color: colors.inkMuted, fontSize: '13px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produitsFiltres.map((p) => {
                        const statut = getStatutStock(p.stock)
                        const ventes = getVentes(p.nom)
                        return (
                          <tr key={p.id} className="merhas-row" style={{ borderTop: `1px solid ${colors.border}`, transition: 'background 0.1s' }}>
                            <td style={{ padding: '10px 14px' }}>
                              {p.image_url ? (
                                <img
                                  src={p.image_url}
                                  alt={p.nom}
                                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                                />
                              ) : (
                                <div style={{
                                  width: '48px', height: '48px', borderRadius: '6px',
                                  background: colors.bg, display: 'flex', alignItems: 'center',
                                  justifyContent: 'center', color: colors.inkMuted, fontSize: '11px'
                                }}>
                                  N/A
                                </div>
                              )}
                            </td>
                            <td style={{ padding: '10px 14px', fontWeight: 500, color: colors.ink }}>{p.nom}</td>
                            <td style={{ padding: '10px 14px', color: colors.inkMuted }}>{p.categorie || '—'}</td>
                            <td style={{ padding: '10px 14px', color: colors.ink }}>{p.prix} DH</td>
                            <td style={{ padding: '10px 14px', color: colors.ink }}>{p.stock}</td>
                            <td style={{ padding: '10px 14px', color: colors.ink }}>{ventes} vendus</td>
                            <td style={{ padding: '10px 14px' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 11px',
                                borderRadius: '999px',
                                fontSize: '12px',
                                fontWeight: 600,
                                background: statut.bg,
                                color: statut.color,
                              }}>
                                {statut.label}
                              </span>
                            </td>
                            <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                              <button
                                onClick={() => ouvrirEdition(p)}
                                style={{
                                  marginRight: '6px', padding: '6px 11px', fontSize: '13px',
                                  background: colors.plumTint, color: colors.plum, border: 'none',
                                  borderRadius: '5px', cursor: 'pointer', fontFamily: fontBody
                                }}
                              >
                                Modifier
                              </button>
                              <button
                                onClick={() => ouvrirVue(p)}
                                style={{
                                  marginRight: '6px', padding: '6px 11px', fontSize: '13px',
                                  background: colors.bg, color: colors.ink, border: `1px solid ${colors.border}`,
                                  borderRadius: '5px', cursor: 'pointer', fontFamily: fontBody
                                }}
                              >
                                Voir
                              </button>
                              <button
                                onClick={() => handleDelete(p.id)}
                                style={{
                                  padding: '6px 11px', fontSize: '13px',
                                  background: colors.rustBg, color: colors.rust, border: 'none',
                                  borderRadius: '5px', cursor: 'pointer', fontFamily: fontBody
                                }}
                              >
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* ===== ONGLET COMMANDES ===== */}
          {activeTab === 'commandes' && (
            <>
              {/* Barre de recherche + filtre par date */}
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px',
                border: `1px solid ${colors.border}`, borderRadius: '10px', padding: '18px',
                background: colors.surface
              }}>
                <input
                  type="text"
                  placeholder="Rechercher par nom, téléphone ou adresse..."
                  value={rechercheCommande}
                  onChange={(e) => setRechercheCommande(e.target.value)}
                  style={{ ...inputStyle, flex: '1 1 240px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '13px', color: colors.inkMuted }}>Du</label>
                  <input
                    type="date"
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '13px', color: colors.inkMuted }}>Au</label>
                  <input
                    type="date"
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                {(rechercheCommande || dateDebut || dateFin) && (
                  <button
                    onClick={resetFiltresCommandes}
                    className="merhas-btn-secondary"
                    style={{
                      padding: '11px 16px', background: colors.bg, border: `1px solid ${colors.border}`,
                      borderRadius: '6px', cursor: 'pointer', fontSize: '14px', color: colors.ink,
                      fontFamily: fontBody, transition: 'background 0.15s'
                    }}
                  >
                    Réinitialiser
                  </button>
                )}
              </div>

              {/* Liste des commandes */}
              <h2 style={{ fontFamily: fontDisplay, fontSize: '20px', fontWeight: 600, color: colors.ink, marginBottom: '16px' }}>
                Commandes ({commandesFiltrees.length}{commandesFiltrees.length !== commandes.length ? ` / ${commandes.length}` : ''})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {commandesFiltrees.length === 0 && (
                  <p style={{ color: colors.inkMuted, fontSize: '14px' }}>Aucune commande ne correspond à ces critères.</p>
                )}
                {commandesFiltrees.map((c) => (
                  <div key={c.id} style={{
                    background: colors.surface, border: `1px solid ${colors.border}`,
                    borderRadius: '10px', padding: '18px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <strong style={{ color: colors.ink }}>{c.nom_client}</strong>
                        <span style={{ color: colors.inkMuted }}> — {c.telephone}</span><br />
                        <span style={{ color: colors.inkMuted, fontSize: '14px' }}>{c.adresse}</span><br />
                        <span style={{ color: colors.inkMuted, fontSize: '12px' }}>
                          {c.created_at && new Date(c.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <select
                        value={c.statut}
                        onChange={(e) => updateStatut(c.id, e.target.value)}
                        style={{ ...inputStyle, padding: '8px 10px' }}
                      >
                        <option value="en attente">En attente</option>
                        <option value="confirmée">Confirmée</option>
                        <option value="livrée">Livrée</option>
                        <option value="annulée">Annulée</option>
                      </select>
                    </div>
                    <ul style={{ marginTop: '12px', paddingLeft: '20px', color: colors.ink }}>
                      {c.produits.map((p, i) => (
                        <li key={i}>{p.nom} x{p.quantite} — {p.prix * p.quantite} DH</li>
                      ))}
                    </ul>
                    <div style={{ marginTop: '10px', fontWeight: 600, color: colors.ink }}>
                      Total : {c.total} DH
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ===== ONGLET PROFIL ===== */}
          {activeTab === 'profil' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '480px' }}>

              {/* Carte : informations du profil */}
              <div style={{
                background: colors.surface, border: `1px solid ${colors.border}`,
                borderRadius: '10px', padding: '24px'
              }}>
                <h2 style={{ fontFamily: fontDisplay, fontSize: '20px', fontWeight: 600, margin: '0 0 18px', color: colors.ink }}>
                  Mon profil
                </h2>
                <form onSubmit={handleUpdateProfil} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {profilPhotoUrl ? (
                      <img
                        src={profilPhotoUrl}
                        alt="Photo de profil"
                        style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${colors.border}` }}
                      />
                    ) : (
                      <div style={{
                        width: '64px', height: '64px', borderRadius: '50%', background: colors.plumTint,
                        color: colors.plum, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '20px', fontWeight: 600
                      }}>
                        {getInitiales(profilNom, session?.user?.email)}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfilPhotoFile(e.target.files[0])}
                        style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                      />
                      <span style={{ fontSize: '12px', color: colors.inkMuted }}>
                        Photo de profil (optionnel)
                      </span>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', color: colors.inkMuted, display: 'block', marginBottom: '6px' }}>
                      Nom affiché
                    </label>
                    <input
                      type="text"
                      placeholder="Ton nom"
                      value={profilNom}
                      onChange={(e) => setProfilNom(e.target.value)}
                      style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', color: colors.inkMuted, display: 'block', marginBottom: '6px' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={session?.user?.email || ''}
                      disabled
                      style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', color: colors.inkMuted, background: colors.bg }}
                    />
                  </div>

                  <button type="submit" disabled={profilLoading} className="merhas-btn-primary" style={{
                    padding: '11px', background: colors.plum, color: '#fff', border: 'none',
                    borderRadius: '6px', cursor: 'pointer', fontFamily: fontBody, fontWeight: 600,
                    fontSize: '14px', transition: 'background 0.15s'
                  }}>
                    {profilUploading ? 'Envoi de la photo...' : profilLoading ? 'Enregistrement...' : 'Enregistrer le profil'}
                  </button>

                  {profilMsg && (
                    <p style={{
                      fontSize: '13px', margin: 0,
                      color: profilMsg.startsWith('Erreur') ? colors.rust : colors.sage
                    }}>
                      {profilMsg}
                    </p>
                  )}
                </form>
              </div>

              {/* Carte : changer le mot de passe */}
              <div style={{
                background: colors.surface, border: `1px solid ${colors.border}`,
                borderRadius: '10px', padding: '24px'
              }}>
                <h2 style={{ fontFamily: fontDisplay, fontSize: '20px', fontWeight: 600, margin: '0 0 18px', color: colors.ink }}>
                  Changer le mot de passe
                </h2>
                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: colors.inkMuted, display: 'block', marginBottom: '6px' }}>
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      placeholder="Au moins 6 caractères"
                      value={nouveauMdp}
                      onChange={(e) => setNouveauMdp(e.target.value)}
                      style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: colors.inkMuted, display: 'block', marginBottom: '6px' }}>
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      placeholder="Retape le mot de passe"
                      value={confirmMdp}
                      onChange={(e) => setConfirmMdp(e.target.value)}
                      style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                  <button type="submit" disabled={mdpLoading} className="merhas-btn-secondary" style={{
                    padding: '11px', background: colors.bg, color: colors.ink, border: `1px solid ${colors.border}`,
                    borderRadius: '6px', cursor: 'pointer', fontFamily: fontBody, fontWeight: 600,
                    fontSize: '14px', transition: 'background 0.15s'
                  }}>
                    {mdpLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                  </button>
                  {mdpMsg && (
                    <p style={{
                      fontSize: '13px', margin: 0,
                      color: mdpMsg.startsWith('Erreur') || mdpMsg.includes('correspondent') || mdpMsg.includes('caractères') ? colors.rust : colors.sage
                    }}>
                      {mdpMsg}
                    </p>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* ===== MODALE "VOIR" ===== */}
          {produitVu && (
            <div
              onClick={fermerVue}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(43,36,32,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px'
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: colors.surface, borderRadius: '12px', padding: '26px',
                  maxWidth: '480px', width: '100%', maxHeight: '90vh', overflowY: 'auto'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <h2 style={{ fontFamily: fontDisplay, fontSize: '22px', fontWeight: 600, margin: 0, color: colors.ink }}>
                    {produitVu.nom}
                  </h2>
                  <button onClick={fermerVue} style={{
                    border: 'none', background: 'transparent', fontSize: '22px', cursor: 'pointer', color: colors.inkMuted, lineHeight: 1
                  }}>
                    ×
                  </button>
                </div>
                {produitVu.image_url && (
                  <img
                    src={produitVu.image_url}
                    alt={produitVu.nom}
                    style={{ width: '100%', maxHeight: '260px', objectFit: 'cover', borderRadius: '8px', marginBottom: '18px' }}
                  />
                )}
                <p style={{ color: colors.inkMuted, marginBottom: '14px', lineHeight: 1.5 }}>
                  {produitVu.description || 'Aucune description.'}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '13px' }}>
                  <span style={{ background: colors.goldTint, color: colors.gold, padding: '6px 12px', borderRadius: '999px', fontWeight: 600 }}>
                    {produitVu.prix} DH
                  </span>
                  <span style={{ background: colors.bg, color: colors.ink, padding: '6px 12px', borderRadius: '999px' }}>
                    Stock : {produitVu.stock}
                  </span>
                  <span style={{ background: colors.bg, color: colors.ink, padding: '6px 12px', borderRadius: '999px' }}>
                    {produitVu.categorie || 'Sans catégorie'}
                  </span>
                  <span style={{ background: colors.bg, color: colors.ink, padding: '6px 12px', borderRadius: '999px' }}>
                    {getVentes(produitVu.nom)} vendus
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ===== MODALE "MODIFIER" ===== */}
          {produitEnEdition && (
            <div
              onClick={fermerEdition}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(43,36,32,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px'
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: colors.surface, borderRadius: '12px', padding: '26px',
                  maxWidth: '480px', width: '100%', maxHeight: '90vh', overflowY: 'auto'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <h2 style={{ fontFamily: fontDisplay, fontSize: '22px', fontWeight: 600, margin: 0, color: colors.ink }}>
                    Modifier le produit
                  </h2>
                  <button onClick={fermerEdition} style={{
                    border: 'none', background: 'transparent', fontSize: '22px', cursor: 'pointer', color: colors.inkMuted, lineHeight: 1
                  }}>
                    ×
                  </button>
                </div>
                <form onSubmit={handleUpdateProduit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Nom du foulard"
                    value={editNom}
                    onChange={(e) => setEditNom(e.target.value)}
                    style={inputStyle}
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    rows={3}
                  />
                  <input
                    type="number"
                    placeholder="Prix (DH)"
                    value={editPrix}
                    onChange={(e) => setEditPrix(e.target.value)}
                    style={inputStyle}
                    required
                  />
                  {produitEnEdition.image_url && !editImageFile && (
                    <img
                      src={produitEnEdition.image_url}
                      alt="Image actuelle"
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditImageFile(e.target.files[0])}
                    style={inputStyle}
                  />
                  <span style={{ fontSize: '12px', color: colors.inkMuted }}>
                    Laisse vide pour garder la photo actuelle.
                  </span>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    placeholder="Catégorie (ex: Soie, Coton...)"
                    value={editCategorie}
                    onChange={(e) => setEditCategorie(e.target.value)}
                    style={inputStyle}
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={fermerEdition}
                      className="merhas-btn-secondary"
                      style={{
                        flex: 1, padding: '11px', background: colors.bg, color: colors.ink,
                        border: `1px solid ${colors.border}`, borderRadius: '6px', cursor: 'pointer',
                        fontFamily: fontBody, fontSize: '14px', transition: 'background 0.15s'
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="merhas-btn-primary"
                      style={{
                        flex: 1, padding: '11px', background: colors.plum, color: '#fff',
                        border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: fontBody,
                        fontWeight: 600, fontSize: '14px', transition: 'background 0.15s'
                      }}
                    >
                      {editUploading ? "Envoi de l'image..." : editLoading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}