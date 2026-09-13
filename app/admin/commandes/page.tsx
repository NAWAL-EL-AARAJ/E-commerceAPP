"use client";

import { useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { prixFormate } from "../../lib/content";
import { useAdmin } from "../_components/AdminProviders";
import { Badge, Button, FIELD } from "../_components/ui";
import { SearchIcon, TrashIcon } from "../../components/icons";
import {
  classeStatutCommande,
  dateHeure,
  STATUTS_COMMANDE,
} from "../_lib/helpers";

export default function CommandesPage() {
  const { commandes, refetchCommandes, dataLoading } = useAdmin();
  const [recherche, setRecherche] = useState("");
  const [du, setDu] = useState("");
  const [au, setAu] = useState("");

  const filtres = useMemo(() => {
    const t = recherche.toLowerCase().trim();
    return commandes.filter((c) => {
      const match =
        !t ||
        c.nom_client?.toLowerCase().includes(t) ||
        c.telephone?.toLowerCase().includes(t) ||
        c.adresse?.toLowerCase().includes(t);
      if (!match) return false;

      if (du || au) {
        const d = new Date(c.created_at ?? 0);
        if (du) {
          const debut = new Date(du);
          debut.setHours(0, 0, 0, 0);
          if (d < debut) return false;
        }
        if (au) {
          const fin = new Date(au);
          fin.setHours(23, 59, 59, 999);
          if (d > fin) return false;
        }
      }
      return true;
    });
  }, [commandes, recherche, du, au]);

  const [accesErreur, setAccesErreur] = useState("");

  async function changerStatut(id: string, statut: string) {
    setAccesErreur("");
    // .select() pour vérifier qu'une ligne a bien été modifiée : une policy
    // RLS trop stricte ne renvoie pas d'erreur, juste 0 ligne mise à jour.
    const { data, error } = await supabase
      .from("commandes")
      .update({ statut })
      .eq("id", id)
      .select("id");

    if (error) {
      setAccesErreur("Erreur : " + error.message);
      return;
    }
    if (!data || data.length === 0) {
      setAccesErreur(
        "Le statut n'a pas été enregistré : Supabase a bloqué la modification " +
          "(policy RLS manquante sur la table « commandes »). Voir la note sous ce message.",
      );
      return;
    }
    refetchCommandes();
  }

  async function supprimerCommande(id: string, nomClient: string) {
    if (!confirm(`Supprimer la commande de ${nomClient} ? C'est définitif.`))
      return;

    setAccesErreur("");
    const { data, error } = await supabase
      .from("commandes")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      setAccesErreur("Erreur : " + error.message);
      return;
    }
    if (!data || data.length === 0) {
      setAccesErreur(
        "La commande n'a pas été supprimée : Supabase a bloqué la suppression " +
          "(policy RLS manquante sur la table « commandes »). Voir la note sous ce message.",
      );
      return;
    }
    refetchCommandes();
  }

  const filtreActif = recherche || du || au;

  return (
    <div className="space-y-5">
      {accesErreur && (
        <div className="rounded-2xl border border-rosewood/30 bg-rosewood/5 p-4">
          <p className="text-sm font-medium text-rosewood">{accesErreur}</p>
          <p className="mt-2 text-sm text-taupe">
            Ouvre l&apos;éditeur SQL de ton projet Supabase et exécute ceci
            une seule fois pour autoriser l&apos;admin à modifier et
            supprimer des commandes :
          </p>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-espresso px-3 py-2.5 text-xs text-cream">
            {`create policy "admin_update_commandes"\non commandes for update\nto authenticated\nusing (true)\nwith check (true);\n\ncreate policy "admin_delete_commandes"\non commandes for delete\nto authenticated\nusing (true);`}
          </pre>
          <a
            href="https://supabase.com/dashboard/project/nevanxhdyuxdtejuhztf/sql/new"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-xs uppercase tracking-[0.12em] text-rosewood hover:underline"
          >
            Ouvrir l&apos;éditeur SQL Supabase ↗
          </a>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-white p-4">
        <div className="relative flex-1 sm:max-w-xs">
          <SearchIcon
            width={16}
            height={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-taupe"
          />
          <input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Nom, téléphone, adresse…"
            className={`${FIELD} pl-9`}
          />
        </div>
        <label className="text-xs text-taupe">
          Du
          <input
            type="date"
            value={du}
            onChange={(e) => setDu(e.target.value)}
            className={`${FIELD} mt-1`}
          />
        </label>
        <label className="text-xs text-taupe">
          Au
          <input
            type="date"
            value={au}
            onChange={(e) => setAu(e.target.value)}
            className={`${FIELD} mt-1`}
          />
        </label>
        {filtreActif && (
          <Button
            variant="secondary"
            onClick={() => {
              setRecherche("");
              setDu("");
              setAu("");
            }}
          >
            Réinitialiser
          </Button>
        )}
      </div>

      <p className="text-sm text-taupe">
        {filtres.length} commande{filtres.length > 1 ? "s" : ""}
        {filtreActif && ` sur ${commandes.length}`}
      </p>

      <div className="space-y-3">
        {filtres.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-line bg-white p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-espresso">
                  {c.nom_client}{" "}
                  <span className="font-normal text-taupe">
                    · {c.telephone}
                  </span>
                </p>
                <p className="mt-0.5 text-sm text-taupe">{c.adresse}</p>
                <p className="mt-0.5 text-xs text-taupe">
                  {dateHeure(c.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={classeStatutCommande(c.statut)}>
                  {c.statut}
                </Badge>
                <select
                  value={c.statut}
                  onChange={(e) => changerStatut(c.id, e.target.value)}
                  className={`${FIELD} w-auto py-2`}
                >
                  {STATUTS_COMMANDE.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => supprimerCommande(c.id, c.nom_client)}
                  title="Supprimer la commande"
                  aria-label="Supprimer la commande"
                  className="rounded-lg p-2 text-taupe transition-colors hover:bg-rosewood/10 hover:text-rosewood"
                >
                  <TrashIcon width={16} height={16} />
                </button>
              </div>
            </div>

            <ul className="mt-4 divide-y divide-line border-t border-line text-sm">
              {c.produits.map((p, i) => (
                <li key={i} className="flex justify-between py-2">
                  <span className="text-espresso">
                    {p.nom}{" "}
                    <span className="text-taupe">× {p.quantite}</span>
                  </span>
                  <span className="text-taupe">
                    {prixFormate(p.prix * p.quantite)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-line pt-3 text-sm font-medium text-espresso">
              <span>Total</span>
              <span>{prixFormate(c.total)}</span>
            </div>
          </div>
        ))}

        {!dataLoading && filtres.length === 0 && (
          <div className="rounded-2xl border border-line bg-white px-4 py-10 text-center text-sm text-taupe">
            Aucune commande{filtreActif ? " ne correspond à ces critères" : ""}.
          </div>
        )}
      </div>
    </div>
  );
}
