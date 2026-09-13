"use client";

import Link from "next/link";
import { prixFormate } from "../lib/content";
import { useAdmin } from "./_components/AdminProviders";
import { Badge, Card, CardTitle } from "./_components/ui";
import { BagIcon, CoinIcon, TagIcon } from "../components/icons";
import {
  barreStatutCommande,
  classeStatutCommande,
  dateCourte,
  niveauStock,
  repartitionStatuts,
  topProduitsVendus,
} from "./_lib/helpers";

export default function DashboardPage() {
  const { produits, commandes, dataLoading } = useAdmin();

  const commandesValides = commandes.filter((c) => c.statut !== "annulée");
  const ca = commandesValides.reduce((s, c) => s + (c.total || 0), 0);
  const panierMoyen = commandesValides.length
    ? ca / commandesValides.length
    : 0;
  const stockBas = produits.filter((p) => (p.stock ?? 0) <= 5);
  const repartition = repartitionStatuts(commandes);
  const topProduits = topProduitsVendus(commandes, 5);
  const maxVentes = Math.max(1, ...topProduits.map((p) => p.quantite));

  const stats = [
    { label: "Produits", valeur: produits.length, icon: TagIcon },
    { label: "Commandes", valeur: commandes.length, icon: BagIcon },
    { label: "Chiffre d'affaires", valeur: prixFormate(ca), icon: CoinIcon },
    { label: "Panier moyen", valeur: prixFormate(panierMoyen), icon: CoinIcon },
  ];

  if (dataLoading) {
    return <p className="text-sm text-taupe">Chargement des données…</p>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, valeur, icon: Icon }) => (
          <Card key={label} className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-taupe">
                {label}
              </p>
              <p className="mt-2 font-display text-3xl text-espresso">
                {valeur}
              </p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-cream text-rosewood">
              <Icon width={20} height={20} />
            </span>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Dernières commandes</CardTitle>
            <Link
              href="/admin/commandes"
              className="text-xs uppercase tracking-[0.12em] text-rosewood hover:underline"
            >
              Tout voir
            </Link>
          </div>
          <div className="mt-4 divide-y divide-line">
            {commandes.slice(0, 6).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-espresso">
                    {c.nom_client}
                  </p>
                  <p className="text-xs text-taupe">
                    {dateCourte(c.created_at)} · {prixFormate(c.total)}
                  </p>
                </div>
                <Badge className={classeStatutCommande(c.statut)}>
                  {c.statut}
                </Badge>
              </div>
            ))}
            {commandes.length === 0 && (
              <p className="py-3 text-sm text-taupe">Aucune commande.</p>
            )}
          </div>
        </Card>

        <Card>
          <CardTitle>Stock à surveiller</CardTitle>
          <div className="mt-4 space-y-2">
            {stockBas.map((p) => {
              const n = niveauStock(p.stock);
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-cream px-3 py-2.5"
                >
                  <span className="truncate text-sm text-espresso">
                    {p.nom}
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-taupe">
                    {p.stock ?? 0} en stock
                    <Badge className={n.classe}>{n.label}</Badge>
                  </span>
                </div>
              );
            })}
            {stockBas.length === 0 && (
              <p className="text-sm text-taupe">
                Tous les stocks sont confortables ✦
              </p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Commandes par statut</CardTitle>
          <div className="mt-5 space-y-4">
            {repartition.map(({ statut, total }) => {
              const pct = commandes.length
                ? Math.round((total / commandes.length) * 100)
                : 0;
              return (
                <div key={statut}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="capitalize text-espresso">{statut}</span>
                    <span className="text-taupe">
                      {total} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-cream">
                    <div
                      className={`h-full rounded-full ${barreStatutCommande(statut)}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {commandes.length === 0 && (
              <p className="text-sm text-taupe">Aucune commande pour l&apos;instant.</p>
            )}
          </div>
        </Card>

        <Card>
          <CardTitle>Produits les plus vendus</CardTitle>
          <div className="mt-5 space-y-4">
            {topProduits.map((p, i) => {
              const pct = Math.round((p.quantite / maxVentes) * 100);
              return (
                <div key={p.nom}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="truncate text-espresso">
                      <span className="mr-2 text-taupe">{i + 1}.</span>
                      {p.nom}
                    </span>
                    <span className="shrink-0 text-taupe">
                      {p.quantite} vendus
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-cream">
                    <div
                      className="h-full rounded-full bg-rosewood"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {topProduits.length === 0 && (
              <p className="text-sm text-taupe">
                Pas encore de vente enregistrée.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
