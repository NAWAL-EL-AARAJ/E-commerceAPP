"use client";

import { useState, type ReactNode } from "react";
import { supabase } from "../../lib/supabase";
import type { Produit } from "../../lib/types";
import { colors, fontBody, fontDisplay, inputStyle } from "./theme";

function Overlay({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(43,36,32,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: colors.surface,
          borderRadius: "12px",
          padding: "26px",
          maxWidth: "480px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function TitleRow({
  titre,
  onClose,
}: {
  titre: string;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "18px",
      }}
    >
      <h2
        style={{
          fontFamily: fontDisplay,
          fontSize: "22px",
          fontWeight: 600,
          margin: 0,
          color: colors.ink,
        }}
      >
        {titre}
      </h2>
      <button
        onClick={onClose}
        style={{
          border: "none",
          background: "transparent",
          fontSize: "22px",
          cursor: "pointer",
          color: colors.inkMuted,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}

export function ProduitVoirModal({
  produit,
  ventes,
  onClose,
}: {
  produit: Produit;
  ventes: number;
  onClose: () => void;
}) {
  return (
    <Overlay onClose={onClose}>
      <TitleRow titre={produit.nom} onClose={onClose} />
      {produit.image_url && (
        <img
          src={produit.image_url}
          alt={produit.nom}
          style={{
            width: "100%",
            maxHeight: "260px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "18px",
          }}
        />
      )}
      <p
        style={{
          color: colors.inkMuted,
          marginBottom: "14px",
          lineHeight: 1.5,
        }}
      >
        {produit.description || "Aucune description."}
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          fontSize: "13px",
        }}
      >
        <span
          style={{
            background: colors.goldTint,
            color: colors.gold,
            padding: "6px 12px",
            borderRadius: "999px",
            fontWeight: 600,
          }}
        >
          {produit.prix} DH
        </span>
        <span
          style={{
            background: colors.bg,
            color: colors.ink,
            padding: "6px 12px",
            borderRadius: "999px",
          }}
        >
          Stock : {produit.stock}
        </span>
        <span
          style={{
            background: colors.bg,
            color: colors.ink,
            padding: "6px 12px",
            borderRadius: "999px",
          }}
        >
          {produit.categorie || "Sans catégorie"}
        </span>
        <span
          style={{
            background: colors.bg,
            color: colors.ink,
            padding: "6px 12px",
            borderRadius: "999px",
          }}
        >
          {ventes} vendus
        </span>
      </div>
    </Overlay>
  );
}

export function ProduitEditModal({
  produit,
  onClose,
  onSaved,
}: {
  produit: Produit;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [nom, setNom] = useState(produit.nom || "");
  const [description, setDescription] = useState(produit.description || "");
  const [prix, setPrix] = useState<string>(String(produit.prix ?? ""));
  const [stock, setStock] = useState<string>(String(produit.stock ?? ""));
  const [categorie, setCategorie] = useState(produit.categorie || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let imageUrl = produit.image_url;

    if (imageFile) {
      setUploading(true);
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("produits")
        .upload(fileName, imageFile);
      setUploading(false);

      if (uploadError) {
        alert("Erreur upload image : " + uploadError.message);
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage
        .from("produits")
        .getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    const { error } = await supabase
      .from("produits")
      .update({
        nom,
        description,
        prix: parseFloat(prix),
        image_url: imageUrl,
        stock: parseInt(stock) || 0,
        categorie,
      })
      .eq("id", produit.id);

    setLoading(false);

    if (error) {
      alert("Erreur : " + error.message);
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <Overlay onClose={onClose}>
      <TitleRow titre="Modifier le produit" onClose={onClose} />
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
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
          style={{ ...inputStyle, resize: "vertical" }}
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
        {produit.image_url && !imageFile && (
          <img
            src={produit.image_url}
            alt="Image actuelle"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          style={inputStyle}
        />
        <span style={{ fontSize: "12px", color: colors.inkMuted }}>
          Laisse vide pour garder la photo actuelle.
        </span>
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
        <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
          <button
            type="button"
            onClick={onClose}
            className="merhas-btn-secondary"
            style={{
              flex: 1,
              padding: "11px",
              background: colors.bg,
              color: colors.ink,
              border: `1px solid ${colors.border}`,
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: fontBody,
              fontSize: "14px",
              transition: "background 0.15s",
            }}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="merhas-btn-primary"
            style={{
              flex: 1,
              padding: "11px",
              background: colors.plum,
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: fontBody,
              fontWeight: 600,
              fontSize: "14px",
              transition: "background 0.15s",
            }}
          >
            {uploading
              ? "Envoi de l'image..."
              : loading
                ? "Enregistrement..."
                : "Enregistrer"}
          </button>
        </div>
      </form>
    </Overlay>
  );
}
