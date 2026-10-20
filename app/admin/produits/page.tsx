"use client";

import { useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { prixFormate } from "../../lib/content";
import type { Produit } from "../../lib/types";
import { useAdmin } from "../_components/AdminProviders";
import { Badge, Button, FIELD } from "../_components/ui";
import ProduitFormDialog from "../_components/ProduitFormDialog";
import ProduitViewDialog from "../_components/ProduitViewDialog";
import {
  EditIcon,
  EyeIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "../../components/icons";
import { cheminStorage, niveauStock } from "../_lib/helpers";
import { revaliderSite } from "../_lib/revalider";

export default function ProduitsPage() {
  const { produits, refetchProduits, getVentes, dataLoading } = useAdmin();
  const [recherche, setRecherche] = useState("");
  const [creation, setCreation] = useState(false);
  const [edition, setEdition] = useState<Produit | null>(null);
  const [apercu, setApercu] = useState<Produit | null>(null);

  const filtres = useMemo(() => {
    const t = recherche.toLowerCase().trim();
    if (!t) return produits;
    return produits.filter(
      (p) =>
        p.nom?.toLowerCase().includes(t) ||
        p.categorie?.toLowerCase().includes(t),
    );
  }, [produits, recherche]);

  async function supprimer(p: Produit) {
    if (!confirm(`Supprimer « ${p.nom} » ?`)) return;

    const { error } = await supabase.from("produits").delete().eq("id", p.id);
    if (error) {
      alert("Erreur : " + error.message);
      return;
    }

    // Nettoie aussi la photo dans le Storage Supabase. Non bloquant : si ça
    // échoue, le produit est quand même supprimé (juste un fichier orphelin).
    if (p.image_url) {
      const chemin = cheminStorage(p.image_url, "produits");
      if (chemin) {
        const { error: storageError } = await supabase.storage
          .from("produits")
          .remove([chemin]);
        if (storageError) {
          console.error(
            "Suppression de la photo (storage) : " + storageError.message,
          );
        }
      }
    }

    revaliderSite();
    refetchProduits();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <SearchIcon
            width={16}
            height={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-taupe"
          />
          <input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un produit…"
            className={`${FIELD} pl-9`}
          />
        </div>
        <Button onClick={() => setCreation(true)} className="ml-auto">
          <PlusIcon width={16} height={16} />
          Ajouter un produit
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-line bg-cream/50 text-left text-xs uppercase tracking-[0.1em] text-taupe">
                <th className="px-4 py-3 font-medium">Produit</th>
                <th className="px-4 py-3 font-medium">Catégorie</th>
                <th className="px-4 py-3 font-medium">Prix</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Ventes</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtres.map((p) => {
                const n = niveauStock(p.stock);
                return (
                  <tr key={p.id} className="transition-colors hover:bg-cream/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-cream">
                          {p.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.image_url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-[0.6rem] text-taupe">
                              N/A
                            </span>
                          )}
                        </span>
                        <span className="font-medium text-espresso">
                          {p.nom}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-taupe">
                      {p.categorie || "—"}
                    </td>
                    <td className="px-4 py-3 text-espresso">
                      {prixFormate(p.prix)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2">
                        <span className="text-espresso">{p.stock ?? 0}</span>
                        <Badge className={n.classe}>{n.label}</Badge>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-taupe">
                      {getVentes(p.nom)} vendus
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <IconBtn
                          label="Voir"
                          onClick={() => setApercu(p)}
                        >
                          <EyeIcon width={16} height={16} />
                        </IconBtn>
                        <IconBtn
                          label="Modifier"
                          onClick={() => setEdition(p)}
                        >
                          <EditIcon width={16} height={16} />
                        </IconBtn>
                        <IconBtn
                          label="Supprimer"
                          danger
                          onClick={() => supprimer(p)}
                        >
                          <TrashIcon width={16} height={16} />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!dataLoading && filtres.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-taupe">
            {produits.length === 0
              ? "Aucun produit. Ajoute ton premier foulard."
              : "Aucun produit ne correspond à cette recherche."}
          </p>
        )}
      </div>

      {creation && (
        <ProduitFormDialog
          onClose={() => setCreation(false)}
          onDone={refetchProduits}
        />
      )}
      {edition && (
        <ProduitFormDialog
          produit={edition}
          onClose={() => setEdition(null)}
          onDone={refetchProduits}
        />
      )}
      {apercu && (
        <ProduitViewDialog
          produit={apercu}
          ventes={getVentes(apercu.nom)}
          onClose={() => setApercu(null)}
        />
      )}
    </div>
  );
}

function IconBtn({
  label,
  danger,
  onClick,
  children,
}: {
  label: string;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`rounded-lg p-2 transition-colors ${
        danger
          ? "text-taupe hover:bg-rosewood/10 hover:text-rosewood"
          : "text-taupe hover:bg-cream hover:text-espresso"
      }`}
    >
      {children}
    </button>
  );
}
