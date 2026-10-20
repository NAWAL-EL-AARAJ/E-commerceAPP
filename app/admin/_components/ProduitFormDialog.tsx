"use client";

import { useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { galerieProduit } from "../../lib/produit";
import type { Produit } from "../../lib/types";
import { useAdmin } from "./AdminProviders";
import Dialog from "./Dialog";
import { Button, FIELD, Label } from "./ui";
import { cheminStorage } from "../_lib/helpers";
import RichTextEditor from "./RichTextEditor";

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

  // Photos : celles déjà en ligne (modifiables/supprimables une à une) + les
  // nouveaux fichiers ajoutés dans cette session d'édition.
  const [imagesExistantes, setImagesExistantes] = useState<string[]>(
    () => (produit ? galerieProduit(produit) : []),
  );
  const [nouveauxFichiers, setNouveauxFichiers] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  const apercusNouveaux = useMemo(
    () => nouveauxFichiers.map((f) => URL.createObjectURL(f)),
    [nouveauxFichiers],
  );
  const totalPhotos = imagesExistantes.length + nouveauxFichiers.length;

  function ajouterFichiers(fichiers: FileList | null) {
    if (!fichiers) return;
    setNouveauxFichiers((prev) => [...prev, ...Array.from(fichiers)]);
  }

  function retirerExistante(url: string) {
    setImagesExistantes((prev) => prev.filter((u) => u !== url));
  }

  function retirerNouveau(index: number) {
    setNouveauxFichiers((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");

    if (totalPhotos === 0) {
      setErreur("Ajoute au moins une photo.");
      return;
    }

    setLoading(true);

    // 1. Upload des nouvelles photos
    const urlsNouvelles: string[] = [];
    if (nouveauxFichiers.length > 0) {
      setUploading(true);
      for (const fichier of nouveauxFichiers) {
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${fichier.name}`;
        const { error: uploadError } = await supabase.storage
          .from("produits")
          .upload(fileName, fichier);

        if (uploadError) {
          setUploading(false);
          setLoading(false);
          setErreur("Erreur upload image : " + uploadError.message);
          return;
        }
        urlsNouvelles.push(
          supabase.storage.from("produits").getPublicUrl(fileName).data
            .publicUrl,
        );
      }
      setUploading(false);
    }

    const images = [...imagesExistantes, ...urlsNouvelles];

    // 2. Nettoyage des photos retirées (non bloquant)
    if (edition) {
      const avant = galerieProduit(produit!);
      const retirees = avant.filter((u) => !imagesExistantes.includes(u));
      for (const url of retirees) {
        const chemin = cheminStorage(url, "produits");
        if (chemin) {
          const { error: cleanupError } = await supabase.storage
            .from("produits")
            .remove([chemin]);
          if (cleanupError) {
            console.error(
              "Suppression de la photo (storage) : " + cleanupError.message,
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
      image_url: images[0] ?? "",
      images,
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

  return (
    <Dialog
      titre={edition ? "Modifier le produit" : "Ajouter un produit"}
      onClose={onClose}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Photos ({totalPhotos})</Label>
          <div className="flex flex-wrap gap-3">
            {imagesExistantes.map((url) => (
              <div
                key={url}
                className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-line bg-cream"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => retirerExistante(url)}
                  aria-label="Retirer cette photo"
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-espresso/70 text-xs text-cream opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
            {nouveauxFichiers.map((fichier, i) => (
              <div
                key={fichier.name + i}
                className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-rosewood/40 bg-cream"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={apercusNouveaux[i]}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => retirerNouveau(i)}
                  aria-label="Retirer cette photo"
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-espresso/70 text-xs text-cream opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}

            <label className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line text-taupe transition-colors hover:border-rosewood hover:text-rosewood">
              <span className="text-xl leading-none">+</span>
              <span className="text-[0.65rem]">Ajouter</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  ajouterFichiers(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </label>
          </div>
          <p className="mt-2 text-xs text-taupe">
            La première photo est utilisée comme image principale (boutique,
            panier…). Glisse-déposer non géré : utilise « Ajouter ».
          </p>
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
          <RichTextEditor value={description} onChange={setDescription} />
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
              ? "Envoi des photos…"
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
