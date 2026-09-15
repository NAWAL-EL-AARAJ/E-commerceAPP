"use client";

import { useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { Produit } from "../../lib/types";
import { useAdmin } from "./AdminProviders";
import Dialog from "./Dialog";
import { Button, FIELD, Label } from "./ui";
import { cheminStorage } from "../_lib/helpers";

const NOUVELLE_CATEGORIE = "__nouvelle__";

export default function ProduitFormDialog({
  produit,
  onClose,
  onDone,
}: {
  /** Absent = création, présent = édition. */
  produit?: Produit;
  onClose: () => void;
  onDone: () => void | Promise<void>;
}) {
  const edition = Boolean(produit);
  const { produits } = useAdmin();

  const categoriesExistantes = useMemo(
    () =>
      Array.from(
        new Set(
          produits
            .map((p) => p.categorie?.trim())
            .filter((c): c is string => Boolean(c)),
        ),
      ).sort((a, b) => a.localeCompare(b, "fr")),
    [produits],
  );

  const [nom, setNom] = useState(produit?.nom ?? "");
  const [description, setDescription] = useState(produit?.description ?? "");
  const [prix, setPrix] = useState(
    produit?.prix != null ? String(produit.prix) : "",
  );
  const [stock, setStock] = useState(
    produit?.stock != null ? String(produit.stock) : "",
  );
  const [categorieChoix, setCategorieChoix] = useState(
    produit?.categorie?.trim() ?? "",
  );
  const [nouvelleCategorie, setNouvelleCategorie] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setLoading(true);

    let imageUrl = produit?.image_url ?? "";

    if (imageFile) {
      setUploading(true);
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("produits")
        .upload(fileName, imageFile);
      setUploading(false);

      if (uploadError) {
        setErreur("Erreur upload image : " + uploadError.message);
        setLoading(false);
        return;
      }
      imageUrl = supabase.storage.from("produits").getPublicUrl(fileName)
        .data.publicUrl;

      // Ancienne photo remplacée : on la retire du Storage pour ne pas
      // laisser de fichier orphelin (non bloquant si ça échoue).
      if (edition && produit?.image_url) {
        const ancienChemin = cheminStorage(produit.image_url, "produits");
        if (ancienChemin) {
          const { error: cleanupError } = await supabase.storage
            .from("produits")
            .remove([ancienChemin]);
          if (cleanupError) {
            console.error(
              "Suppression de l'ancienne photo (storage) : " +
                cleanupError.message,
            );
          }
        }
      }
    }

    const categorie =
      categorieChoix === NOUVELLE_CATEGORIE
        ? nouvelleCategorie.trim()
        : categorieChoix;

    const payload = {
      nom,
      description,
      prix: parseFloat(prix),
      image_url: imageUrl,
      stock: parseInt(stock) || 0,
      categorie,
    };

    const { error } = edition
      ? await supabase.from("produits").update(payload).eq("id", produit!.id)
      : await supabase.from("produits").insert(payload);

    setLoading(false);

    if (error) {
      setErreur("Erreur : " + error.message);
      return;
    }

    await onDone();
    onClose();
  }

  const apercu = imageFile
    ? URL.createObjectURL(imageFile)
    : (produit?.image_url ?? null);

  return (
    <Dialog
      titre={edition ? "Modifier le produit" : "Ajouter un produit"}
      onClose={onClose}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-cream">
            {apercu ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={apercu}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs text-taupe">Photo</span>
            )}
          </div>
          <div className="flex-1">
            <Label>Photo</Label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-taupe file:mr-3 file:rounded-lg file:border file:border-line file:bg-white file:px-3 file:py-2 file:text-sm file:text-espresso hover:file:bg-cream"
            />
            {edition && (
              <p className="mt-1 text-xs text-taupe">
                Laisse vide pour garder la photo actuelle.
              </p>
            )}
          </div>
        </div>

        <div>
          <Label>Nom du foulard</Label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className={FIELD}
            required
          />
        </div>

        <div>
          <Label>Description</Label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`${FIELD} resize-y`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Prix (DH)</Label>
            <input
              type="number"
              step="0.01"
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              className={FIELD}
              required
            />
          </div>
          <div>
            <Label>Stock</Label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className={FIELD}
            />
          </div>
        </div>

        <div>
          <Label>Catégorie</Label>
          <select
            value={categorieChoix}
            onChange={(e) => setCategorieChoix(e.target.value)}
            className={FIELD}
          >
            <option value="">Sans catégorie</option>
            {categoriesExistantes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value={NOUVELLE_CATEGORIE}>+ Nouvelle catégorie…</option>
          </select>
          {categorieChoix === NOUVELLE_CATEGORIE && (
            <input
              type="text"
              autoFocus
              value={nouvelleCategorie}
              onChange={(e) => setNouvelleCategorie(e.target.value)}
              placeholder="Ex. Soie, Coton, Accessoires…"
              className={`${FIELD} mt-2`}
            />
          )}
          <p className="mt-1.5 text-xs text-taupe">
            Ces catégories servent aussi de filtres sur la page Boutique.
          </p>
        </div>

        {erreur && <p className="text-sm text-rosewood">{erreur}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {uploading
              ? "Envoi de l'image…"
              : loading
                ? "Enregistrement…"
                : edition
                  ? "Enregistrer"
                  : "Ajouter le produit"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
